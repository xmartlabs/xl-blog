/**
 * The full Google callback (payload-oauth2's endpoint + our state check, userinfo fetch,
 * domain rule and user provisioning) against a mocked Payload and mocked Google responses.
 */
import crypto from 'node:crypto';

import type { CollectionConfig, Config, Endpoint } from 'payload';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  GOOGLE_USERINFO_URL,
  googleAuthPlugin,
  type GoogleAuthSettings,
} from '../src/auth/google';
import { Users } from '../src/collections/Users';

const settings: GoogleAuthSettings = {
  clientId: 'client-id',
  clientSecret: 'client-secret',
  allowedDomain: 'xmartlabs.com',
  serverURL: 'http://localhost:3000',
};

const googleUser = {
  sub: '1234567890',
  email: 'Jane.Doe@xmartlabs.com',
  email_verified: true,
  hd: 'xmartlabs.com',
  name: 'Jane Doe',
};

const buildUsersCollection = async () => {
  const config = (await googleAuthPlugin(settings)({
    collections: [Users],
  } as Config)) as Config;
  return config.collections!.find(
    (c) => c.slug === 'users'
  ) as CollectionConfig;
};

const endpoint = (
  collection: CollectionConfig,
  method: string,
  path: string
) => {
  const found = (collection.endpoints as Endpoint[]).find(
    (e) => e.method === method && e.path === path
  );
  if (!found) throw new Error(`No ${method} ${path} endpoint`);
  return found;
};

/** Google token + OIDC userinfo responses. */
const mockGoogle = (userinfo: Record<string, unknown>) =>
  vi.fn(async (url: string | URL) => {
    const href = String(url);
    if (href === 'https://oauth2.googleapis.com/token') {
      return Response.json({ access_token: 'google-access-token' });
    }
    if (href === GOOGLE_USERINFO_URL) return Response.json(userinfo);
    throw new Error(`Unexpected fetch ${href}`);
  });

const mockPayload = (existingUsers: Record<string, unknown>[] = []) => {
  const created: Record<string, unknown>[] = [];
  const updated: Record<string, unknown>[] = [];
  const collectionConfig = {
    slug: 'users',
    fields: Users.fields,
    flattenedFields: Users.fields,
    hooks: { beforeLogin: [], afterLogin: [] },
    auth: {
      useSessions: true,
      tokenExpiration: 7200,
      cookies: { sameSite: 'Lax', secure: false },
    },
  };
  const payload = {
    secret: 'test-secret',
    config: { cookiePrefix: 'payload' },
    collections: { users: { config: collectionConfig } },
    logger: { warn: vi.fn(), error: vi.fn(), info: vi.fn() },
    find: vi.fn(
      async ({ where }: { where: { email?: { equals: string } } }) => ({
        docs: existingUsers.filter((u) => u.email === where.email?.equals),
      })
    ),
    create: vi.fn(async ({ data }: { data: Record<string, unknown> }) => {
      created.push(data);
      return { id: 99, roles: ['editor'], ...data };
    }),
    update: vi.fn(
      async ({ id, data }: { id: number; data: Record<string, unknown> }) => {
        updated.push(data);
        return { ...existingUsers.find((u) => u.id === id), ...data };
      }
    ),
    db: { updateOne: vi.fn(async () => ({})) },
  };
  return { payload, created, updated };
};

const callbackRequest = (
  payload: unknown,
  {
    state = 'the-state',
    cookie = 'the-state',
    verifier = 'the-verifier',
    redirect,
  }: {
    state?: string;
    cookie?: string;
    verifier?: string;
    redirect?: string;
  } = {}
) => {
  const searchParams = new URLSearchParams({ code: 'auth-code', state });
  const cookies = [
    `xl-google-oauth-state=${cookie}`,
    `pkce_verifier=${verifier}`,
    ...(redirect !== undefined
      ? [`xl-google-oauth-redirect=${encodeURIComponent(redirect)}`]
      : []),
  ];
  return {
    method: 'GET',
    payload,
    searchParams,
    query: Object.fromEntries(searchParams),
    headers: new Headers({ cookie: cookies.join('; ') }),
    context: {},
  };
};

/** `Set-Cookie` headers of a response, by cookie name. */
const setCookies = (res: Response) =>
  new Map(
    res.headers
      .getSetCookie()
      .map((c) => [c.slice(0, c.indexOf('=')), c] as const)
  );

const authorizeRequest = (query: Record<string, string> = {}) =>
  ({ searchParams: new URLSearchParams(query) }) as never;

/** The token-endpoint request body the plugin sent to Google. */
const tokenRequestBody = (fetchMock: ReturnType<typeof mockGoogle>) => {
  const call = fetchMock.mock.calls.find(
    ([url]) => String(url) === 'https://oauth2.googleapis.com/token'
  ) as unknown as [string, RequestInit] | undefined;
  return new URLSearchParams(String(call?.[1]?.body ?? ''));
};

