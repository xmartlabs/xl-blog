import escapeHTML from 'escape-html';
import GithubSlugger from 'github-slugger';
import {
  convertLexicalToHTML,
  type HTMLConverters,
} from '@payloadcms/richtext-lexical/html';
import type { SerializedEditorState, SerializedLexicalNode } from 'lexical';

import type {
  CodeBlock,
  HtmlEmbedBlock,
  ImageGalleryBlock,
  Media,
  TableBlock,
  VideoBlock,
} from '../../payload-types';
import { extractYouTubeId } from '../../lib/youtube';
import { highlightCode } from './highlight';

/**
 * Lexical → HTML for the post body (`.bodyPostContainer`).
 *
 * Why an HTML string (and not JSX converters): the post styles target direct children
 * (`.bodyPostContainer > p`, `> img`, `> div`, …), and legacy posts keep raw HTML (embeds,
 * styled <p>/<div>, tables) in `htmlEmbed` blocks. With JSX, raw HTML needs a wrapper element
 * for `dangerouslySetInnerHTML`, which changes the DOM and those selectors (`display: contents`
 * fixes layout but not `>` selectors or `:first-child`). Building one HTML string lets every
 * block, including raw HTML, become a direct child of `.bodyPostContainer` exactly as the
 * Gatsby/Astro markup did. It is also a pure, sync function: the migration uses it to verify
 * each converted node, and it can run in the browser for live preview.
 *
 * Markup rules (same as the old remark/rehype pipeline):
 * - code blocks: <span><div class="code-highlight" data-language><pre class="language-x"
 *   data-language><code class="language-x"> with Prism tokens; an empty <span> guards
 *   leading newlines;
 * - inline code: <span><code class="language-text">;
 * - standalone images: a bare <img>, never inside <p>;
 * - headings get GitHub-style ids; lists and quotes have no classes.
 */

type Node = SerializedLexicalNode & {
  children?: Node[];
  [key: string]: unknown;
};

const attr = (name: string, value: unknown) =>
  value === undefined || value === null
    ? ''
    : ` ${name}="${escapeHTML(String(value))}"`;

// Lexical text format bit flags.
const FORMAT = {
  bold: 1,
  italic: 2,
  strikethrough: 4,
  underline: 8,
  code: 16,
  subscript: 32,
  superscript: 64,
} as const;

// Wrapping tags, from outermost to innermost when two formats cover the same text.
const WRAPPERS: [number, string][] = [
  [FORMAT.superscript, 'sup'],
  [FORMAT.subscript, 'sub'],
  [FORMAT.underline, 'u'],
  [FORMAT.strikethrough, 'del'],
  [FORMAT.italic, 'em'],
  [FORMAT.bold, 'strong'],
];
const WRAPPED_BITS = WRAPPERS.reduce((all, [bit]) => all | bit, 0);

const formatOf = (node: Node) => Number(node.format) || 0;

const textToHTML = (node: Node) => {
  const format = formatOf(node);
  let html = escapeHTML(String(node.text ?? ''));
  if (format & FORMAT.code)
    html = `<span><code class="language-text">${html}</code></span>`;
  for (const [bit, tag] of [...WRAPPERS].reverse()) {
    if (format & bit) html = `<${tag}>${html}</${tag}>`;
  }
  return html;
};

type InlineItem = { node: Node; bits: number };

/** Formats shared by all text inside a link (rendered outside the <a>). */
const linkBits = (node: Node): number => {
  const texts: Node[] = [];
  const collect = (n: Node) =>
    n.type === 'text' ? texts.push(n) : (n.children ?? []).forEach(collect);
  collect(node);
  if (!texts.length) return 0;
  return texts.reduce((bits, t) => bits & formatOf(t), WRAPPED_BITS);
};

/**
 * Renders inline children (text, links, line breaks) with as few format tags as possible:
 * consecutive nodes that share a format get one wrapper, picking the longest run first. So
 * `**a `b` c**` renders as <strong>a <span><code>b</code></span> c</strong>, like Markdown.
 */
function inlineToHTML(
  items: InlineItem[],
  linkToHTML: (node: Node, skip: number) => string
): string {
  let html = '';
  let i = 0;
  while (i < items.length) {
    const { node, bits } = items[i];
    if (!bits) {
      if (node.type === 'text') {
        const keep = formatOf(node) & ~WRAPPED_BITS;
        html += textToHTML({ ...node, format: keep });
      } else if (node.type === 'link' || node.type === 'autolink') {
        html += linkToHTML(node, linkBits(node));
      } else if (node.type === 'linebreak') {
        html += '<br>';
      } else if (node.type === 'tab') {
        html += '\t';
      }
      i++;
      continue;
    }
    let best: [number, string] | null = null;
    let bestLen = 0;
    for (const wrapper of WRAPPERS) {
      if (!(bits & wrapper[0])) continue;
      let len = 0;
      while (i + len < items.length && items[i + len].bits & wrapper[0]) len++;
      if (len > bestLen) {
        best = wrapper;
        bestLen = len;
      }
    }
    const [bit, tag] = best!;
    const run = items
      .slice(i, i + bestLen)
      .map((item) => ({ ...item, bits: item.bits & ~bit }));
    html += `<${tag}>${inlineToHTML(run, linkToHTML)}</${tag}>`;
    i += bestLen;
  }
  return html;
}

