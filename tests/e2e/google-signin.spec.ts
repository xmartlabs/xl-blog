import { type APIResponse, expect, test } from '@playwright/test';

import { apiAs, json } from './lib/api';
import { E2E_GOOGLE } from './lib/env';

/**
 * The edges of "Sign in with Google" that don't need Google: the authorize redirect and its
 * cookies, and callbacks that must fail before any request to Google. The e2e server has a
 * fake OAuth client, so nothing here reaches Google. Domain rejection (a personal Gmail, a
 * wrong `hd`, an unverified email) is covered by the unit tests with a mocked Google
 * (tests/google-callback.test.ts, tests/google-identity.test.ts).
 */

const AUTHORIZE = '/api/users/oauth/google/';
const CALLBACK = '/api/users/oauth/google/callback/';
const FLOW_PATH = '/api/users/oauth/google';

const setCookies = (response: APIResponse) =>
  response
    .headersArray()
    .filter((h) => h.name.toLowerCase() === 'set-cookie')
    .map((h) => h.value);

const cookieNamed = (cookies: string[], name: string) =>
  cookies.find((c) => c.startsWith(`${name}=`));

async function countUsers() {
  const admin = await apiAs('admin');
  try {
    const { totalDocs } = await json<{ totalDocs: number }>(
      await admin.get('/api/users/', { params: { limit: 1, depth: 0 } })
    );
    return totalDocs;
  } finally {
    await admin.dispose();
  }
}

test('the authorize endpoint redirects to Google with state, PKCE and the domain hint', async () => {
  const api = await apiAs('anonymous', { maxRedirects: 0 });
  try {
    const response = await api.get(AUTHORIZE, {
      params: { redirect: '/admin/collections/posts/' },
    });
    expect(response.status()).toBe(302);
    const location = new URL(response.headers().location);
    expect(location.origin + location.pathname).toBe(
      'https://accounts.google.com/o/oauth2/v2/auth'
    );
    const params = location.searchParams;
    expect(params.get('client_id')).toBe(E2E_GOOGLE.clientId);
    expect(params.get('response_type')).toBe('code');
    expect(params.get('scope')).toBe('openid email profile');
    expect(params.get('hd')).toBe(E2E_GOOGLE.allowedDomain);
    expect(params.get('prompt')).toBe('select_account');
    expect(params.get('code_challenge_method')).toBe('S256');
    expect(params.get('code_challenge')).toMatch(/^[\w-]{43}$/);
    expect(params.get('redirect_uri')).toMatch(
      /^http:\/\/localhost:\d+\/api\/users\/oauth\/google\/callback$/
    );
    const state = params.get('state');
    expect(state).toMatch(/^[\w-]{43}$/);

    const cookies = setCookies(response);
    for (const name of [
      'xl-google-oauth-state',
      'pkce_verifier',
      'xl-google-oauth-redirect',
    ]) {
      const cookie = cookieNamed(cookies, name);
      expect(cookie, name).toBeTruthy();
      expect(cookie).toContain('HttpOnly');
      expect(cookie).toContain(`Path=${FLOW_PATH};`);
      expect(cookie).toContain('SameSite=Lax');
      expect(cookie).toMatch(/Max-Age=600\b/);
    }
    expect(cookieNamed(cookies, 'xl-google-oauth-state')).toContain(
      `xl-google-oauth-state=${state};`
    );
    expect(cookieNamed(cookies, 'xl-google-oauth-redirect')).toContain(
      `xl-google-oauth-redirect=${encodeURIComponent('/admin/collections/posts/')};`
    );
    // A fresh state and verifier on every request.
    const again = await api.get(AUTHORIZE);
    expect(
      new URL(again.headers().location).searchParams.get('state')
    ).not.toBe(state);
  } finally {
    await api.dispose();
  }
});

test('an external return path is replaced by /admin', async () => {
  const api = await apiAs('anonymous', { maxRedirects: 0 });
  try {
    for (const redirect of [
      '//evil.com',
      'https://evil.com/admin',
      '/\\evil.com',
    ]) {
      const response = await api.get(AUTHORIZE, { params: { redirect } });
      expect(response.status()).toBe(302);
      expect(new URL(response.headers().location).host).toBe(
        'accounts.google.com'
      );
      expect(
        cookieNamed(setCookies(response), 'xl-google-oauth-redirect'),
        redirect
      ).toContain('xl-google-oauth-redirect=%2Fadmin;');
    }
  } finally {
    await api.dispose();
  }
});

test('callbacks with a forged or missing state fail without creating a user', async () => {
  const before = await countUsers();
  const api = await apiAs('anonymous', { maxRedirects: 0 });
  try {
    const cases: { query: Record<string, string>; cookie?: string }[] = [
      // No state cookie at all (e.g. a link crafted by someone else).
      { query: { code: 'forged-code', state: 'forged-state' } },
      // A state that doesn't match the cookie.
      {
        query: { code: 'forged-code', state: 'forged-state' },
        cookie: 'xl-google-oauth-state=the-real-state',
      },
      // No state parameter.
      {
        query: { code: 'forged-code' },
        cookie: 'xl-google-oauth-state=the-real-state',
      },
      // No code.
      {
        query: { state: 'the-real-state' },
        cookie: 'xl-google-oauth-state=the-real-state',
      },
      // Google reported an error.
      {
        query: { error: 'access_denied', state: 'the-real-state' },
        cookie: 'xl-google-oauth-state=the-real-state',
      },
    ];
    for (const { query, cookie } of cases) {
      const response = await api.get(CALLBACK, {
        params: query,
        headers: cookie ? { Cookie: cookie } : {},
      });
      const label = JSON.stringify({ query, cookie });
      expect(response.status(), label).toBeGreaterThanOrEqual(300);
      expect(response.status(), label).toBeLessThan(400);
      expect(response.headers().location, label).toMatch(
        /^(https?:\/\/[^/]+)?\/admin\/login\?error=google$/
      );
      const cookies = setCookies(response);
      // No session, and the flow cookies are expired.
      expect(cookieNamed(cookies, 'payload-token'), label).toBeUndefined();
      expect(cookieNamed(cookies, 'xl-google-oauth-state'), label).toMatch(
        /Max-Age=0\b/
      );
    }
  } finally {
    await api.dispose();
  }
  expect(await countUsers()).toBe(before);
});
