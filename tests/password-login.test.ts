import type { CollectionConfig } from 'payload';
import { describe, expect, it } from 'vitest';

import {
  decidePasswordLogin,
  withPasswordLogin,
} from '../src/auth/password-login';
import { Users } from '../src/collections/Users';

describe('decidePasswordLogin', () => {
  it('keeps password login by default', () => {
    expect(decidePasswordLogin({}, true)).toEqual({ enabled: true });
    expect(decidePasswordLogin({ DISABLE_PASSWORD_LOGIN: '' }, true)).toEqual({
      enabled: true,
    });
    expect(
      decidePasswordLogin({ DISABLE_PASSWORD_LOGIN: 'false' }, true)
    ).toEqual({ enabled: true });
  });

  it.each(['true', 'TRUE', ' true ', '1', 'yes'])(
    'disables it with DISABLE_PASSWORD_LOGIN=%j when Google is configured',
    (value) => {
      expect(
        decidePasswordLogin({ DISABLE_PASSWORD_LOGIN: value }, true)
      ).toEqual({ enabled: false });
    }
  );

  it('keeps it, with a warning, when Google is not configured', () => {
    const decision = decidePasswordLogin(
      { DISABLE_PASSWORD_LOGIN: 'true' },
      false
    );
    expect(decision.enabled).toBe(true);
    expect(decision.warning).toMatch(/Google sign-in is not configured/);
  });
});

describe('withPasswordLogin', () => {
  const auth = (collection: CollectionConfig) =>
    typeof collection.auth === 'object' ? collection.auth : {};

  it('locks accounts after 5 wrong passwords for 10 minutes', () => {
    expect(auth(Users)).toMatchObject({
      maxLoginAttempts: 5,
      lockTime: 10 * 60 * 1000,
      useSessions: true,
    });
  });

  it('leaves the collection unchanged when password login is on', () => {
    expect(withPasswordLogin(Users, { enabled: true })).toBe(Users);
  });

  it('disables the local strategy but keeps its fields (same schema)', () => {
    const result = withPasswordLogin(Users, { enabled: false });
    expect(auth(result)).toMatchObject({
      ...auth(Users),
      disableLocalStrategy: { enableFields: true },
      tokenExpiration: 8 * 60 * 60,
    });
    expect(auth(Users).disableLocalStrategy).toBeUndefined();
  });

  it('caps the token lifetime at 8 hours, since sign-out cannot revoke it then', () => {
    expect(auth(Users).tokenExpiration).toBeGreaterThan(8 * 60 * 60);
    const result = withPasswordLogin(
      { ...Users, auth: { ...auth(Users), tokenExpiration: 3600 } },
      { enabled: false }
    );
    expect(auth(result).tokenExpiration).toBe(3600);
  });
});
