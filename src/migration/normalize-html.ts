import type { Element, ElementContent, Root, RootContent } from 'hast';
import { fromHtml } from 'hast-util-from-html';
import { toHtml } from 'hast-util-to-html';

/**
 * Canonical form of an HTML fragment, for comparing rendered post bodies with the legacy
 * ones. Two fragments normalize to the same string when browsers build the same DOM, except
 * for whitespace that cannot change the rendering:
 * - whitespace-only text between block-level siblings (or directly inside list/table/quote
 *   containers and the root) is dropped;
 * - runs of whitespace inside text collapse to one space, and text at the start/end of a
 *   block (p, li, h1–h6, …) is trimmed;
 * - <pre> content is kept byte for byte.
 * Attribute order/quoting and character references are canonicalized by the parser.
 */

const BLOCK = new Set([
  'address',
  'article',
  'aside',
  'blockquote',
  'details',
  'dialog',
  'dd',
  'div',
  'dl',
  'dt',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'header',
  'hr',
  'li',
  'main',
  'nav',
  'ol',
  'p',
  'pre',
  'section',
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'tr',
  'ul',
  'iframe',
  'video',
  'script',
  'style',
  'br',
]);
const CONTAINERS = new Set([
  'ul',
  'ol',
  'table',
  'tbody',
  'thead',
  'tfoot',
  'tr',
  'blockquote',
  'dl',
  'figure',
  'div',
  'section',
  'article',
  'aside',
]);
const TRIM_EDGES = new Set([
  'p',
  'li',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'td',
  'th',
  'figcaption',
  'blockquote',
  'div',
]);

type Parent = Root | Element;

const isBlock = (node: RootContent | ElementContent | undefined) =>
  node?.type === 'element' && BLOCK.has(node.tagName);

const isWhitespace = (node: RootContent | ElementContent) =>
  node.type === 'text' && /^\s*$/.test(node.value);

function normalizeChildren(parent: Parent) {
  const tag = parent.type === 'root' ? 'root' : parent.tagName;
  if (
    tag === 'pre' ||
    tag === 'script' ||
    tag === 'style' ||
    tag === 'textarea'
  )
    return;

  // Drop comments.
  let children = (parent.children as (RootContent | ElementContent)[]).filter(
    (c) => c.type !== 'comment' && c.type !== 'doctype'
  );

  children = children.filter((child, i) => {
    if (!isWhitespace(child)) return true;
    if (tag === 'root' || CONTAINERS.has(tag)) {
      // Whitespace between blocks (or at the edges) in a container is not rendered.
      const prev = children[i - 1];
      const next = children[i + 1];
      if (!prev || !next || isBlock(prev) || isBlock(next)) return false;
      return true;
    }
    return !(isBlock(children[i - 1]) || isBlock(children[i + 1]));
  });

  for (const child of children) {
    if (child.type === 'text') child.value = child.value.replace(/\s+/g, ' ');
  }

  if (TRIM_EDGES.has(tag) || tag === 'root') {
    const first = children[0];
    if (first?.type === 'text') first.value = first.value.replace(/^\s+/, '');
    const last = children[children.length - 1];
    if (last?.type === 'text') last.value = last.value.replace(/\s+$/, '');
    // Text next to a block child is at a block edge too.
    children.forEach((child, i) => {
      if (child.type !== 'text') return;
      if (isBlock(children[i - 1]))
        child.value = child.value.replace(/^\s+/, '');
      if (isBlock(children[i + 1]))
        child.value = child.value.replace(/\s+$/, '');
    });
    children = children.filter((c) => c.type !== 'text' || c.value !== '');
  }

  parent.children = children as typeof parent.children;
  for (const child of children) {
    if (child.type === 'element') normalizeChildren(child);
  }
}

export function normalizeHtml(html: string): string {
  const tree = fromHtml(html, { fragment: true });
  normalizeChildren(tree);
  // One top-level node per line so diffs are readable.
  return tree.children
    .map((child) => toHtml(child as RootContent, { allowDangerousHtml: true }))
    .join('\n');
}
