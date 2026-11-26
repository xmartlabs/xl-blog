/**
 * Old Jekyll URLs (`/YYYY/MM/DD/<file name>/`) → `/blog/<slug>/`. Several posts still link to
 * them. Used by `redirects()` in next.config.mjs (plain JS: the config can't import TypeScript).
 *
 * Generated from the legacy post list (migration/legacy/posts.json): the date comes from the
 * file name and from the post's date (Jekyll used the latter when set), the name is the file
 * name without date/extension. Next matches redirect sources case-insensitively.
 */

/**
 * Old links that the file names don't produce. [source, slug].
 * @type {ReadonlyArray<readonly [string, string]>}
 */
export const EXTRA_LEGACY_REDIRECTS = [
  // A mistyped link (in /blog/t-flite-to-core-ml/) to 2021-08-30-bender-is-the-best.mdx.
  [
    '/2021/08/30/Bender-the-best/',
    'how-to-get-the-best-performance-for-ml-models-on-ios',
  ],
];

/**
 * The URL forms of a file name. A name with spaces (one post: "Top EVM-compatible-frameworks")
 * was published with an encoded space (`Top%20EVM-…`); people also type it with a dash.
 * Names with any other character outside [A-Za-z0-9_.-] are skipped.
 * @param {string} name
 * @returns {string[]}
 */
export function legacyNameVariants(name) {
  if (/^[\w.-]+$/.test(name)) return [name];
  if (/^[\w.-]+( [\w.-]+)+$/.test(name)) {
    return [name.replaceAll(' ', '%20'), name.replaceAll(' ', '-')];
  }
  return [];
}

/**
 * @param {ReadonlyArray<{ sourceFile: string; date: string; slug: string }>} posts
 * @param {ReadonlyArray<readonly [string, string]>} [extra]
 * @returns {{ source: string; destination: string; permanent: true }[]}
 */
export function legacyRedirects(posts, extra = EXTRA_LEGACY_REDIRECTS) {
  /** @type {Map<string, string>} */
  const redirects = new Map();
  for (const post of posts) {
    const match = post.sourceFile.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.mdx?$/);
    if (!match) continue;
    const [, year, month, day, name] = match;
    const dates = new Set([
      `${year}/${month}/${day}`,
      post.date.replaceAll('-', '/'),
    ]);
    for (const date of dates) {
      for (const variant of legacyNameVariants(name)) {
        redirects.set(`/${date}/${variant}/`, `/blog/${post.slug}/`);
      }
    }
  }
  for (const [source, slug] of extra) {
    if (!redirects.has(source)) redirects.set(source, `/blog/${slug}/`);
  }
  return [...redirects].map(([source, destination]) => ({
    source,
    destination,
    permanent: true,
  }));
}
