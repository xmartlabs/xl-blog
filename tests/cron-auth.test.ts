import { describe, expect, it } from 'vitest';

import { hasCronSecret } from '../src/lib/cron-auth';

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
