/**
 * End-to-end tests against a production build: `npm run build`, then `npm run test:e2e`.
 *
 * The web server command first runs prepare.ts (recreates, migrates and seeds the
 * `xlblog_e2e` database), then `next start` on port 3003 pointed at that database, with a
 * test CRON_SECRET and a fake Google OAuth client. global-setup.ts then signs the test
 * editor and admin in through POST /api/users/login and saves their sessions.
 */
import { defineConfig } from '@playwright/test';

import {
  BASE_URL,
  E2E_CRON_SECRET,
  E2E_GOOGLE,
  E2E_PORT,
  ROOT,
  e2eDatabaseUrl,
} from './lib/env';

const databaseUrl = e2eDatabaseUrl();

export default defineConfig({
  testDir: '.',
  testMatch: '*.spec.ts',
  // One server and one database shared by every test: run them one after another.
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  forbidOnly: Boolean(process.env.CI),
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: process.env.CI ? [['list'], ['github']] : [['list']],
  outputDir: './.cache/test-output',
  globalSetup: './global-setup.ts',
  use: {
    baseURL: BASE_URL,
    browserName: 'chromium',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `npx tsx tests/e2e/prepare.ts && npx next start -p ${E2E_PORT}`,
    cwd: ROOT,
    url: `${BASE_URL}/admin/login/`,
    // Never test against a server started elsewhere (it may use another database).
    reuseExistingServer: false,
    timeout: 180_000,
    stdout: 'pipe',
    stderr: 'pipe',
    env: {
      E2E_DATABASE_URL: databaseUrl,
      DATABASE_URL: databaseUrl,
      NODE_OPTIONS: '--no-deprecation',
      NEXT_TELEMETRY_DISABLED: '1',
      NEXT_PUBLIC_SERVER_URL: BASE_URL,
      CRON_SECRET: E2E_CRON_SECRET,
      GOOGLE_CLIENT_ID: E2E_GOOGLE.clientId,
      GOOGLE_CLIENT_SECRET: E2E_GOOGLE.clientSecret,
      GOOGLE_ALLOWED_DOMAIN: E2E_GOOGLE.allowedDomain,
      DISABLE_PASSWORD_LOGIN: '',
      FIRST_ADMIN_EMAIL: '',
      FIRST_ADMIN_PASSWORD: '',
      // Never email anyone from tests.
      RESEND_API_KEY: '',
      // Uploads (none in these tests) stay on local disk.
      BLOB_READ_WRITE_TOKEN: '',
    },
  },
});
