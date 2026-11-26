/**
 * Content Security Policy for the public site and for the admin panel. Plain JS (JSDoc types)
 * because next.config.mjs sends it as a header (the config can't import TypeScript).
 *
 * Report-only by default (`Content-Security-Policy-Report-Only`): browsers report what the
 * policy would block to /next/csp-report/ (logged as `[csp]` lines) but block nothing.
 * `CSP_ENFORCE=true` at build time sends the same policy as `Content-Security-Policy`.
 *
 * Why `'unsafe-inline'` in script-src: the pages are statically generated, and Next writes
 * the page's React Server Components payload as inline `<script>self.__next_f.push(…)</script>`
 * tags whose content differs per page and per build, so they can't be listed as hashes. A
 * nonce needs a per-request value, i.e. dynamic rendering of every page (no static/ISR
 * pages), which this site deliberately avoids. Our own inline scripts (the image-fallback
 * script, the GTM snippet) would be hashable, but one hash doesn't help while the Next ones
 * need `'unsafe-inline'` (and a hash in the list would turn `'unsafe-inline'` off). Legacy
 * post bodies also carry inline `style` attributes, hence `'unsafe-inline'` in style-src.
 *
 * @typedef {Record<string, string | undefined>} Env
 * @typedef {Record<string, string[]>} Directives
 */

export const CSP_REPORT_PATH = '/next/csp-report/';
export const CSP_REPORT_GROUP = 'csp-endpoint';

const SELF = "'self'";
const NONE = "'none'";
const UNSAFE_INLINE = "'unsafe-inline'";

/** Google Tag Manager + Google Analytics 4 (only when NEXT_PUBLIC_GTM_ID is set). */
const GTM = {
  script: [
    'https://www.googletagmanager.com',
    'https://*.googletagmanager.com',
  ],
  connect: [
    'https://*.googletagmanager.com',
    'https://*.google-analytics.com',
    'https://*.analytics.google.com',
  ],
  frame: ['https://www.googletagmanager.com'],
};

/** Embeds used by post bodies: YouTube, Twitter/X, Instagram. */
const EMBEDS = {
  script: ['https://platform.twitter.com', 'https://www.instagram.com'],
  frame: [
    'https://www.youtube.com',
    // One legacy post embeds https://youtube.com/embed/… (redirects to www).
    'https://youtube.com',
    'https://www.youtube-nocookie.com',
    'https://platform.twitter.com',
    'https://syndication.twitter.com',
    'https://www.instagram.com',
  ],
  connect: [
    'https://syndication.twitter.com',
    'https://cdn.syndication.twimg.com',
  ],
};

/** Public files of the Vercel Blob store (new uploads, e.g. videos). Images are under https:. */
const BLOB_STORE = 'https://*.public.blob.vercel-storage.com';
/** Monaco, the editor of the admin's code fields, loads from jsDelivr (@monaco-editor/loader). */
const JSDELIVR = 'https://cdn.jsdelivr.net';
/** Vercel Blob client uploads (admin) go to this API. */
const VERCEL_BLOB_API = 'https://vercel.com';

/**
 * The origin of a URL from the environment, or null when unset/invalid/not http(s).
 * @param {string | undefined} url
 * @returns {string | null}
 */
export function originOf(url) {
  if (!url?.trim()) return null;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
      ? parsed.origin
      : null;
  } catch {
    return null;
  }
}

/** @param {(string | null | undefined | false)[]} values */
const list = (...values) => [
  ...new Set(values.filter((v) => typeof v === 'string' && v.length > 0)),
];

/**
 * @param {Env} [env]
 * @returns {Directives}
 */
export function publicDirectives(env = process.env) {
  const gtm = Boolean(env.NEXT_PUBLIC_GTM_ID?.trim());
  const formOrigin = originOf(env.NEXT_PUBLIC_FORM_URL);
  const mediaOrigin = originOf(env.NEXT_PUBLIC_MEDIA_BASE_URL);
  return {
    'default-src': [SELF],
    'script-src': list(
      SELF,
      UNSAFE_INLINE,
      ...EMBEDS.script,
      ...(gtm ? GTM.script : [])
    ),
    'style-src': [SELF, UNSAFE_INLINE],
    // Legacy posts show images from many external hosts.
    'img-src': [SELF, 'data:', 'blob:', 'https:'],
    'font-src': [SELF, 'data:'],
    'connect-src': list(SELF, ...EMBEDS.connect, ...(gtm ? GTM.connect : [])),
    'frame-src': list(
      SELF,
      ...EMBEDS.frame,
      formOrigin,
      ...(gtm ? GTM.frame : [])
    ),
    'media-src': list(SELF, BLOB_STORE, mediaOrigin),
    'object-src': [NONE],
    'base-uri': [SELF],
    'form-action': [SELF],
    // Payload's live preview frames the site inside /admin (same origin).
    'frame-ancestors': [SELF],
  };
}

/**
 * The admin panel (/admin): Payload's React app. Its inline styles and scripts, Monaco from
 * jsDelivr (code fields: workers from blob: URLs), live preview of the site in an iframe, and
 * Vercel Blob client uploads.
 * @returns {Directives}
 */
export function adminDirectives() {
  return {
    'default-src': [SELF],
    'script-src': [SELF, UNSAFE_INLINE, JSDELIVR],
    'style-src': [SELF, UNSAFE_INLINE, JSDELIVR],
    'img-src': [SELF, 'data:', 'blob:', 'https:'],
    'font-src': [SELF, 'data:', JSDELIVR],
    'connect-src': [SELF, VERCEL_BLOB_API, BLOB_STORE, JSDELIVR],
    'worker-src': [SELF, 'blob:'],
    'frame-src': [SELF],
    'media-src': [SELF, 'blob:', BLOB_STORE],
    'object-src': [NONE],
    'base-uri': [SELF],
    'form-action': [SELF],
    'frame-ancestors': [NONE],
  };
}

/**
 * @param {Directives} directives
 * @returns {string}
 */
export function serializeCsp(directives) {
  return [
    ...Object.entries(directives).map(([name, values]) =>
      [name, ...values].join(' ')
    ),
    `report-uri ${CSP_REPORT_PATH}`,
    `report-to ${CSP_REPORT_GROUP}`,
  ].join('; ');
}

/** @param {Env} [env] */
export const isCspEnforced = (env = process.env) =>
  ['true', '1', 'yes'].includes(env.CSP_ENFORCE?.trim().toLowerCase() ?? '');

/**
 * The CSP headers for one area of the site, as next.config `headers()` entries.
 * @param {'public' | 'admin'} area
 * @param {Env} [env]
 * @returns {{ key: string, value: string }[]}
 */
export function cspHeaders(area, env = process.env) {
  const policy = serializeCsp(
    area === 'admin' ? adminDirectives() : publicDirectives(env)
  );
  return [
    {
      key: isCspEnforced(env)
        ? 'Content-Security-Policy'
        : 'Content-Security-Policy-Report-Only',
      value: policy,
    },
    // Reporting API endpoint for `report-to` (relative: resolved against the page's URL).
    {
      key: 'Reporting-Endpoints',
      value: `${CSP_REPORT_GROUP}="${CSP_REPORT_PATH}"`,
    },
  ];
}
