import { withPayload } from '@payloadcms/next/withPayload';

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
