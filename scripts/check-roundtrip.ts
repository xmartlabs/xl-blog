// Offline check (no database): converts every legacy body to Lexical, renders it back and
// compares with the legacy HTML after whitespace normalization. Also prints conversion stats.
//
// Usage: npx tsx scripts/check-roundtrip.ts [slug ...]
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { lexicalToHTML } from '../src/components/rich-text/to-html';
import {
  htmlToLexical,
  type ConversionStats,
} from '../src/migration/html-to-lexical';
import { normalizeHtml } from '../src/migration/normalize-html';

const dir = join(import.meta.dirname, '../migration/legacy/bodies');
// --examples <reason>: print source snippets that fell back to htmlEmbed for that reason.
const args = process.argv.slice(2);
const exampleIdx = args.indexOf('--examples');
const exampleReason = exampleIdx >= 0 ? args.splice(exampleIdx, 2)[1] : null;
const only = args;
const slugs = (
  only.length ? only : readdirSync(dir).map((f) => f.replace(/\.html$/, ''))
).sort();

const total: ConversionStats = { native: {}, blocks: {}, fallbacks: {} };
const merge = (a: Record<string, number>, b: Record<string, number>) => {
  for (const [k, v] of Object.entries(b)) a[k] = (a[k] ?? 0) + v;
};
let exact = 0;
const mismatched: string[] = [];
for (const slug of slugs) {
  const legacy = readFileSync(join(dir, `${slug}.html`), 'utf8');
  const { content, stats } = htmlToLexical(legacy);
  merge(total.native, stats.native);
  merge(total.blocks, stats.blocks);
  merge(total.fallbacks, stats.fallbacks);
  if (exampleReason) {
    for (const snippet of stats.examples?.[exampleReason] ?? []) {
      console.log(`--- ${slug}\n${snippet}`);
    }
  }
  const a = normalizeHtml(legacy);
  const b = normalizeHtml(lexicalToHTML(content));
  if (a === b) exact++;
  else {
    mismatched.push(slug);
    const al = a.split('\n');
    const bl = b.split('\n');
    const i = al.findIndex((line, n) => line !== bl[n]);
    console.log(
      `\n✗ ${slug} (first diff at top-level node ${i})\n  legacy: ${al[i]?.slice(0, 300)}\n  render: ${bl[i]?.slice(0, 300)}`
    );
  }
}
console.log(`\nExact matches: ${exact}/${slugs.length}`);
if (mismatched.length) console.log(`Mismatched: ${mismatched.join(', ')}`);
console.log('Native nodes:', total.native);
console.log('Blocks:', total.blocks);
console.log(
  'Fallback reasons:',
  Object.fromEntries(
    Object.entries(total.fallbacks).sort((x, y) => y[1] - x[1])
  )
);
