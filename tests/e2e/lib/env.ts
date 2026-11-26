/**
 * Settings shared by the e2e config, its setup scripts and the specs.
 *
 * The suite runs a production build (`npm run build` first) with `next start` on its own port
 * and its own database, `xlblog_e2e` on the DATABASE_URL server (E2E_DATABASE_URL overrides
 * it; the name must end in `_e2e`). The database is dropped and recreated on every run, so
 * the development database is never touched.
 */
import 'dotenv/config';

import path from 'node:path';

export const E2E_PORT = Number(process.env.E2E_PORT || 3003);
export const BASE_URL = `http://localhost:${E2E_PORT}`;

/** Test-only value for the e2e server: /next/revalidate/ and the jobs endpoint accept it. */
export const E2E_CRON_SECRET = 'e2eCronSecretForLocalTestsOnly';

/** Fake Google OAuth client: enables the sign-in endpoints; Google itself is never called. */
export const E2E_GOOGLE = {
  clientId: 'e2e-test-client.apps.googleusercontent.com',
  clientSecret: 'e2e-test-client-secret',
  allowedDomain: 'xmartlabs.com',
};

export const ROOT = path.resolve(import.meta.dirname, '../../..');
export const CACHE_DIR = path.join(ROOT, 'tests/e2e/.cache');
/** Written by prepare.ts (test users' generated passwords), read by the global setup. */
export const CREDENTIALS_FILE = path.join(CACHE_DIR, 'credentials.json');
export const EDITOR_STATE = path.join(CACHE_DIR, 'editor.json');
export const ADMIN_STATE = path.join(CACHE_DIR, 'admin.json');

export const databaseName = (url: string) =>
  decodeURIComponent(new URL(url).pathname.replace(/^\//, ''));

/** E2E_DATABASE_URL, or DATABASE_URL with the database name `xlblog_e2e`. */
export function e2eDatabaseUrl(
  env: Record<string, string | undefined> = process.env
): string {
  const explicit = env.E2E_DATABASE_URL?.trim();
  const base = env.DATABASE_URL?.trim();
  if (!explicit && !base) {
    throw new Error('Set DATABASE_URL (or E2E_DATABASE_URL) to run e2e tests.');
  }
  const url = new URL(explicit || base!);
  if (!explicit) url.pathname = '/xlblog_e2e';
  assertE2eDatabase(url.toString());
  if (
    base &&
    explicit &&
    databaseName(base) === databaseName(explicit) &&
    new URL(base).host === url.host
  ) {
    throw new Error(
      `Refusing to use the DATABASE_URL database ("${databaseName(base)}") for e2e tests.`
    );
  }
  return url.toString();
}

/** The e2e setup drops this database: only names ending in `_e2e`. */
export function assertE2eDatabase(url: string) {
  const name = databaseName(url);
  if (!name.endsWith('_e2e')) {
    throw new Error(
      `Refusing to use "${name}" for e2e tests: its name must end in "_e2e".`
    );
  }
}

export type Credentials = {
  editor: { email: string; password: string };
  admin: { email: string; password: string };
};

/** Seeded content (tests/e2e/seed.ts). Post slugs without digits (they're kebab-cased). */
export const SEED = {
  author: { slug: 'e2e-author', name: 'E2E Author' },
  categories: [
    { slug: 'e2e-development', name: 'E2E Development', order: 1 },
    { slug: 'e2e-design', name: 'E2E Design', order: 2 },
  ],
  posts: [
    {
      slug: 'seeded-post-one',
      title: 'E2E seeded post number one',
      category: 'e2e-development',
    },
    {
      slug: 'seeded-post-two',
      title: 'E2E seeded post number two',
      category: 'e2e-development',
    },
    {
      slug: 'seeded-post-three',
      title: 'E2E seeded post number three',
      category: 'e2e-design',
    },
  ],
  /**
   * Two imported posts (migration/legacy/), converted like the content import: one with
   * embeds (YouTube iframes, a tweet with Twitter's widgets.js, images) and one with code
   * blocks and images. Used by the CSP and accessibility checks.
   */
  legacyPosts: [
    { slug: 'crypto-landscape-2021', category: 'e2e-design' },
    { slug: 'react-native-line-2', category: 'e2e-development' },
  ],
} as const;
