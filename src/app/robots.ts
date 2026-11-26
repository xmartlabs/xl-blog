import type { MetadataRoute } from 'next';

import { robotsConfig } from '../lib/robots.mjs';

/**
 * /robots.txt: production allows crawling (except /admin, /api, /next/) and lists the
 * sitemap; Vercel preview deployments disallow everything (src/lib/robots.mjs). Generated at
 * build time, when VERCEL_ENV and the site URL are known.
 */
export default function robots(): MetadataRoute.Robots {
  return robotsConfig(process.env);
}
