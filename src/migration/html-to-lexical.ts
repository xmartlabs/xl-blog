import crypto from 'node:crypto';

import type { Element, ElementContent, RootContent } from 'hast';
import { fromHtml } from 'hast-util-from-html';
import type { SerializedEditorState } from 'lexical';

import { lexicalToHTML } from '../components/rich-text/to-html';
import { normalizeHtml } from './normalize-html';

/**
 * Converts the legacy post body HTML (the verified Astro rendering of `.bodyPostContainer`)
 * into Lexical. Each top-level node becomes:
 * - a native Lexical node (paragraph, heading, list, quote, hr) when it only uses plain
 *   Markdown-like markup;
 * - a `code` block for Prism code wrappers, an `imageGallery` block (standalone) for bare
 *   images, a `video` block for the old <VideoPlayer> file markup;
 * - otherwise an `htmlEmbed` block with the exact source HTML (consecutive ones are merged).
 *
 * Every native conversion is checked: the node is rendered back with the site renderer and
 * must normalize to the same HTML as the source, otherwise it falls back to `htmlEmbed`.
 * So the rendered body always matches the legacy body.
 */

type LexicalNode = Record<string, unknown> & { type: string; version: number };

export interface ConversionStats {
  native: Record<string, number>;
  blocks: Record<string, number>;
  /** Why nodes fell back to htmlEmbed (tag → reason → count). */
  fallbacks: Record<string, number>;
  /** A few source snippets per fallback reason, for debugging. */
  examples?: Record<string, string[]>;
}

const FORMAT = {
  bold: 1,
  italic: 2,
  strikethrough: 4,
  code: 16,
  subscript: 32,
  superscript: 64,
};

class Unsupported extends Error {}

const objectId = () => crypto.randomBytes(12).toString('hex');

const attrs = (el: Element) => Object.keys(el.properties ?? {});
const hasNoAttrs = (el: Element) => attrs(el).length === 0;
const isWs = (n: ElementContent | RootContent) =>
  n.type === 'text' && /^\s*$/.test(n.value);
const elementChildren = (el: Element) =>
  el.children.filter((c): c is Element => c.type === 'element');

const textContent = (node: ElementContent | RootContent): string =>
  node.type === 'text'
    ? node.value
    : 'children' in node
      ? (node.children as ElementContent[]).map(textContent).join('')
      : '';

const textNode = (text: string, format: number): LexicalNode => ({
  type: 'text',
  version: 1,
  detail: 0,
  format,
  mode: 'normal',
  style: '',
  // Newlines inside Markdown paragraphs render as spaces; Lexical would show them as breaks.
  text: text.replace(/[ \t]*\n[ \t]*/g, ' '),
});

const elementBase = (children: LexicalNode[]) => ({
  children,
  direction: 'ltr' as const,
  format: '',
  indent: 0,
  version: 1,
});

