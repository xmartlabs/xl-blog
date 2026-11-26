import { readFileSync } from 'node:fs';

import { withPayload } from '@payloadcms/next/withPayload';

import { cspHeaders } from './src/lib/csp.mjs';
import { legacyRedirects } from './src/lib/legacy-redirects.mjs';
import { isNoIndexDeployment } from './src/lib/robots.mjs';

// Old Jekyll URLs (`/YYYY/MM/DD/<file name>/`) → `/blog/<slug>/` (src/lib/legacy-redirects.mjs).
const legacyPosts = () =>
  JSON.parse(
    readFileSync(
      new URL('./migration/legacy/posts.json', import.meta.url),
      'utf8'
    )
  );

// The security headers the Gatsby/Netlify site sent. X-Frame-Options note: Payload's live
// preview shows the frontend (e.g. /blog/<slug>/) in an iframe inside /admin, so the frontend
// pages must allow same-origin framing (SAMEORIGIN still blocks every other site). The admin
// panel and API are never framed, so they keep DENY.
// Plus a Content Security Policy, report-only unless CSP_ENFORCE=true (src/lib/csp.mjs): one
// for the site, a more permissive one for the admin panel.
const securityHeaders = (frameOptions, cspArea) => [
  { key: 'X-Frame-Options', value: frameOptions },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Not `same-origin` (the old site's value): YouTube refuses to play embeds when the page sends
  // no referrer ("Error 153: Video player configuration error"). This browser-default policy
  // sends other sites only the origin (https://blog.xmartlabs.com), never the page path.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  ...cspHeaders(cspArea),
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
    return legacyRedirects(legacyPosts());
  },
  async headers() {
    // When several rules set the same header, the last matching rule wins.
    return [
      { source: '/:path*', headers: securityHeaders('SAMEORIGIN', 'public') },
      { source: '/admin/:path*', headers: securityHeaders('DENY', 'admin') },
      { source: '/api/:path*', headers: securityHeaders('DENY', 'public') },
      // Vercel preview deployments must not be indexed (robots.txt disallows everything too).
      ...(isNoIndexDeployment(process.env)
        ? [
            {
              source: '/:path*',
              headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
            },
          ]
        : []),
    ];
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
