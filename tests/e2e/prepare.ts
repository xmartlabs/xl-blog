/**
 * Runs right before the e2e server starts (the `webServer` command in playwright.config.ts):
 * recreates the e2e database, applies the migrations like a deploy (`payload migrate`, schema
 * push off), generates the test users' passwords and seeds the content (seed.ts).
 *
 * The passwords are random per run, exist only in the e2e database and in
 * tests/e2e/.cache/credentials.json (git-ignored).
 */
import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import pg from 'pg';

import {
  CACHE_DIR,
  CREDENTIALS_FILE,
  type Credentials,
  ROOT,
  assertE2eDatabase,
  databaseName,
} from './lib/env';

const url = process.env.E2E_DATABASE_URL;
if (!url)
  throw new Error('E2E_DATABASE_URL is not set (see playwright.config.ts).');
assertE2eDatabase(url);
const name = databaseName(url);

const maintenance = new URL(url);
maintenance.pathname = '/postgres';
const client = new pg.Client({ connectionString: maintenance.toString() });
await client.connect();
try {
  const quoted = `"${name.replace(/"/g, '""')}"`;
  await client.query(`DROP DATABASE IF EXISTS ${quoted} WITH (FORCE)`);
  await client.query(`CREATE DATABASE ${quoted}`);
} finally {
  await client.end();
}

const env: NodeJS.ProcessEnv = {
  ...process.env,
  DATABASE_URL: url,
  NODE_ENV: 'production',
  NODE_OPTIONS: '--no-deprecation',
  // No break-glass admin from .env in the e2e database.
  FIRST_ADMIN_EMAIL: '',
  FIRST_ADMIN_PASSWORD: '',
};
const payloadBin = path.join(ROOT, 'node_modules/.bin/payload');
execFileSync(payloadBin, ['migrate'], {
  cwd: ROOT,
  stdio: ['ignore', 'ignore', 'inherit'],
  env,
});

const password = () => crypto.randomBytes(18).toString('base64url');
const credentials: Credentials = {
  editor: { email: 'e2e-editor@example.test', password: password() },
  admin: { email: 'e2e-admin@example.test', password: password() },
};
mkdirSync(CACHE_DIR, { recursive: true });
writeFileSync(CREDENTIALS_FILE, JSON.stringify(credentials), { mode: 0o600 });

execFileSync(payloadBin, ['run', 'tests/e2e/seed.ts'], {
  cwd: ROOT,
  stdio: ['ignore', 'ignore', 'inherit'],
  env: { ...env, E2E_CREDENTIALS_FILE: CREDENTIALS_FILE },
});

console.log(`[e2e] Database ${name} recreated, migrated and seeded.`);