/** Inline content: text, strong/b, em/i, del/s, sub/sup, inline code spans, links, br. */
function convertInline(
  nodes: ElementContent[],
  format = 0,
  inLink = false
): LexicalNode[] {
  const out: LexicalNode[] = [];
  for (const node of nodes) {
    if (node.type === 'comment') continue;
    if (node.type === 'text') {
      if (node.value) out.push(textNode(node.value, format));
      continue;
    }
    if (node.type !== 'element') throw new Unsupported('inline:other');
    const tag = node.tagName;
    if (tag === 'br' && hasNoAttrs(node)) {
      out.push({ type: 'linebreak', version: 1 });
      continue;
    }
    if (!hasNoAttrs(node) && !(tag === 'a'))
      throw new Unsupported(`inline:${tag}[attrs]`);
    switch (tag) {
      case 'strong':
      case 'b':
        out.push(...convertInline(node.children, format | FORMAT.bold, inLink));
        break;
      case 'em':
      case 'i':
        out.push(
          ...convertInline(node.children, format | FORMAT.italic, inLink)
        );
        break;
      case 'del':
      case 's':
        out.push(
          ...convertInline(node.children, format | FORMAT.strikethrough, inLink)
        );
        break;
      case 'sub':
        out.push(
          ...convertInline(node.children, format | FORMAT.subscript, inLink)
        );
        break;
      case 'sup':
        out.push(
          ...convertInline(node.children, format | FORMAT.superscript, inLink)
        );
        break;
      case 'span': {
        // Inline code: <span><code class="language-text">…</code></span>
        const [code] = node.children;
        const cls =
          code?.type === 'element' ? code.properties?.className : undefined;
        if (
          node.children.length !== 1 ||
          code.type !== 'element' ||
          code.tagName !== 'code' ||
          !Array.isArray(cls) ||
          cls.join(' ') !== 'language-text' ||
          attrs(code).length !== 1 ||
          !code.children.every((c) => c.type === 'text')
        ) {
          throw new Unsupported('inline:span');
        }
        out.push(textNode(textContent(code), format | FORMAT.code));
        break;
      }
      case 'a': {
        if (inLink) throw new Unsupported('inline:nested-a');
        const keys = attrs(node);
        if (keys.length !== 1 || keys[0] !== 'href')
          throw new Unsupported('inline:a[attrs]');
        out.push({
          ...elementBase(convertInline(node.children, format, true)),
          type: 'link',
          version: 3,
          fields: {
            url: String(node.properties.href),
            newTab: false,
            linkType: 'custom',
          },
        });
        break;
      }
      default:
        throw new Unsupported(`inline:${tag}`);
    }
  }
  return out;
}

const paragraph = (children: LexicalNode[]): LexicalNode => ({
  type: 'paragraph',
  ...elementBase(children),
  textFormat: 0,
  textStyle: '',
});

function convertList(el: Element): LexicalNode {
  const ordered = el.tagName === 'ol';
  const keys = attrs(el);
  if (keys.some((k) => !(ordered && k === 'start')))
    throw new Unsupported(`${el.tagName}[attrs]`);
  const start =
    ordered && el.properties.start ? Number(el.properties.start) : 1;
  const items: LexicalNode[] = [];
  let value = start;
  for (const child of el.children) {
    if (isWs(child)) continue;
    if (
      child.type !== 'element' ||
      child.tagName !== 'li' ||
      !hasNoAttrs(child)
    ) {
      throw new Unsupported('list:item');
    }
    // Tight list item: inline content, optionally followed by one nested list.
    const kids = [...child.children];
    while (kids.length && isWs(kids[kids.length - 1])) kids.pop();
    const last = kids[kids.length - 1];
    let nested: LexicalNode | null = null;
    if (
      last?.type === 'element' &&
      (last.tagName === 'ul' || last.tagName === 'ol')
    ) {
      nested = convertList(last);
      kids.pop();
    }
    const BLOCKS = [
      'p',
      'ul',
      'ol',
      'div',
      'pre',
      'blockquote',
      'table',
      'img',
    ];
    if (kids.some((k) => k.type === 'element' && BLOCKS.includes(k.tagName))) {
      throw new Unsupported('list:loose');
    }
    items.push({
      type: 'listitem',
      value: value++,
      ...elementBase(convertInline(kids)),
    });
    if (nested) {
      items.push({
        type: 'listitem',
        value: value++,
        ...elementBase([nested]),
      });
    }
  }
  return {
    type: 'list',
    listType: ordered ? 'number' : 'bullet',
    start,
    tag: ordered ? 'ol' : 'ul',
    ...elementBase(items),
  };
}

const block = (fields: Record<string, unknown>): LexicalNode => ({
  type: 'block',
  version: 2,
  format: '',
  fields: { id: objectId(), blockName: '', ...fields },
});

