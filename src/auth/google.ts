import crypto from 'node:crypto';

import { OAuth2Plugin } from 'payload-oauth2';
import type { PluginTypes } from 'payload-oauth2';
import { parseCookies } from 'payload';
import type { Config, Endpoint, PayloadRequest, Plugin } from 'payload';

/**
 * "Sign in with Google" for the admin panel, restricted to one Google Workspace domain.
 *
 * Flow: /api/users/oauth/google (our authorize endpoint: state cookie + `hd` hint)
 *   → Google → /api/users/oauth/google/callback (payload-oauth2: state check, code exchange,
 *   `getUserInfo` below, find-or-create the user by email, Payload session cookie) → /admin.
 *
 * The domain rule lives in `checkGoogleIdentity`. Google's `hd` claim is only present for
 * Workspace accounts, so a personal Gmail (or any other domain) is rejected even if the
 * `hd=` authorize parameter (a UX hint that users can strip) is bypassed.
 */

export const GOOGLE_STRATEGY = 'google';
export const AUTH_COLLECTION = 'users';
export const AUTHORIZE_PATH = '/oauth/google';
export const CALLBACK_PATH = '/oauth/google/callback';
export const GOOGLE_LOGIN_HREF = `/api/${AUTH_COLLECTION}${AUTHORIZE_PATH}`;
export const LOGIN_ERROR_REDIRECT = '/admin/login?error=google';

const GOOGLE_AUTHORIZE_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
/** OIDC userinfo: unlike the v3 endpoint, it includes `hd` and `email_verified`. */
export const GOOGLE_USERINFO_URL =
  'https://openidconnect.googleapis.com/v1/userinfo';
const SCOPES = ['openid', 'email', 'profile'];
const STATE_COOKIE = 'xl-google-oauth-state';
const STATE_MAX_AGE = 10 * 60;

/** Claims returned by Google's OIDC userinfo endpoint (or ID token). */
export interface GoogleIdentity {
  sub?: unknown;
  email?: unknown;
  email_verified?: unknown;
  hd?: unknown;
  name?: unknown;
  [claim: string]: unknown;
}

export type IdentityCheck =
  | { ok: true; email: string; sub: string; name?: string }
  | { ok: false; reason: string };

/**
 * Accepts only verified emails of the given Google Workspace domain:
 * `email_verified === true`, `hd === allowedDomain` and the email ends with `@allowedDomain`
 * (domain comparisons are case-insensitive). Returns the normalized (lower-case) email.
 */
export function checkGoogleIdentity(
  info: GoogleIdentity | null | undefined,
  allowedDomain: string | null | undefined
): IdentityCheck {
  const domain = (allowedDomain ?? '').trim().toLowerCase();
  if (!domain) return { ok: false, reason: 'No allowed domain configured' };
  if (!info || typeof info !== 'object') {
    return { ok: false, reason: 'No user info' };
  }
  if (info.email_verified !== true) {
    return { ok: false, reason: 'Email is not verified' };
  }
  if (typeof info.hd !== 'string' || info.hd.toLowerCase() !== domain) {
    return { ok: false, reason: `Not a ${domain} Google Workspace account` };
  }
  if (typeof info.email !== 'string') {
    return { ok: false, reason: 'No email' };
  }
  const email = info.email.trim().toLowerCase();
  if (
    !email.endsWith(`@${domain}`) ||
    email.indexOf('@') !== email.lastIndexOf('@')
  ) {
    return { ok: false, reason: `Email is not an @${domain} address` };
  }
  if (typeof info.sub !== 'string' || !info.sub) {
    return { ok: false, reason: 'No subject' };
  }
  const name =
    typeof info.name === 'string' && info.name.trim()
      ? info.name.trim()
      : undefined;
  return { ok: true, email, sub: info.sub, name };
}

export interface GoogleAuthSettings {
  clientId: string;
  clientSecret: string;
  allowedDomain: string;
  serverURL: string;
}

/**
 * On Vercel without NEXT_PUBLIC_SERVER_URL: the production domain, or the branch URL on
 * preview deployments (stable per branch, unlike the per-deployment URL). Google only accepts
 * redirect URIs registered in the OAuth client, so sign-in works on the hosts registered there.
 */
const vercelURL = (env: Record<string, string | undefined>) => {
  const host =
    env.VERCEL_ENV === 'production'
      ? env.VERCEL_PROJECT_PRODUCTION_URL
      : env.VERCEL_BRANCH_URL || env.VERCEL_URL;
  return host?.trim() ? `https://${host.trim()}` : '';
};

/**
 * Reads the Google settings from the environment. Returns null (Google sign-in disabled,
 * no login button) unless the client id, secret, allowed domain and server URL are all set.
 */
export function getGoogleAuthSettings(
  env: Record<string, string | undefined> = process.env
): GoogleAuthSettings | null {
  const clientId = env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = env.GOOGLE_CLIENT_SECRET?.trim();
  const allowedDomain = env.GOOGLE_ALLOWED_DOMAIN?.trim().toLowerCase();
  const serverURL = (
    env.NEXT_PUBLIC_SERVER_URL?.trim() ||
    vercelURL(env) ||
    (env.NODE_ENV !== 'production' ? 'http://localhost:3000' : '')
  ).replace(/\/+$/, '');
  if (!clientId || !clientSecret || !allowedDomain || !serverURL) return null;
  return { clientId, clientSecret, allowedDomain, serverURL };
}

