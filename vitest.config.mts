import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    server: {
      deps: {
        // Ships ESM with extensionless imports, which plain Node can't resolve.
        inline: ['payload-oauth2'],
      },
    },
  },
});
