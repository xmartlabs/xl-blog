import { resolveServerURL } from '../lib/server-url.mjs';

type Env = Record<string, string | undefined>;

export interface AuthCookieOptions {
  sameSite: 'Lax';
  secure: boolean;
}

/**
 * Options for Payload's `payload-token` login cookie (users `auth.cookies`), which Payload
 * uses for password login, refresh and logout, and payload-oauth2 for Google sign-in
 * (`generatePayloadCookie` reads the collection's auth config).
 *
 * `Secure` whenever the site's public URL is https (production, Vercel previews), so the
 * token never travels over plain http. Off for an http URL (local dev, integration and e2e
 * tests on http://localhost), where a Secure cookie wouldn't be sent back by every client.
 * With no URL at all in production, it stays Secure (fail closed). `SameSite=Lax`: the
 * cookie is sent on top-level navigations (e.g. the redirect back from Google) but not on
 * cross-site subrequests.
 */
export function authCookieOptions(env: Env = process.env): AuthCookieOptions {
  const serverURL = resolveServerURL(env);
  const secure = serverURL
    ? serverURL.toLowerCase().startsWith('https://')
    : env.NODE_ENV === 'production';
  return { sameSite: 'Lax', secure };
}
