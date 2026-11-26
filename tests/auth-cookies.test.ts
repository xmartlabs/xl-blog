import { generatePayloadCookie } from 'payload';
import { describe, expect, it } from 'vitest';

import { authCookieOptions } from '../src/auth/cookies';
import { resolveServerURL } from '../src/lib/server-url.mjs';

describe('authCookieOptions (payload-token cookie)', () => {
  it('is Secure when the public URL is https', () => {
    expect(
      authCookieOptions({
        NODE_ENV: 'production',
        NEXT_PUBLIC_SERVER_URL: 'https://blog.xmartlabs.com',
      })
    ).toEqual({ sameSite: 'Lax', secure: true });
    expect(
      authCookieOptions({ NEXT_PUBLIC_SERVER_URL: 'HTTPS://Blog.Example.com/' })
    ).toEqual({ sameSite: 'Lax', secure: true });
  });

  it('is Secure on Vercel without NEXT_PUBLIC_SERVER_URL (production and previews)', () => {
    expect(
      authCookieOptions({
        NODE_ENV: 'production',
        VERCEL_ENV: 'production',
        VERCEL_PROJECT_PRODUCTION_URL: 'blog.xmartlabs.com',
      }).secure
    ).toBe(true);
    expect(
      authCookieOptions({
        NODE_ENV: 'production',
        VERCEL_ENV: 'preview',
        VERCEL_BRANCH_URL: 'xl-blog-git-foo.vercel.app',
      }).secure
    ).toBe(true);
  });

  it('is not Secure on http (local dev, integration and e2e tests)', () => {
    expect(authCookieOptions({})).toEqual({ sameSite: 'Lax', secure: false });
    expect(
      authCookieOptions({
        NODE_ENV: 'production',
        NEXT_PUBLIC_SERVER_URL: 'http://localhost:3003',
      })
    ).toEqual({ sameSite: 'Lax', secure: false });
  });

  it('fails closed (Secure) in production when no URL is known', () => {
    expect(authCookieOptions({ NODE_ENV: 'production' }).secure).toBe(true);
  });

  it("drives Payload's cookie (password login, refresh, logout)", () => {
    const cookie = (secure: boolean) =>
      generatePayloadCookie({
        collectionAuthConfig: {
          cookies: authCookieOptions({
            NEXT_PUBLIC_SERVER_URL: secure
              ? 'https://blog.xmartlabs.com'
              : 'http://localhost:3000',
          }),
          tokenExpiration: 3600,
        } as never,
        cookiePrefix: 'payload',
        token: 'token',
      }) as string;
    expect(cookie(true)).toMatch(/; Secure=true\b/);
    expect(cookie(true)).toContain('; SameSite=Lax');
    expect(cookie(true)).toContain('; HttpOnly');
    expect(cookie(false)).not.toContain('Secure');
    expect(cookie(false)).toContain('; SameSite=Lax');
  });
});

describe('resolveServerURL', () => {
  it('prefers NEXT_PUBLIC_SERVER_URL, without trailing slashes', () => {
    expect(
      resolveServerURL({
        NEXT_PUBLIC_SERVER_URL: 'https://blog.xmartlabs.com//',
        VERCEL_ENV: 'production',
        VERCEL_PROJECT_PRODUCTION_URL: 'other.example.com',
      })
    ).toBe('https://blog.xmartlabs.com');
  });

  it('falls back to the Vercel URL, then localhost outside production', () => {
    expect(
      resolveServerURL({
        VERCEL_ENV: 'preview',
        VERCEL_URL: 'xl-blog-abc.vercel.app',
      })
    ).toBe('https://xl-blog-abc.vercel.app');
    expect(resolveServerURL({})).toBe('http://localhost:3000');
    expect(resolveServerURL({ NODE_ENV: 'production' })).toBe('');
  });
});