function convertCode(el: Element): LexicalNode {
  // <span><div class="code-highlight" data-language><pre class data-language><code class>
  const [div] = elementChildren(el);
  if (
    !hasNoAttrs(el) ||
    el.children.length !== 1 ||
    !div ||
    div.tagName !== 'div'
  ) {
    throw new Unsupported('span');
  }
  const cls = div.properties.className;
  if (!Array.isArray(cls) || cls.join(' ') !== 'code-highlight')
    throw new Unsupported('span');
  const [pre] = elementChildren(div);
  const [code] = pre ? elementChildren(pre) : [];
  if (!pre || pre.tagName !== 'pre' || !code || code.tagName !== 'code') {
    throw new Unsupported('span:code');
  }
  const language = String(div.properties.dataLanguage ?? 'text');
  return block({ blockType: 'code', language, code: textContent(code) });
}

function convertImage(el: Element): LexicalNode {
  const keys = attrs(el);
  if (!keys.includes('src') || keys.some((k) => k !== 'src' && k !== 'alt')) {
    throw new Unsupported('img[attrs]');
  }
  return block({
    blockType: 'imageGallery',
    images: [{ id: objectId(), url: String(el.properties.src) }],
    alt: el.properties.alt === undefined ? null : String(el.properties.alt),
    standalone: true,
  });
}

function convertVideo(el: Element): LexicalNode {
  // The old <VideoPlayer name="…" /> markup (no custom style).
  const p = el.properties;
  const src = String(p.src ?? '');
  const keys = attrs(el).sort().join(',');
  if (
    keys !== 'allowFullScreen,controls,height,src,title,width' ||
    !src.startsWith('/images/')
  ) {
    throw new Unsupported('video[attrs]');
  }
  return block({
    blockType: 'video',
    legacyName: src.slice('/images/'.length),
    title: String(p.title),
    width: String(p.width),
    height: String(p.height),
  });
}

function convertElement(
  el: Element,
  slugCheck: (text: string) => string
): LexicalNode {
  const tag = el.tagName;
  switch (tag) {
    case 'p':
      if (!hasNoAttrs(el)) throw new Unsupported('p[attrs]');
      return paragraph(convertInline(el.children));
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6': {
      const keys = attrs(el);
      // Markdown headings carry a generated id; the renderer regenerates the same one.
      if (keys.length > 1 || (keys.length === 1 && keys[0] !== 'id')) {
        throw new Unsupported(`${tag}[attrs]`);
      }
      const expected = slugCheck(textContent(el));
      if (keys.length === 0 || String(el.properties.id) !== expected) {
        throw new Unsupported(`${tag}[id]`);
      }
      return {
        type: 'heading',
        tag,
        ...elementBase(convertInline(el.children)),
      };
    }
    case 'ul':
    case 'ol':
      return convertList(el);
    case 'blockquote': {
      if (!hasNoAttrs(el)) throw new Unsupported('blockquote[attrs]');
      const kids = el.children.filter((c) => !isWs(c));
      const [p] = kids;
      if (
        kids.length !== 1 ||
        p.type !== 'element' ||
        p.tagName !== 'p' ||
        !hasNoAttrs(p)
      ) {
        throw new Unsupported('blockquote:multi');
      }
      return { type: 'quote', ...elementBase(convertInline(p.children)) };
    }
    case 'hr':
      if (!hasNoAttrs(el)) throw new Unsupported('hr[attrs]');
      return { type: 'horizontalrule', version: 1 };
    case 'span':
      return convertCode(el);
    case 'img':
      return convertImage(el);
    case 'video':
      return convertVideo(el);
    default:
      throw new Unsupported(tag);
  }
}

const state = (children: LexicalNode[]): SerializedEditorState =>
  ({
    root: { type: 'root', ...elementBase(children) },
  }) as unknown as SerializedEditorState;

const nodeKind = (node: LexicalNode) =>
  node.type === 'block'
    ? `block:${(node.fields as { blockType: string }).blockType}`
    : node.type;

