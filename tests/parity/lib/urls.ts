import fs from 'node:fs';
import path from 'node:path';

import {
  BASE_LIVE,
  EXTRA_PATHS,
  LIMIT,
  ONLY,
  REFRESH,
  SITEMAP_CACHE,
  SLUGS,
} from './settings';

/** Downloads the live sitemap once into `.cache/` (again with PARITY_REFRESH=1). */
export async function ensureSitemap(): Promise<void> {
  if (
    fs.existsSync(SITEMAP_CACHE) &&
    !(REFRESH && !process.env.PARITY_SITEMAP_FETCHED)
  ) {
    return;
  }
  const res = await fetch(`${BASE_LIVE}/sitemap-0.xml`);
  if (!res.ok)
    throw new Error(`GET ${BASE_LIVE}/sitemap-0.xml → ${res.status}`);
  fs.mkdirSync(path.dirname(SITEMAP_CACHE), { recursive: true });
  fs.writeFileSync(SITEMAP_CACHE, await res.text());
  // Workers inherit this, so they don't fetch it again.
  process.env.PARITY_SITEMAP_FETCHED = '1';
}

/** Every `<loc>` of the cached live sitemap as a site-relative path, plus the extras. */
export function allPaths(): string[] {
  const xml = fs.readFileSync(SITEMAP_CACHE, 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (m) => new URL(m[1]).pathname
  );
  return [...new Set([...locs, ...EXTRA_PATHS])];
}

export const isPost = (p: string) => /^\/blog\/[^/]+\/$/.test(p);

/** The paths selected by PARITY_ONLY, PARITY_SLUGS and PARITY_LIMIT. */
export function selectedPaths(): string[] {
  let paths = allPaths();
  if (ONLY === 'posts') paths = paths.filter(isPost);
  else if (ONLY === 'lists') paths = paths.filter((p) => !isPost(p));
  if (SLUGS.length) {
    paths = paths.filter((p) =>
      SLUGS.some(
        (s) => p === s || p.split('/').includes(s.replace(/^\/|\/$/g, ''))
      )
    );
  }
  if (LIMIT !== undefined) paths = paths.slice(0, LIMIT);
  return paths;
}