const toItems = (nodes: Node[], skip = 0): InlineItem[] =>
  nodes.map((node) => ({
    node,
    bits:
      (node.type === 'text'
        ? formatOf(node)
        : node.type === 'link' || node.type === 'autolink'
          ? linkBits(node)
          : 0) &
      WRAPPED_BITS &
      ~skip,
  }));

const linkToHTML = (node: Node, skip: number): string => {
  const n = node as Node & { fields?: { url?: string; newTab?: boolean } };
  const children = (n.children ?? []).map((child) =>
    child.type === 'text'
      ? { ...child, format: formatOf(child) & ~skip }
      : child
  );
  const target = n.fields?.newTab
    ? ' target="_blank" rel="noopener noreferrer"'
    : '';
  return `<a${attr('href', n.fields?.url ?? '')}${target}>${inlineToHTML(toItems(children), linkToHTML)}</a>`;
};

/** Inline children of a paragraph-like node. Falls back to the generic converters for others. */
const childrenToHTML = (
  node: Node,
  nodesToHTML: (args: { nodes: SerializedLexicalNode[] }) => string[]
) => {
  const children = node.children ?? [];
  const inline = children.every((c) =>
    ['text', 'link', 'autolink', 'linebreak', 'tab'].includes(c.type)
  );
  return inline
    ? inlineToHTML(toItems(children), linkToHTML)
    : nodesToHTML({ nodes: children }).join('');
};

const mediaUrl = (value: unknown): string | null => {
  if (value && typeof value === 'object' && 'url' in value) {
    return (value as Media).url ?? null;
  }
  return null;
};

const MEDIA_BASE_URL = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL || '').replace(
  /\/+$/,
  ''
);

const styleString = (style: Record<string, string>) =>
  Object.entries(style)
    .map(([key, value]) => `${key}:${value}`)
    .join(';');

const videoToHTML = (fields: VideoBlock) => {
  const width = fields.width || '100%';
  const height = fields.height || '560px';
  const title = fields.title || 'Xmartlabs';
  const youtube = fields.youtubeUrlOrId?.trim();
  if (youtube) {
    const id = extractYouTubeId(youtube);
    return `<iframe${attr('width', width)}${attr('height', height)}${attr('src', `https://www.youtube.com/embed/${id}`)}${attr('title', title)} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>`;
  }
  const src =
    mediaUrl(fields.file) ??
    (fields.legacyName
      ? `${MEDIA_BASE_URL || '/images'}/${fields.legacyName}`
      : null);
  if (!src) return '';
  return `<video${attr('width', width)}${attr('height', height)}${attr('src', src)}${attr('title', title)} allowfullscreen="" controls=""></video>`;
};

const imageGalleryToHTML = (fields: ImageGalleryBlock) => {
  const sources = (fields.images ?? [])
    .map((image) => mediaUrl(image.image) ?? image.url)
    .filter((src): src is string => Boolean(src));
  if (!sources.length) return '';
  if (fields.standalone) {
    // Markdown image: one <img> per source.
    return sources
      .map((src) => `<img${attr('src', src)}${attr('alt', fields.alt)}>`)
      .join('\n');
  }
  // Same markup as the old <Image> MDX component.
  const multiple = sources.length > 1;
  const style = styleString({
    width: fields.width || '100%',
    height: fields.height || '315px',
    'object-fit': 'cover',
    'aspect-ratio': fields.aspectRatio || '16/9',
    margin: '0',
    padding: '0',
    display: multiple ? 'inline' : 'block',
  });
  const alt = fields.alt || 'Xmartlabs';
  if (!multiple)
    return `<img${attr('src', sources[0])}${attr('alt', alt)}${attr('style', style)}>`;
  const images = sources
    .map(
      (src, i) =>
        `<img${attr('src', src)}${attr('alt', `${alt} ${i + 1}`)}${attr('style', style)}>`
    )
    .join('');
  return `<div style="display:inline">${images}</div>`;
};

const tableToHTML = (fields: TableBlock) => {
  const headers = fields.headers ?? [];
  const head = headers
    .map(
      (h) =>
        `<th class="py-3 px-6 text-[0.65rem] font-semibold tracking-wider uppercase text-left">${escapeHTML(h)}</th>`
    )
    .join('');
  const rows = (fields.rows ?? [])
    .map((row, i) => {
      const cells = headers
        .map(
          (_, j) =>
            `<td class="py-4 px-2 align-top text-sm text-softNavy text-left">${escapeHTML(row.cells?.[j] ?? '-')}</td>`
        )
        .join('');
      return `<tr class="${i % 2 === 0 ? 'bg-white' : 'bg-dark2'}">${cells}</tr>`;
    })
    .join('');
  const title = fields.title
    ? `<div class="border-b border-slateBorder bg-white "><h2 class="text-lg font-semibold text-softNavy mt-0">${escapeHTML(fields.title)}</h2></div>`
    : '';
  // Same markup as the old <Table> MDX component.
  return `<div class="w-full overflow-hidden">${title}<div class="w-full overflow-x-auto"><table class="w-full min-w-[640px] table-fixed"><thead><tr class="bg-white">${head}</tr></thead><tbody>${rows}</tbody></table></div></div>`;
};

