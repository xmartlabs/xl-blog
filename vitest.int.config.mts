import { defineConfig } from 'vitest/config';

/**
 * Integration tests: the real Payload config against a dedicated Postgres database
 * (`xlblog_test`, recreated and migrated on every run; see tests/int/test-db.ts).
 * `npm run test:int`. Unit tests (`npm test`) don't need a database.
 */
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'node',
    include: ['tests/int/**/*.int.spec.ts'],
    globalSetup: ['tests/int/global-setup.ts'],
    setupFiles: ['tests/int/setup-env.ts'],
    // One Payload instance and one database: run the files one after another.
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 120_000,
    server: {
      deps: {
        inline: ['payload-oauth2'],
      },
    },
  },
});
