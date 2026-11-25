/**
 * Compares migrated posts with the legacy rendering (migration/legacy/bodies/<slug>.html),
 * after whitespace normalization (src/migration/normalize-html.ts).
 *
 * - Always: reads each post from the database (Local API, published version) and renders
 *   its Lexical content with the site renderer.
 * - With `--url <base>` (e.g. http://localhost:3000): also fetches /blog/<slug>/ from the
 *   running site and compares its `.bodyPostContainer`.
 *
 * Usage: npx payload run scripts/compare-bodies.ts -- [--url http://localhost:3000] [slug ...]
 * Without slugs, every post in the database is compared.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import config from '@payload-config';
import { parse } from 'parse5';
import { getPayload } from 'payload';

import { lexicalToHTML } from '../src/components/rich-text/to-html';
import { normalizeHtml } from '../src/migration/normalize-html';

type P5Node = {
  nodeName: string;
  attrs?: { name: string; value: string }[];
  childNodes?: P5Node[];
  sourceCodeLocation?: {
    startTag?: { endOffset: number };
    endTag?: { startOffset: number };
  };
};

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const args = process.argv
  .slice(2)
  .flatMap((a) => a.split(/\s+/))
  .filter(Boolean);
const urlIdx = args.indexOf('--url');
const baseUrl = urlIdx >= 0 ? args.splice(urlIdx, 2)[1] : null;
const slugsArg = args.filter((a) => !a.startsWith('--'));

const findBody = (node: P5Node): P5Node | null => {
  if (
    node.attrs?.some(
      (a) =>
        a.name === 'class' && a.value.split(/\s+/).includes('bodyPostContainer')
    )
  ) {
    return node;
  }
  for (const child of node.childNodes ?? []) {
    const found = findBody(child);
    if (found) return found;
  }
  return null;
};

const pageBody = async (slug: string) => {
  const res = await fetch(`${baseUrl}/blog/${slug}/`);
  if (!res.ok) throw new Error(`GET /blog/${slug}/ → ${res.status}`);
  const html = await res.text();
  const body = findBody(
    parse(html, { sourceCodeLocationInfo: true }) as unknown as P5Node
  );
  const loc = body?.sourceCodeLocation;
  if (!loc?.startTag || !loc.endTag)
    throw new Error(`No .bodyPostContainer in /blog/${slug}/`);
  return html.slice(loc.startTag.endOffset, loc.endTag.startOffset);
};

const firstDiff = (a: string, b: string) => {
  const al = a.split('\n');
  const bl = b.split('\n');
  const i = al.findIndex((line, n) => line !== bl[n]);
  const idx = i === -1 ? al.length : i;
  return `top-level node ${idx}\n    legacy:   ${al[idx]?.slice(0, 400) ?? '(none)'}\n    rendered: ${bl[idx]?.slice(0, 400) ?? '(none)'}`;
};

async function main() {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: 'posts',
    where: slugsArg.length ? { slug: { in: slugsArg } } : {},
    limit: 1000,
    depth: 2,
    pagination: false,
  });

  let dbExact = 0;
  let pageExact = 0;
  for (const post of docs) {
    const legacy = normalizeHtml(
      readFileSync(
        path.join(root, 'migration/legacy/bodies', `${post.slug}.html`),
        'utf8'
      )
    );
    const rendered = normalizeHtml(lexicalToHTML(post.content as never));
    const lines = [
      `${rendered === legacy ? '✓' : '✗'} ${post.slug} (database render)`,
    ];
    if (rendered === legacy) dbExact++;
    else lines.push(`  first diff at ${firstDiff(legacy, rendered)}`);
    if (baseUrl) {
      const page = normalizeHtml(await pageBody(post.slug));
      if (page === legacy) pageExact++;
      lines.push(
        `${page === legacy ? '✓' : '✗'} ${post.slug} (page ${baseUrl}/blog/${post.slug}/)`
      );
      if (page !== legacy)
        lines.push(`  first diff at ${firstDiff(legacy, page)}`);
    }
    console.log(lines.join('\n'));
  }
  console.log(`\nDatabase render: ${dbExact}/${docs.length} exact`);
  if (baseUrl) console.log(`Pages: ${pageExact}/${docs.length} exact`);
}

await main();
process.exit(0);
