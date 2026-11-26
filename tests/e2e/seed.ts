/**
 * Seeds the e2e database (run by prepare.ts with `payload run`, DATABASE_URL = the e2e
 * database): one author, two categories, three published posts plus two imported legacy
 * posts (embeds, code, images), a test editor and admin.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { getPayload } from 'payload';

import config from '@payload-config';
import { htmlToLexical } from '../../src/migration/html-to-lexical';
import { type Credentials, ROOT, SEED, assertE2eDatabase } from './lib/env';

assertE2eDatabase(process.env.DATABASE_URL ?? '');
const credentials = JSON.parse(
  readFileSync(process.env.E2E_CREDENTIALS_FILE!, 'utf8')
) as Credentials;

const payload = await getPayload({ config });
const context = { disableRevalidate: true };

const paragraph = (text: string) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: [
      {
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        textFormat: 0,
        textStyle: '',
        children: [
          {
            type: 'text',
            text,
            format: 0,
            style: '',
            mode: 'normal',
            detail: 0,
            version: 1,
          },
        ],
      },
    ],
  },
});

const author = await payload.create({
  collection: 'authors',
  data: { ...SEED.author },
  context,
});

const categoryIds = new Map<string, number>();
for (const category of SEED.categories) {
  const doc = await payload.create({
    collection: 'categories',
    data: { ...category },
    context,
  });
  categoryIds.set(category.slug, doc.id);
}

for (const [i, post] of SEED.posts.entries()) {
  await payload.create({
    collection: 'posts',
    data: {
      title: post.title,
      slug: post.slug,
      publishedDate: new Date(Date.UTC(2024, 0, 1 + i, 12)).toISOString(),
      category: categoryIds.get(post.category)!,
      author: author.id,
      tags: ['e2e'],
      content: paragraph(`Body of ${post.title}.`) as never,
      _status: 'published',
    },
    context,
  });
}

// Imported posts, as scripts/migrate-content.ts creates them (legacyImport context).
const legacyDir = path.join(ROOT, 'migration/legacy');
const legacyMeta = JSON.parse(
  readFileSync(path.join(legacyDir, 'posts.json'), 'utf8')
) as {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  thumbnail?: string;
}[];
for (const post of SEED.legacyPosts) {
  const meta = legacyMeta.find((p) => p.slug === post.slug)!;
  const body = readFileSync(
    path.join(legacyDir, 'bodies', `${post.slug}.html`),
    'utf8'
  );
  await payload.create({
    collection: 'posts',
    data: {
      title: meta.title,
      slug: meta.slug,
      publishedDate: `${meta.date}T12:00:00.000Z`,
      category: categoryIds.get(post.category)!,
      author: author.id,
      tags: meta.tags,
      thumbnailUrl: meta.thumbnail,
      content: htmlToLexical(body).content as never,
      _status: 'published',
    },
    context: { ...context, legacyImport: true },
  });
}

for (const role of ['editor', 'admin'] as const) {
  await payload.create({
    collection: 'users',
    data: {
      email: credentials[role].email,
      password: credentials[role].password,
      name: `E2E ${role}`,
      roles: [role],
    },
    context,
  });
}

payload.logger.info('[e2e] Seeded 1 author, 2 categories, 5 posts, 2 users.');
process.exit(0);
