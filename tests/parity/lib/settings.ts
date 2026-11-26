import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Shared settings for the parity suite, all overridable through environment variables. */

export const PARITY_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);
export const CACHE_DIR = path.join(PARITY_DIR, '.cache');
export const REPORT_DIR = path.join(PARITY_DIR, 'report');
export const RESULTS_DIR = path.join(REPORT_DIR, 'results');
export const SITEMAP_CACHE = path.join(CACHE_DIR, 'sitemap-0.xml');

const env = process.env;

export const BASE_LIVE = (
  env.BASE_LIVE || 'https://blog.xmartlabs.com'
).replace(/\/$/, '');
export const BASE_NEW = (env.BASE_NEW || 'http://localhost:3002').replace(
  /\/$/,
  ''
);

/** Re-fetch live pages (and the sitemap) instead of using `.cache/`. */
export const REFRESH = env.PARITY_REFRESH === '1';
export const ONLY = (env.PARITY_ONLY || 'all') as 'posts' | 'lists' | 'all';
export const LIMIT = env.PARITY_LIMIT ? Number(env.PARITY_LIMIT) : undefined;
export const SLUGS = (env.PARITY_SLUGS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

/** Never more than 4 pages in flight: half of every test hits production. */
export const WORKERS = Math.min(
  4,
  Math.max(1, Number(env.PARITY_WORKERS || 4))
);
/** Pause before each request to the live site, in ms. */
export const LIVE_DELAY_MS = Number(env.PARITY_DELAY_MS ?? 500);

/** Allowed |height delta| in px. */
export const HEIGHT_TOLERANCE = Number(env.PARITY_HEIGHT_TOLERANCE ?? 0);
/** Allowed share of differing pixels, in percent. */
export const PIXEL_TOLERANCE = Number(env.PARITY_PIXEL_TOLERANCE ?? 0);
/** Differing pixels ignored as noise (image decoding, sub-pixel anti-aliasing). */
export const PIXEL_NOISE = Number(env.PARITY_PIXEL_NOISE ?? 10);
/** pixelmatch per-pixel colour threshold (0–1). */
export const PIXELMATCH_THRESHOLD = Number(
  env.PARITY_PIXELMATCH_THRESHOLD ?? 0.1
);

/** Bump when the capture changes so cached live results are re-fetched. */
export const CAPTURE_VERSION = 3;

export const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 375, height: 812 },
} as const;
export type ViewportName = keyof typeof VIEWPORTS;

/** A path that exists on neither site, to compare the 404 pages. */
export const NOT_FOUND_PATH = '/parity-check-this-page-does-not-exist/';
/** Pages worth checking that the live sitemap doesn't list. */
export const EXTRA_PATHS = ['/tags/', NOT_FOUND_PATH];

/** `/blog/foo/` → `blog__foo`; used for cache and report file names. */
export function pathKey(urlPath: string): string {
  const key = urlPath.replace(/^\/+|\/+$/g, '').replace(/\//g, '__');
  return key === '' ? '_root' : key.replace(/[^a-zA-Z0-9_.-]/g, '-');
}