export const codeToHTML = (fields: Pick<CodeBlock, 'code' | 'language'>) => {
  const lang = (fields.language || 'text').trim().toLowerCase() || 'text';
  const code = fields.code ?? '';
  // The empty <span> keeps leading newlines (HTML parsers drop one right after <pre>).
  const guard = code.startsWith('\n') ? '<span></span>' : '';
  return `<span><div class="code-highlight"${attr('data-language', lang)}><pre${attr('class', `language-${lang}`)}${attr('data-language', lang)}><code${attr('class', `language-${lang}`)}>${guard}${highlightCode(code, lang)}</code></pre></div></span>`;
};

/** Plain text of a node (for heading ids). */
const textContent = (node: Node): string =>
  node.type === 'text'
    ? String(node.text ?? '')
    : node.type === 'linebreak'
      ? '\n'
      : (node.children ?? []).map(textContent).join('');

const buildConverters = (slugger: GithubSlugger): HTMLConverters => ({
  text: ({ node }) => textToHTML(node as Node),
  linebreak: '<br>',
  tab: '\t',
  horizontalrule: '<hr>',
  paragraph: ({ node, nodesToHTML }) => {
    const children = childrenToHTML(node as Node, nodesToHTML);
    return `<p>${children || '<br>'}</p>`;
  },
  heading: ({ node, nodesToHTML }) => {
    const n = node as Node & { tag?: string };
    const tag = /^h[1-6]$/.test(n.tag ?? '') ? n.tag : 'h2';
    const children = childrenToHTML(n, nodesToHTML);
    const id = slugger.slug(textContent(n));
    return `<${tag}${id ? attr('id', id) : ''}>${children}</${tag}>`;
  },
  quote: ({ node, nodesToHTML }) => {
    const children = childrenToHTML(node as Node, nodesToHTML);
    return `<blockquote>\n<p>${children}</p>\n</blockquote>`;
  },
  list: ({ node, nodesToHTML }) => {
    const n = node as Node & {
      tag?: string;
      start?: number;
      listType?: string;
    };
    const tag = n.tag === 'ol' || n.listType === 'number' ? 'ol' : 'ul';
    const start =
      tag === 'ol' && n.start && n.start !== 1 ? attr('start', n.start) : '';
    // Lexical stores a nested list as its own list item after its parent item; HTML nests it
    // inside the previous <li>.
    const items: string[] = [];
    for (const item of n.children ?? []) {
      const kids = item.children ?? [];
      const nestedOnly =
        kids.length > 0 && kids.every((k) => k.type === 'list');
      const html = childrenToHTML(item, nodesToHTML);
      if (nestedOnly && items.length) {
        items[items.length - 1] = items[items.length - 1].replace(
          /<\/li>$/,
          `\n${html}\n</li>`
        );
      } else {
        items.push(`<li>${html}</li>`);
      }
    }
    return `<${tag}${start}>\n${items.join('\n')}\n</${tag}>`;
  },
  listitem: ({ node, nodesToHTML }) =>
    `<li>${childrenToHTML(node as Node, nodesToHTML)}</li>`,
  link: ({ node }) => linkToHTML(node as Node, 0),
  autolink: ({ node }) => linkToHTML(node as Node, 0),
  upload: ({ node }) => {
    const n = node as Node & { value?: unknown };
    const media = n.value as Media | undefined;
    const url = mediaUrl(media);
    return url
      ? `<img${attr('src', url)}${attr('alt', media?.alt ?? '')}>`
      : '';
  },
  blocks: {
    code: ({ node }) =>
      codeToHTML((node as unknown as { fields: CodeBlock }).fields),
    htmlEmbed: ({ node }) =>
      (node as unknown as { fields: HtmlEmbedBlock }).fields.html ?? '',
    imageGallery: ({ node }) =>
      imageGalleryToHTML(
        (node as unknown as { fields: ImageGalleryBlock }).fields
      ),
    video: ({ node }) =>
      videoToHTML((node as unknown as { fields: VideoBlock }).fields),
    table: ({ node }) =>
      tableToHTML((node as unknown as { fields: TableBlock }).fields),
  },
  unknown: () => '',
});

/** Renders a post body (Lexical state) to the HTML that goes inside `.bodyPostContainer`. */
export function lexicalToHTML(
  data: SerializedEditorState | null | undefined
): string {
  if (!data?.root) return '';
  const converters = buildConverters(new GithubSlugger());
  const nodes = data.root.children as Node[];
  // One top-level node per line, like the old Markdown output (whitespace between blocks is
  // not significant).
  return nodes
    .map((node) =>
      convertLexicalToHTML({
        converters,
        data: {
          root: { ...data.root, children: [node] },
        } as SerializedEditorState,
        disableContainer: true,
        disableIndent: true,
        disableTextAlign: true,
      })
    )
    .filter(Boolean)
    .join('\n');
}
