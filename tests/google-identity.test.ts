import { describe, expect, it } from 'vitest';

import { checkGoogleIdentity, getGoogleAuthSettings } from '../src/auth/google';

const valid = {
  sub: '1234567890',
  email: 'jane.doe@xmartlabs.com',
  email_verified: true,
  hd: 'xmartlabs.com',
  name: 'Jane Doe',
};

describe('checkGoogleIdentity', () => {
  it('accepts a verified account of the allowed Workspace domain', () => {
    expect(checkGoogleIdentity(valid, 'xmartlabs.com')).toEqual({
      ok: true,
      email: 'jane.doe@xmartlabs.com',
      sub: '1234567890',
      name: 'Jane Doe',
    });
  });

  it('normalizes an uppercase email and domain', () => {
    const result = checkGoogleIdentity(
      { ...valid, email: 'Jane.Doe@XmartLabs.COM', hd: 'XMARTLABS.com' },
      'XmartLabs.com'
    );
    expect(result).toMatchObject({ ok: true, email: 'jane.doe@xmartlabs.com' });
  });

  it('rejects another Workspace domain', () => {
    expect(
      checkGoogleIdentity(
        { ...valid, hd: 'evil.com', email: 'jane@evil.com' },
        'xmartlabs.com'
      ).ok
    ).toBe(false);
  });

  it('rejects a wrong hd even if the email looks right', () => {
    expect(
      checkGoogleIdentity({ ...valid, hd: 'evil.com' }, 'xmartlabs.com').ok
    ).toBe(false);
  });

  it('rejects a personal Gmail account (no hd claim)', () => {
    const { hd: _hd, ...gmail } = { ...valid, email: 'jane.doe@gmail.com' };
    expect(checkGoogleIdentity(gmail, 'xmartlabs.com').ok).toBe(false);
  });

  it('rejects a missing hd even with an allowed-looking email', () => {
    const { hd: _hd, ...noHd } = valid;
    expect(checkGoogleIdentity(noHd, 'xmartlabs.com').ok).toBe(false);
  });

  it('rejects an email outside the domain even with the right hd', () => {
    expect(
      checkGoogleIdentity(
        { ...valid, email: 'jane@gmail.com' },
        'xmartlabs.com'
      ).ok
    ).toBe(false);
    expect(
      checkGoogleIdentity(
        { ...valid, email: 'jane@notxmartlabs.com' },
        'xmartlabs.com'
      ).ok
    ).toBe(false);
  });

  it.each([false, undefined, 'true', 1])(
    'rejects email_verified = %s',
    (emailVerified) => {
      expect(
        checkGoogleIdentity(
          { ...valid, email_verified: emailVerified },
          'xmartlabs.com'
        ).ok
      ).toBe(false);
    }
  );

  it('rejects when no domain is configured (fail closed)', () => {
    expect(checkGoogleIdentity(valid, '').ok).toBe(false);
    expect(checkGoogleIdentity(valid, undefined).ok).toBe(false);
  });

  it('rejects missing info, email or subject', () => {
    expect(checkGoogleIdentity(null, 'xmartlabs.com').ok).toBe(false);
    expect(
      checkGoogleIdentity({ ...valid, email: undefined }, 'xmartlabs.com').ok
    ).toBe(false);
    expect(checkGoogleIdentity({ ...valid, sub: '' }, 'xmartlabs.com').ok).toBe(
      false
    );
  });
});

describe('getGoogleAuthSettings', () => {
  const env = {
    GOOGLE_CLIENT_ID: 'id',
    GOOGLE_CLIENT_SECRET: 'secret',
    GOOGLE_ALLOWED_DOMAIN: 'XmartLabs.com',
    NEXT_PUBLIC_SERVER_URL: 'https://blog.example.com/',
    NODE_ENV: 'production',
  };

  it('reads complete settings', () => {
    expect(getGoogleAuthSettings(env)).toEqual({
      clientId: 'id',
      clientSecret: 'secret',
      allowedDomain: 'xmartlabs.com',
      serverURL: 'https://blog.example.com',
    });
  });

  it.each([
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_ALLOWED_DOMAIN',
  ])('is disabled without %s', (key) => {
    expect(getGoogleAuthSettings({ ...env, [key]: '' })).toBeNull();
  });

  it('needs a server URL in production, defaults to localhost in development', () => {
    expect(
      getGoogleAuthSettings({ ...env, NEXT_PUBLIC_SERVER_URL: '' })
    ).toBeNull();
    expect(
      getGoogleAuthSettings({
        ...env,
        NEXT_PUBLIC_SERVER_URL: '',
        NODE_ENV: 'development',
      })?.serverURL
    ).toBe('http://localhost:3000');
  });
});
