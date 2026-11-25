/**
 * Recreates the integration-test database and applies the migrations, like a production
 * deploy (`payload migrate` with schema push off). Runs once per `npm run test:int`.
 */
import { execFileSync } from 'node:child_process';
import path from 'node:path';

import pg from 'pg';

import { databaseName, maintenanceUrl, testDatabaseUrl } from './test-db';

export default async function setup() {
  const url = testDatabaseUrl();
  const name = databaseName(url);
  const client = new pg.Client({ connectionString: maintenanceUrl(url) });
  await client.connect();
  try {
    const quoted = `"${name.replace(/"/g, '""')}"`;
    await client.query(`DROP DATABASE IF EXISTS ${quoted} WITH (FORCE)`);
    await client.query(`CREATE DATABASE ${quoted}`);
  } finally {
    await client.end();
  }

  const root = path.resolve(import.meta.dirname, '../..');
  execFileSync(path.join(root, 'node_modules/.bin/payload'), ['migrate'], {
    cwd: root,
    stdio: ['ignore', 'ignore', 'inherit'],
    env: {
      ...process.env,
      DATABASE_URL: url,
      NODE_ENV: 'production',
      NODE_OPTIONS: '--no-deprecation',
      // No break-glass admin in the test database.
      FIRST_ADMIN_EMAIL: '',
      FIRST_ADMIN_PASSWORD: '',
    },
  });
}