describe('Google sign-in callback', () => {
  let fetchMock: ReturnType<typeof mockGoogle>;

  beforeEach(() => {
    fetchMock = mockGoogle(googleUser);
    vi.stubGlobal('fetch', fetchMock);
  });
  afterEach(() => vi.unstubAllGlobals());

  it('authorize endpoint sets a state cookie and sends the hd hint', async () => {
    const users = await buildUsersCollection();
    const res = await endpoint(users, 'get', '/oauth/google').handler(
      authorizeRequest()
    );
    expect(res.status).toBe(302);
    const location = new URL(res.headers.get('location')!);
    expect(location.origin + location.pathname).toBe(
      'https://accounts.google.com/o/oauth2/v2/auth'
    );
    expect(location.searchParams.get('hd')).toBe('xmartlabs.com');
    expect(location.searchParams.get('scope')).toBe('openid email profile');
    expect(location.searchParams.get('redirect_uri')).toBe(
      'http://localhost:3000/api/users/oauth/google/callback'
    );
    const state = location.searchParams.get('state');
    expect(state).toBeTruthy();
    const stateCookie = setCookies(res).get('xl-google-oauth-state');
    expect(stateCookie).toContain(`xl-google-oauth-state=${state};`);
    expect(stateCookie).toContain('HttpOnly');
    expect(stateCookie).toContain('Path=/api/users/oauth/google;');
    expect(stateCookie).not.toContain('Secure');
  });

  it('authorize endpoint uses PKCE (S256) with the verifier in an HttpOnly cookie', async () => {
    const users = await buildUsersCollection();
    const res = await endpoint(users, 'get', '/oauth/google').handler(
      authorizeRequest()
    );
    const location = new URL(res.headers.get('location')!);
    expect(location.searchParams.get('code_challenge_method')).toBe('S256');
    const challenge = location.searchParams.get('code_challenge')!;
    expect(challenge).toMatch(/^[A-Za-z0-9_-]{43}$/);

    const cookie = setCookies(res).get('pkce_verifier')!;
    const verifier = /^pkce_verifier=([^;]+);/.exec(cookie)![1];
    // 32 random bytes, base64url without padding.
    expect(verifier).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(Buffer.from(verifier, 'base64url')).toHaveLength(32);
    expect(
      crypto.createHash('sha256').update(verifier).digest('base64url')
    ).toBe(challenge);
    for (const attribute of [
      'HttpOnly',
      'SameSite=Lax',
      'Max-Age=600',
      // Covers the callback (/api/users/oauth/google/callback).
      'Path=/api/users/oauth/google;',
    ]) {
      expect(cookie).toContain(attribute);
    }
  });

  it('authorize endpoint marks the cookies Secure on https', async () => {
    const config = (await googleAuthPlugin({
      ...settings,
      serverURL: 'https://blog.example.com',
    })({ collections: [Users] } as Config)) as Config;
    const users = config.collections!.find(
      (c) => c.slug === 'users'
    ) as CollectionConfig;
    const res = await endpoint(users, 'get', '/oauth/google').handler(
      authorizeRequest()
    );
    const cookies = [...setCookies(res).values()];
    expect(cookies).toHaveLength(3);
    for (const cookie of cookies) expect(cookie).toMatch(/; Secure$/);
  });

  it.each([
    [undefined, '/admin'],
    ['/admin/collections/posts?limit=10', '/admin/collections/posts?limit=10'],
    ['https://evil.com/admin', '/admin'],
    ['//evil.com', '/admin'],
    ['/\\evil.com', '/admin'],
    ['/..//evil.com', '/admin'],
  ])(
    'authorize endpoint stores the sanitized return path (%s)',
    async (redirect, expected) => {
      const users = await buildUsersCollection();
      const res = await endpoint(users, 'get', '/oauth/google').handler(
        authorizeRequest(redirect === undefined ? {} : { redirect })
      );
      const cookie = setCookies(res).get('xl-google-oauth-redirect')!;
      expect(cookie).toContain(
        `xl-google-oauth-redirect=${encodeURIComponent(expected)};`
      );
      expect(cookie).toContain('HttpOnly');
    }
  );

  it('sends the PKCE verifier from the cookie as code_verifier', async () => {
    const users = await buildUsersCollection();
    const { payload } = mockPayload();
    await endpoint(users, 'get', '/oauth/google/callback').handler(
      callbackRequest(payload, { verifier: 'verifier-from-cookie' }) as never
    );
    const body = tokenRequestBody(fetchMock);
    expect(body.get('code_verifier')).toBe('verifier-from-cookie');
    expect(body.get('code')).toBe('auth-code');
    expect(body.get('grant_type')).toBe('authorization_code');
  });

  it('returns to the stored path after signing in, and expires the flow cookies', async () => {
    const users = await buildUsersCollection();
    const { payload } = mockPayload();
    const res = await endpoint(users, 'get', '/oauth/google/callback').handler(
      callbackRequest(payload, {
        redirect: '/admin/collections/posts/12',
      }) as never
    );
    expect(res.headers.get('location')).toBe('/admin/collections/posts/12');
    const cookies = setCookies(res);
    expect(cookies.get('payload-token')).toBeDefined();
    for (const name of [
      'xl-google-oauth-state',
      'pkce_verifier',
      'xl-google-oauth-redirect',
    ]) {
      expect(cookies.get(name)).toMatch(
        new RegExp(`^${name}=; Path=/api/users/oauth/google; .*Max-Age=0`)
      );
    }
  });

  it('ignores a tampered return-path cookie', async () => {
    const users = await buildUsersCollection();
    const { payload } = mockPayload();
    const res = await endpoint(users, 'get', '/oauth/google/callback').handler(
      callbackRequest(payload, { redirect: '//evil.com/phish' }) as never
    );
    expect(res.headers.get('location')).toBe('/admin');
  });

  it('creates a missing user as an editor (no role sent, so the default applies)', async () => {
    const users = await buildUsersCollection();
    const { payload, created } = mockPayload();
    const res = await endpoint(users, 'get', '/oauth/google/callback').handler(
      callbackRequest(payload) as never
    );

    expect(res.headers.get('location')).toBe('/admin');
    expect(res.headers.get('set-cookie')).toMatch(/^payload-token=/);
    expect(created).toHaveLength(1);
    expect(created[0]).toMatchObject({
      email: 'jane.doe@xmartlabs.com',
      name: 'Jane Doe',
      sub: '1234567890',
    });
    expect(created[0]).not.toHaveProperty('roles');
    expect(typeof created[0].password).toBe('string');
    expect(fetchMock).toHaveBeenCalledWith(
      GOOGLE_USERINFO_URL,
      expect.objectContaining({
        headers: { Authorization: 'Bearer google-access-token' },
      })
    );
  });

  it('signs in an existing user without overwriting the name an admin set', async () => {
    const users = await buildUsersCollection();
    const { payload, created, updated } = mockPayload([
      {
        id: 7,
        email: 'jane.doe@xmartlabs.com',
        name: 'Jane (Design)',
        roles: ['admin'],
      },
    ]);
    const res = await endpoint(users, 'get', '/oauth/google/callback').handler(
      callbackRequest(payload) as never
    );

    expect(res.headers.get('location')).toBe('/admin');
    expect(created).toHaveLength(0);
    expect(updated).toEqual([
      {
        email: 'jane.doe@xmartlabs.com',
        sub: '1234567890',
        collection: 'users',
      },
    ]);
  });

  it.each([
    [
      'a personal Gmail account',
      { ...googleUser, email: 'jane@gmail.com', hd: undefined },
    ],
    [
      'another Workspace domain',
      { ...googleUser, email: 'jane@evil.com', hd: 'evil.com' },
    ],
    ['an unverified email', { ...googleUser, email_verified: false }],
  ])('rejects %s without creating a user', async (_label, userinfo) => {
    vi.stubGlobal('fetch', mockGoogle(userinfo));
    const users = await buildUsersCollection();
    const { payload } = mockPayload();
    const res = await endpoint(users, 'get', '/oauth/google/callback').handler(
      callbackRequest(payload) as never
    );

    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toBe('/admin/login?error=google');
    const cookies = setCookies(res);
    expect(cookies.has('payload-token')).toBe(false);
    expect(cookies.get('pkce_verifier')).toContain('Max-Age=0');
    expect(cookies.get('xl-google-oauth-state')).toContain('Max-Age=0');
    expect(payload.create).not.toHaveBeenCalled();
    expect(payload.update).not.toHaveBeenCalled();
  });

  it('rejects a callback whose state does not match the cookie', async () => {
    const users = await buildUsersCollection();
    const { payload } = mockPayload();
    const res = await endpoint(users, 'get', '/oauth/google/callback').handler(
      callbackRequest(payload, { state: 'forged' }) as never
    );

    expect(res.headers.get('location')).toBe('/admin/login?error=google');
    expect(fetchMock).not.toHaveBeenCalled();
    expect(payload.create).not.toHaveBeenCalled();
  });

  it('adds nothing when Google sign-in is not configured', async () => {
    const config = (await googleAuthPlugin(null)({
      collections: [Users],
    } as Config)) as Config;
    const users = config.collections!.find((c) => c.slug === 'users')!;
    expect(users.endpoints ?? []).toHaveLength(0);
    expect(
      typeof users.auth === 'object' ? users.auth.strategies : undefined
    ).toBeUndefined();
  });
});
