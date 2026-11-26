/**
 * Seeds the e2e database (run by prepare.ts with `payload run`, DATABASE_URL = the e2e
 * database): one author, two categories, three published posts, a test editor and admin.
 */
import { readFileSync } from 'node:fs';

import { getPayload } from 'payload';

import config from '@payload-config';
import { type Credentials, SEED, assertE2eDatabase } from './lib/env';

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

payload.logger.info('[e2e] Seeded 1 author, 2 categories, 3 posts, 2 users.');
process.exit(0);
