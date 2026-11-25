import { readFileSync } from 'node:fs';

import { withPayload } from '@payloadcms/next/withPayload';

/**
 * Old Jekyll URLs (`/YYYY/MM/DD/<file name>/`) → `/blog/<slug>/`. Several posts still link to
 * them. Built from the legacy post list: the date comes from the file name and from the post's
 * date (Jekyll used the latter when set), the name is the file name without date/extension.
 */
const legacyRedirects = () => {
  const posts = JSON.parse(
    readFileSync(
      new URL('./migration/legacy/posts.json', import.meta.url),
      'utf8'
    )
  );
  const redirects = new Map();
  for (const post of posts) {
    const match = post.sourceFile.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.mdx?$/);
    // Skip names that aren't plain path segments (one has a space).
    if (!match || !/^[\w.-]+$/.test(match[4])) continue;
    const [, year, month, day, name] = match;
    for (const date of new Set([
      `${year}/${month}/${day}`,
      post.date.replaceAll('-', '/'),
    ])) {
      redirects.set(`/${date}/${name}/`, `/blog/${post.slug}/`);
    }
  }
  return [...redirects].map(([source, destination]) => ({
    source,
    destination,
    permanent: true,
  }));
};

// The security headers the Gatsby/Netlify site sent. X-Frame-Options note: Payload's live
// preview shows the frontend (e.g. /blog/<slug>/) in an iframe inside /admin, so the frontend
// pages must allow same-origin framing (SAMEORIGIN still blocks every other site). The admin
// panel and API are never framed, so they keep DENY.
const securityHeaders = (frameOptions) => [
  { key: 'X-Frame-Options', value: frameOptions },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'same-origin' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Every public URL ends with a slash, e.g. /blog/<slug>/.
  trailingSlash: true,
  experimental: {
    // app/global-not-found.tsx: the styled 404 for unmatched URLs (two root layouts).
    globalNotFound: true,
  },
  async redirects() {
    return legacyRedirects();
  },
  async headers() {
    // When several rules set the same header, the last matching rule wins.
    return [
      { source: '/:path*', headers: securityHeaders('SAMEORIGIN') },
      { source: '/admin/:path*', headers: securityHeaders('DENY') },
      { source: '/api/:path*', headers: securityHeaders('DENY') },
    ];
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
