/**
 * The site's public origin. Plain JS so next.config.mjs can use it too (the config can't
 * import TypeScript); typed with JSDoc.
 *
 * @typedef {Record<string, string | undefined>} Env
 */

/**
 * On Vercel without NEXT_PUBLIC_SERVER_URL: the production domain, or the branch URL on
 * preview deployments (stable per branch, unlike the per-deployment URL). Google only accepts
 * redirect URIs registered in the OAuth client, so sign-in works on the hosts registered there.
 * @param {Env} env
 * @returns {string}
 */
export const vercelURL = (env) => {
  const host =
    env.VERCEL_ENV === 'production'
      ? env.VERCEL_PROJECT_PRODUCTION_URL
      : env.VERCEL_BRANCH_URL || env.VERCEL_URL;
  return host?.trim() ? `https://${host.trim()}` : '';
};

/**
 * NEXT_PUBLIC_SERVER_URL, else the Vercel URL, else http://localhost:3000 outside production;
 * without a trailing slash. Empty when none applies.
 *
 * Read through the `env` object (not `process.env.NEXT_PUBLIC_…` literally) so Next doesn't
 * inline the build-time value: the e2e server runs the same build on another port.
 * @param {Env} [env]
 * @returns {string}
 */
export function resolveServerURL(env = process.env) {
  return (
    env.NEXT_PUBLIC_SERVER_URL?.trim() ||
    vercelURL(env) ||
    (env.NODE_ENV !== 'production' ? 'http://localhost:3000' : '')
  ).replace(/\/+$/, '');
}