export function htmlToLexical(html: string): {
  content: SerializedEditorState;
  stats: ConversionStats;
} {
  const stats: ConversionStats = { native: {}, blocks: {}, fallbacks: {} };
  const bump = (bucket: Record<string, number>, key: string) => {
    bucket[key] = (bucket[key] ?? 0) + 1;
  };
  const tree = fromHtml(html, { fragment: true });
  const out: LexicalNode[] = [];
  // Rendered so far, to give each heading the same deduplicated id it had.
  const converted: LexicalNode[] = [];
  let pending = null as { start: number; end: number } | null;
  // End offset of the last top-level node with a source position.
  let cursor = 0;
  // Elements the parser creates without source (e.g. <p></p> for a stray </p>) are embedded
  // together with the source gap they came from.
  let gapOpen = false;

  const flush = () => {
    if (!pending) return;
    out.push(
      block({
        blockType: 'htmlEmbed',
        html: html.slice(pending.start, pending.end),
      })
    );
    bump(stats.blocks, 'htmlEmbed');
    pending = null;
  };
  const addEmbed = (node: RootContent) => {
    const start = node.position?.start.offset;
    const end = node.position?.end.offset;
    if (start === undefined || end === undefined) {
      pending = pending ?? { start: cursor, end: cursor };
      gapOpen = true;
      return;
    }
    pending = pending
      ? { start: pending.start, end }
      : { start: gapOpen ? cursor : start, end };
    gapOpen = false;
  };
  const closeGap = (node: RootContent) => {
    if (gapOpen && pending && node.position)
      pending.end = node.position.start.offset ?? 0;
    gapOpen = false;
  };

  for (const node of tree.children) {
    if (node.position && !gapOpen) cursor = node.position.end.offset ?? 0;
    if (isWs(node) || node.type === 'comment') continue;
    if (node.type !== 'element' || !node.position) {
      bump(
        stats.fallbacks,
        node.type === 'element' ? `${node.tagName}:implied` : `#${node.type}`
      );
      addEmbed(node);
      continue;
    }
    let lexical: LexicalNode | null = null;
    try {
      // Heading ids are deduplicated per document: render the converted nodes so far plus a
      // probe heading to learn which id this text gets.
      const slugCheck = (text: string) => {
        const probe = {
          type: 'heading',
          tag: 'h6',
          ...elementBase([textNode(text, 0)]),
        };
        const rendered = lexicalToHTML(
          state([...converted.filter((n) => n.type === 'heading'), probe])
        );
        const ids = [...rendered.matchAll(/ id="([^"]*)"/g)].map((m) => m[1]);
        return ids[ids.length - 1] ?? '';
      };
      lexical = convertElement(node, slugCheck);
      // Verify the round trip on this node alone (headings: with the previous headings).
      const context =
        lexical.type === 'heading'
          ? converted.filter((n) => n.type === 'heading')
          : [];
      const normalized = normalizeHtml(
        lexicalToHTML(state([...context, lexical]))
      );
      const rendered = context.length
        ? normalized.split('\n').at(-1)
        : normalized;
      const source = normalizeHtml(
        html.slice(
          node.position.start.offset ?? 0,
          node.position.end.offset ?? 0
        )
      );
      if (rendered !== source)
        throw new Unsupported(`${node.tagName}:roundtrip`);
    } catch (error) {
      if (!(error instanceof Unsupported)) throw error;
      bump(stats.fallbacks, error.message);
      const examples = (stats.examples ??= {});
      const list = (examples[error.message] ??= []);
      if (list.length < 3) {
        list.push(
          html
            .slice(
              node.position.start.offset ?? 0,
              node.position.end.offset ?? 0
            )
            .slice(0, 400)
        );
      }
      lexical = null;
    }
    if (!lexical) {
      addEmbed(node);
      cursor = node.position.end.offset ?? 0;
      continue;
    }
    closeGap(node);
    flush();
    out.push(lexical);
    converted.push(lexical);
    bump(
      lexical.type === 'block' ? stats.blocks : stats.native,
      nodeKind(lexical).replace('block:', '')
    );
    cursor = node.position.end.offset ?? 0;
  }
  if (gapOpen && pending) pending.end = html.length;
  flush();
  return { content: state(out), stats };
}