export const isGoogleAuthEnabled = () => getGoogleAuthSettings() !== null;

const callbackUrl = (settings: GoogleAuthSettings) =>
  `${settings.serverURL}/api/${AUTH_COLLECTION}${CALLBACK_PATH}`;

/**
 * Our own authorize endpoint (payload-oauth2 keeps an endpoint that already exists at the
 * same path). Compared to the plugin's, it adds a CSRF `state` bound to a short-lived
 * HttpOnly cookie, Google's `hd` hint and the account chooser.
 */
export const createAuthorizeEndpoint = (
  settings: GoogleAuthSettings
): Endpoint => ({
  method: 'get',
  path: AUTHORIZE_PATH,
  handler: async () => {
    const state = crypto.randomBytes(32).toString('base64url');
    const url = new URL(GOOGLE_AUTHORIZE_URL);
    url.searchParams.set('client_id', settings.clientId);
    url.searchParams.set('redirect_uri', callbackUrl(settings));
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', SCOPES.join(' '));
    url.searchParams.set('state', state);
    url.searchParams.set('hd', settings.allowedDomain);
    url.searchParams.set('prompt', 'select_account');
    const secure = settings.serverURL.startsWith('https://') ? '; Secure' : '';
    return new Response(null, {
      status: 302,
      headers: {
        Location: url.toString(),
        'Set-Cookie': `${STATE_COOKIE}=${state}; Path=/api/${AUTH_COLLECTION}${AUTHORIZE_PATH}; HttpOnly; SameSite=Lax; Max-Age=${STATE_MAX_AGE}${secure}`,
      },
    });
  },
});

const safeEqual = (a: string, b: string) => {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
};

/** Validates `state` against the cookie, then returns the authorization code. */
export const extractCallbackCode = async (
  req: PayloadRequest
): Promise<string> => {
  const params = req.searchParams ?? new URLSearchParams();
  const providerError = params.get('error');
  if (providerError)
    throw new Error(`Google returned an error: ${providerError}`);
  const state = params.get('state');
  const expected = parseCookies(req.headers).get(STATE_COOKIE);
  if (!state || !expected || !safeEqual(state, expected)) {
    throw new Error('Invalid OAuth state');
  }
  const code = params.get('code');
  if (!code) throw new Error('No authorization code');
  return code;
};

/**
 * Fetches the OIDC user info, applies the domain rule and returns the fields stored on the
 * user. payload-oauth2 then finds the user by email and updates it, or creates it (with a
 * random password and the default `editor` role, since `roles` is never returned here).
 * An existing user's name is not overwritten, so admins can edit it.
 */
export const createGetUserInfo =
  (settings: GoogleAuthSettings, fetchImpl: typeof fetch = fetch) =>
  async (accessToken: string, req: PayloadRequest) => {
    const response = await fetchImpl(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) {
      throw new Error(`Google userinfo request failed: ${response.status}`);
    }
    const identity = (await response.json()) as GoogleIdentity;
    const check = checkGoogleIdentity(identity, settings.allowedDomain);
    if (!check.ok) {
      req.payload.logger.warn(`Google sign-in rejected: ${check.reason}`);
      throw new Error(`Google sign-in rejected: ${check.reason}`);
    }

    const existing = await req.payload.find({
      collection: AUTH_COLLECTION,
      where: { email: { equals: check.email } },
      limit: 1,
      depth: 0,
      req,
    });
    const user = existing.docs[0] as { name?: string | null } | undefined;

    const data: Record<string, unknown> = {
      email: check.email,
      sub: check.sub,
    };
    if (check.name && !user?.name) data.name = check.name;
    return data;
  };

export const googlePluginOptions = (
  settings: GoogleAuthSettings | null
): PluginTypes => ({
  enabled: settings !== null,
  strategyName: GOOGLE_STRATEGY,
  authCollection: AUTH_COLLECTION,
  useEmailAsIdentity: true,
  serverURL: settings?.serverURL ?? '',
  clientId: settings?.clientId ?? '',
  clientSecret: settings?.clientSecret ?? '',
  tokenEndpoint: GOOGLE_TOKEN_URL,
  // Unused (we serve the authorize endpoint ourselves) but kept accurate.
  providerAuthorizationUrl: GOOGLE_AUTHORIZE_URL,
  scopes: SCOPES,
  authorizePath: AUTHORIZE_PATH,
  callbackPath: CALLBACK_PATH,
  onUserNotFoundBehavior: 'create',
  callbackExtractToken: extractCallbackCode,
  getUserInfo: settings
    ? createGetUserInfo(settings)
    : async () => {
        throw new Error('Google sign-in is not configured');
      },
  successRedirect: () => '/admin',
  failureRedirect: () => LOGIN_ERROR_REDIRECT,
});

/**
 * Payload plugin: Google sign-in on the `users` collection. A no-op (fail closed: no
 * endpoints, no strategy, no button) unless every Google setting is present.
 */
export const googleAuthPlugin =
  (settings: GoogleAuthSettings | null = getGoogleAuthSettings()): Plugin =>
  (incoming: Config) => {
    if (!settings) return incoming;
    const config: Config = {
      ...incoming,
      collections: incoming.collections?.map((collection) =>
        collection.slug === AUTH_COLLECTION
          ? {
              ...collection,
              endpoints: [
                ...(collection.endpoints || []),
                createAuthorizeEndpoint(settings),
              ],
            }
          : collection
      ),
    };
    return OAuth2Plugin(googlePluginOptions(settings))(config);
  };
