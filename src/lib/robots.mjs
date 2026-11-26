/**
 * Which kind of deployment this is, and the robots.txt rules for it. Plain JS (JSDoc types)
 * so next.config.mjs can use it for the `X-Robots-Tag` header.
 *
 * @typedef {Record<string, string | undefined>} Env
 * @typedef {'production' | 'preview' | 'local'} DeploymentKind
 */
import { resolveServerURL } from './server-url.mjs';

export const PRODUCTION_URL = 'https://blog.xmartlabs.com';
export const SITEMAP_URL = `${PRODUCTION_URL}/sitemap-index.xml`;
/** Never useful to crawlers: the CMS, its REST API, and preview/revalidate/CSP-report routes. */
export const DISALLOWED_PATHS = ['/admin', '/api', '/next/'];

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

/**
 * - `production`: Vercel production (`VERCEL_ENV=production`), or a production build outside
 *   Vercel served at https://blog.xmartlabs.com.
 * - `preview`: any other Vercel environment (preview deployments, `vercel dev`), and production
 *   builds on an unknown public host (fail closed: not indexed).
 * - `local`: localhost (dev, CI, e2e): served with the production rules so they can be tested.
 * @param {Env} [env]
 * @returns {DeploymentKind}
 */
export function deploymentKind(env = process.env) {
  if (env.VERCEL_ENV) {
    return env.VERCEL_ENV === 'production' ? 'production' : 'preview';
  }
  const serverURL = resolveServerURL(env);
  if (serverURL === PRODUCTION_URL) return 'production';
  let host = '';
  try {
    host = serverURL ? new URL(serverURL).hostname : '';
  } catch {
    host = '';
  }
  if (LOCAL_HOSTS.has(host)) return 'local';
  return env.NODE_ENV === 'production' ? 'preview' : 'local';
}

/**
 * Preview deployments must not be indexed (robots.txt + `X-Robots-Tag: noindex`).
 * @param {Env} [env]
 */
export const isNoIndexDeployment = (env = process.env) =>
  deploymentKind(env) === 'preview';

/**
 * robots.txt as Next's `MetadataRoute.Robots`. The live Gatsby site has no robots.txt of its
 * own (Cloudflare serves one with only content-signal comments, i.e. everything allowed), so
 * production allows everything except the CMS and internal routes, and lists the sitemap.
 * @param {Env} [env]
 * @returns {{ rules: { userAgent: string, allow?: string, disallow: string | string[] }, sitemap?: string }}
 */
export function robotsConfig(env = process.env) {
  if (isNoIndexDeployment(env)) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return {
    rules: { userAgent: '*', allow: '/', disallow: DISALLOWED_PATHS },
    sitemap: SITEMAP_URL,
  };
}
