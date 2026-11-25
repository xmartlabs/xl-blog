// Snapshots the legacy content before the Astro build is removed.
//
// Inputs:  blogs/*.md|mdx (frontmatter) and dist/blog/<slug>/index.html (verified Astro build).
// Outputs: migration/legacy/posts.json and migration/legacy/bodies/<slug>.html, where each
//          body is the exact source text between the `.bodyPostContainer` start and end tags.
//
// Usage: node scripts/snapshot-legacy.mjs
import {
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
  existsSync,
} from 'node:fs';
import { join } from 'node:path';
import kebabCase from 'lodash/kebabCase.js';
import { parse } from 'parse5';
import YAML from 'yaml';

const root = new URL('..', import.meta.url).pathname;
const blogsDir = join(root, 'blogs');
const distDir = join(root, 'dist/blog');
const outDir = join(root, 'migration/legacy');
const bodiesDir = join(outDir, 'bodies');
const EXPECTED = 175;

mkdirSync(bodiesDir, { recursive: true });

const readFrontmatter = (file) => {
  const src = readFileSync(join(blogsDir, file), 'utf8');
  const match = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error(`No frontmatter in ${file}`);
  return YAML.parse(match[1]);
};

const toDate = (value) => {
  // YAML parses `2012-09-03` as a string (yaml v2 core schema); normalize anyway.
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) throw new Error(`Bad date: ${value}`);
  return date.toISOString().slice(0, 10);
};

const findBody = (node) => {
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

const readPage = (slug) =>
  readFileSync(join(distDir, slug, 'index.html'), 'utf8');

/** The "N min read" label, computed by the old site from the Markdown source. */
const readingTime = (slug) => {
  const match = readPage(slug).match(/(\d+ min read)/);
  if (!match) throw new Error(`No reading time in ${slug}`);
  return match[1];
};

const bodyHtml = (slug) => {
  const html = readPage(slug);
  const doc = parse(html, { sourceCodeLocationInfo: true });
  const el = findBody(doc);
  if (!el) throw new Error(`No .bodyPostContainer in ${slug}`);
  const loc = el.sourceCodeLocation;
  return html.slice(loc.startTag.endOffset, loc.endTag.startOffset);
};

const files = readdirSync(blogsDir)
  .filter((f) => /\.mdx?$/.test(f))
  .sort();
const posts = [];
const seen = new Set();
for (const file of files) {
  const fm = readFrontmatter(file);
  const slug = kebabCase(fm.permalink);
  if (seen.has(slug)) throw new Error(`Duplicate slug ${slug}`);
  seen.add(slug);
  if (!existsSync(join(distDir, slug, 'index.html'))) {
    throw new Error(`Missing dist/blog/${slug}/index.html for ${file}`);
  }
  writeFileSync(join(bodiesDir, `${slug}.html`), bodyHtml(slug));
  posts.push({
    slug,
    title: fm.title,
    subtitle: fm.subtitle ?? null,
    permalink: fm.permalink,
    featured: fm.featured ?? false,
    date: toDate(fm.date),
    category: fm.category,
    author: fm.author,
    tags: (fm.tags ?? []).map(String),
    thumbnail: fm.thumbnail ?? null,
    readingTime: readingTime(slug),
    sourceFile: file,
  });
}

const distSlugs = readdirSync(distDir).filter((d) =>
  existsSync(join(distDir, d, 'index.html'))
);
const bodyCount = readdirSync(bodiesDir).filter((f) =>
  f.endsWith('.html')
).length;
console.log(
  `sources=${files.length} posts=${posts.length} dist=${distSlugs.length} bodies=${bodyCount}`
);
if (
  posts.length !== EXPECTED ||
  distSlugs.length !== EXPECTED ||
  bodyCount !== EXPECTED
) {
  throw new Error(`Expected ${EXPECTED} everywhere`);
}
const extra = distSlugs.filter((s) => !seen.has(s));
if (extra.length)
  throw new Error(`dist posts without a source: ${extra.join(', ')}`);

writeFileSync(
  join(outDir, 'posts.json'),
  JSON.stringify(posts, null, 2) + '\n'
);
console.log('Wrote migration/legacy/posts.json and bodies/*.html');
