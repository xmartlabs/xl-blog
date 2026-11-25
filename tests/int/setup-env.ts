/**
 * Runs in each test worker before the test files import the Payload config: points it at the
 * test database, migrated by the global setup, and turns off the dev-mode schema push.
 */
import { testDatabaseUrl } from './test-db';

process.env.DATABASE_URL = testDatabaseUrl();
process.env.PAYLOAD_MIGRATING = 'true';
process.env.PAYLOAD_SECRET ||= 'integration-tests-only';
process.env.FIRST_ADMIN_EMAIL = '';
process.env.FIRST_ADMIN_PASSWORD = '';
