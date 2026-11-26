import { afterEach, describe, expect, it, vi } from 'vitest';

import { canRunJobs, hasCronSecret } from '../src/lib/cron-auth';

describe('hasCronSecret', () => {
  it('accepts the exact bearer secret', () => {
    expect(hasCronSecret('Bearer s3cret', 's3cret')).toBe(true);
  });
  it('rejects a wrong or partial secret', () => {
    expect(hasCronSecret('Bearer s3cre', 's3cret')).toBe(false);
    expect(hasCronSecret('Bearer s3cretX', 's3cret')).toBe(false);
    expect(hasCronSecret('s3cret', 's3cret')).toBe(false);
  });
  it('fails closed without a header or a configured secret', () => {
    expect(hasCronSecret(null, 's3cret')).toBe(false);
    expect(hasCronSecret('Bearer ', '')).toBe(false);
    expect(hasCronSecret('Bearer undefined', undefined)).toBe(false);
  });
});

describe('canRunJobs (jobs queue run access)', () => {
  afterEach(() => vi.unstubAllEnvs());

  const req = (user: unknown, authorization?: string) => ({
    req: {
      user: user as never,
      headers: new Headers(authorization ? { authorization } : {}),
    },
  });
  const admin = { id: 1, roles: ['admin'] };
  const editor = { id: 2, roles: ['editor'] };

  it('allows signed-in admins', () => {
    vi.stubEnv('CRON_SECRET', '');
    expect(canRunJobs(req(admin))).toBe(true);
  });

  it('allows the cron secret without a user', () => {
    vi.stubEnv('CRON_SECRET', 's3cret');
    expect(canRunJobs(req(null, 'Bearer s3cret'))).toBe(true);
  });

  it('rejects editors, anonymous callers and wrong secrets', () => {
    vi.stubEnv('CRON_SECRET', 's3cret');
    expect(canRunJobs(req(editor))).toBe(false);
    expect(canRunJobs(req(null))).toBe(false);
    expect(canRunJobs(req(editor, 'Bearer wrong'))).toBe(false);
  });

  it('fails closed when CRON_SECRET is not set', () => {
    vi.stubEnv('CRON_SECRET', '');
    expect(canRunJobs(req(null, 'Bearer '))).toBe(false);
    expect(canRunJobs(req(null, 'Bearer undefined'))).toBe(false);
  });
});
