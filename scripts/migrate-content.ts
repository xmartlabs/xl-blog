/**
 * Imports the legacy blog content into Payload (idempotent: upserts by slug).
 *
 * 1. Categories and authors from content/categories/*.yml and content/authors/*.yml
 *    (the file name is the slug, e.g. `mtnBarreto`).
 * 2. Posts from migration/legacy/posts.json + migration/legacy/bodies/<slug>.html (the
 *    verified Astro rendering), converted to Lexical by src/migration/html-to-lexical.ts.
 *    Posts are published with their original dates.
 *
 * Usage:
 *   npm run seed:migrate-content                       # every post
 *   npm run seed:migrate-content -- --only a-look-back-at-2020 vytallink-app
 *   MIGRATE_ONLY=a-look-back-at-2020,vytallink-app npm run seed:migrate-content
 */
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import config from '@payload-config';
import { getPayload, type Payload } from 'payload';
import YAML from 'yaml';

import {
  htmlToLexical,
  type ConversionStats,
} from '../src/migration/html-to-lexical';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const legacyDir = path.join(root, 'migration/legacy');

interface LegacyPost {
  slug: string;
  title: string;
  subtitle: string | null;
  permalink: string;
  featured: boolean;
  date: string;
  category: string;
  author: string;
  tags: string[];
  thumbnail: string | null;
  readingTime: string;
  sourceFile: string;
}

const selectedSlugs = (): string[] | null => {
  const args = process.argv.slice(2);
  const i = args.indexOf('--only');
  const fromArgs =
    i >= 0
      ? args
          .slice(i + 1)
          .filter((a) => !a.startsWith('--'))
          .flatMap((a) => a.split(/[\s,]+/))
      : [];
  const fromEnv = (process.env.MIGRATE_ONLY ?? '').split(',');
  const slugs = [...fromArgs, ...fromEnv].map((s) => s.trim()).filter(Boolean);
  return slugs.length ? slugs : null;
};

const readYamlDir = (dir: string) =>
  readdirSync(path.join(root, dir))
    .filter((f) => /\.ya?ml$/.test(f))
    .sort()
    .map((f) => ({
      slug: f.replace(/\.ya?ml$/, ''),
      data: YAML.parse(readFileSync(path.join(root, dir, f), 'utf8')) as Record<
        string,
        unknown
      >,
    }));

async function upsertBySlug(
  payload: Payload,
  collection: 'authors' | 'categories',
  slug: string,
  data: Record<string, unknown>
): Promise<number> {
  const existing = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  });
  const doc = existing.docs[0]
    ? await payload.update({
        collection,
        id: existing.docs[0].id,
        data,
        depth: 0,
        context: { disableRevalidate: true },
      })
    : await payload.create({
        collection,
        data: { ...data, slug } as never,
        depth: 0,
        context: { disableRevalidate: true },
      });
  return doc.id as number;
}

const str = (value: unknown) =>
  typeof value === 'string' && value.trim() ? value : null;

async function main() {
  const payload = await getPayload({ config });

  const categoryIds = new Map<string, number>();
  for (const { slug, data } of readYamlDir('content/categories')) {
    categoryIds.set(
      slug,
      await upsertBySlug(payload, 'categories', slug, {
        name: data.name,
        order: typeof data.order === 'number' ? data.order : 99,
        showInFilters: data.show_in_filters !== false,
      })
    );
  }
  payload.logger.info(`Categories: ${categoryIds.size}`);

  const authorIds = new Map<string, number>();
  for (const { slug, data } of readYamlDir('content/authors')) {
    authorIds.set(
      slug,
      await upsertBySlug(payload, 'authors', slug, {
        name: data.name,
        imageUrl: str(data.image),
        profileUrl: str(data.profile_url),
        github: str(data.github),
        twitter: str(data.twitter),
      })
    );
  }
  payload.logger.info(`Authors: ${authorIds.size}`);

  const posts = JSON.parse(
    readFileSync(path.join(legacyDir, 'posts.json'), 'utf8')
  ) as LegacyPost[];
  const only = selectedSlugs();
  if (only) {
    const missing = only.filter((s) => !posts.some((p) => p.slug === s));
    if (missing.length)
      throw new Error(`Unknown post slugs: ${missing.join(', ')}`);
  }
  const selected = only ? posts.filter((p) => only.includes(p.slug)) : posts;

  const totals: ConversionStats = { native: {}, blocks: {}, fallbacks: {} };
  const add = (a: Record<string, number>, b: Record<string, number>) => {
    for (const [k, v] of Object.entries(b)) a[k] = (a[k] ?? 0) + v;
  };

  for (const post of selected) {
    const body = readFileSync(
      path.join(legacyDir, 'bodies', `${post.slug}.html`),
      'utf8'
    );
    const { content, stats } = htmlToLexical(body);
    add(totals.native, stats.native);
    add(totals.blocks, stats.blocks);
    add(totals.fallbacks, stats.fallbacks);

    const category = categoryIds.get(post.category);
    const author = authorIds.get(post.author);
    if (!category)
      throw new Error(`${post.slug}: unknown category ${post.category}`);
    if (!author) throw new Error(`${post.slug}: unknown author ${post.author}`);

    const data = {
      title: post.title,
      subtitle: post.subtitle,
      slug: post.slug,
      // Date-only: noon UTC, so the day is the same in every time zone.
      publishedDate: `${post.date}T12:00:00.000Z`,
      category,
      author,
      tags: post.tags,
      thumbnailUrl: post.thumbnail,
      featured: post.featured,
      legacyReadingTime: post.readingTime,
      legacySourceFile: post.sourceFile,
      content: content as never,
      _status: 'published' as const,
    };
    // Old posts break some editorial rules (title length, tag count).
    const context = { legacyImport: true };

    const existing = await payload.find({
      collection: 'posts',
      where: { slug: { equals: post.slug } },
      limit: 1,
      depth: 0,
      draft: true,
    });
    if (existing.docs[0]) {
      await payload.update({
        collection: 'posts',
        id: existing.docs[0].id,
        data,
        context,
        depth: 0,
      });
      payload.logger.info(`Updated /blog/${post.slug}/`);
    } else {
      await payload.create({ collection: 'posts', data, context, depth: 0 });
      payload.logger.info(`Created /blog/${post.slug}/`);
    }
  }

  payload.logger.info(
    `Posts: ${selected.length}. Native nodes: ${JSON.stringify(totals.native)}. Blocks: ${JSON.stringify(totals.blocks)}. Fallbacks: ${JSON.stringify(totals.fallbacks)}`
  );
}

/**
 * Pages pre-rendered before the import (home, tags, sitemap on a first deploy) keep their old
 * content until revalidated. With REVALIDATE_URL (the site's origin, e.g.
 * https://blog.xmartlabs.com) and CRON_SECRET set, ask the running site to regenerate them.
 */
async function revalidateSite() {
  const origin = process.env.REVALIDATE_URL?.replace(/\/+$/, '');
  if (!origin) {
    console.log(
      'Done. If the site is already deployed, revalidate it: set REVALIDATE_URL and CRON_SECRET and run again, or POST to <site>/next/revalidate/ with `Authorization: Bearer $CRON_SECRET`.'
    );
    return;
  }
  const response = await fetch(`${origin}/next/revalidate/`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.CRON_SECRET ?? ''}` },
  });
  if (!response.ok) {
    throw new Error(`Revalidating ${origin} failed: HTTP ${response.status}`);
  }
  console.log(`Revalidated ${origin}`);
}

await main();
await revalidateSite();
process.exit(0);
