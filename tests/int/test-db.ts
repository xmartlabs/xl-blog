/**
 * The integration-test database: TEST_DATABASE_URL, or DATABASE_URL with the database name
 * replaced by `xlblog_test`. Never the development database: the name must end in `_test`
 * and differ from DATABASE_URL's, because the global setup drops and recreates it.
 */
import 'dotenv/config';

export function testDatabaseUrl(
  env: Record<string, string | undefined> = process.env
): string {
  const base = env.DATABASE_URL;
  const explicit = env.TEST_DATABASE_URL?.trim();
  if (!explicit && !base) {
    throw new Error(
      'Set DATABASE_URL (or TEST_DATABASE_URL) to run integration tests.'
    );
  }
  const url = new URL(explicit || base!);
  if (!explicit) url.pathname = '/xlblog_test';
  const name = databaseName(url.toString());
  if (!name.endsWith('_test')) {
    throw new Error(
      `Refusing to use "${name}" for integration tests: its name must end in "_test".`
    );
  }
  if (base && databaseName(base) === name && new URL(base).host === url.host) {
    throw new Error(
      `Refusing to use the DATABASE_URL database ("${name}") for integration tests.`
    );
  }
  return url.toString();
}

export const databaseName = (url: string) =>
  decodeURIComponent(new URL(url).pathname.replace(/^\//, ''));

/** Same server, the `postgres` maintenance database (to create/drop the test database). */
export function maintenanceUrl(url: string): string {
  const u = new URL(url);
  u.pathname = '/postgres';
  return u.toString();
}
