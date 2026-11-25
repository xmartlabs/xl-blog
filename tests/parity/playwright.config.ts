import { defineConfig } from '@playwright/test';

import { VIEWPORTS, WORKERS } from './lib/settings';
import { ensureSitemap } from './lib/urls';

// The test list comes from the live sitemap; fetch it before the spec file is loaded.
await ensureSitemap();

export default defineConfig({
  testDir: '.',
  testMatch: 'parity.spec.ts',
  fullyParallel: true,
  workers: WORKERS,
  retries: 0,
  timeout: 5 * 60_000,
  reporter: [['line']],
  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',
  outputDir: './.cache/test-output',
  projects: Object.entries(VIEWPORTS).map(([name, viewport]) => ({
    name,
    use: { browserName: 'chromium' as const, viewport },
  })),
});
