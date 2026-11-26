/**
 * Runs after the web server is up (Playwright starts `webServer` before the global setup):
 * regenerates the pages that the build pre-rendered from another database, then signs the
 * test editor and admin in through the real REST login endpoint and saves their sessions
 * (`payload-token` cookie) for the specs.
 */
import { readFileSync } from 'node:fs';

import { request } from '@playwright/test';

import {
  ADMIN_STATE,
  BASE_URL,
  CREDENTIALS_FILE,
  type Credentials,
  E2E_CRON_SECRET,
  EDITOR_STATE,
} from './lib/env';

export default async function globalSetup() {
  const credentials = JSON.parse(
    readFileSync(CREDENTIALS_FILE, 'utf8')
  ) as Credentials;

  const anonymous = await request.newContext({ baseURL: BASE_URL });
  const revalidated = await anonymous.post('/next/revalidate/', {
    headers: { Authorization: `Bearer ${E2E_CRON_SECRET}` },
  });
  if (!revalidated.ok()) {
    throw new Error(`Revalidation failed: ${revalidated.status()}`);
  }
  await anonymous.dispose();

  for (const [role, file] of [
    ['editor', EDITOR_STATE],
    ['admin', ADMIN_STATE],
  ] as const) {
    const context = await request.newContext({ baseURL: BASE_URL });
    const response = await context.post('/api/users/login/', {
      data: credentials[role],
    });
    if (!response.ok()) {
      throw new Error(`Login as the e2e ${role} failed: ${response.status()}`);
    }
    await context.storageState({ path: file });
    await context.dispose();
  }
}
