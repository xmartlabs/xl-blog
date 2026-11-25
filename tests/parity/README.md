# Parity test: live blog vs new site

Compares the live production blog (Gatsby, <https://blog.xmartlabs.com>) with the new
Next.js + Payload site, page by page, and writes a report of every difference.

For every `<loc>` in the live `sitemap-0.xml` (plus `/tags/` and a 404 URL), at **1440×900**
(`desktop`) and **375×812** (`mobile`), it checks:

| Check    | What                                                                                          |
| -------- | --------------------------------------------------------------------------------------------- |
| `status` | Same HTTP status (200 ↔ 200, 404 ↔ 404).                                                      |
| `height` | Same `document.documentElement.scrollHeight`.                                                 |
| `width`  | Same `scrollWidth` (catches horizontal overflow).                                             |
| `meta`   | Same `<title>`, canonical, `description`, `og:title`, `og:description`, `og:image`, `og:url`. |
| `text`   | Same visible text of the page (`body.innerText`, ignoring whitespace).                        |
| `blocks` | Posts only: same sequence of `.bodyPostContainer > *` (tag name + height, ±1px).              |
| `pixels` | Full-page screenshot diff with `pixelmatch` (clipped to the viewport width).                  |

Before measuring, both pages get the same treatment: analytics/ads requests are blocked,
animations and transitions are disabled (header marquee, pink circle), the page is scrolled
through to trigger lazy content, and the test waits for fonts, images and network idle.
Third-party embeds (iframes, Instagram/Twitter) and animated GIFs are hidden — keeping their
box — before the screenshot, since they show different content on every load.

## Running it

The new site must run as a production build (not `next dev`) against a database with the
migrated content:

```bash
npm run build && npx next start -p 3002
```

```bash
npx playwright install chromium   # once
npm run test:parity
```

The first run fetches every live page (≈720 URLs × 2 viewports, ~1h at 4 workers). Live results
are cached in `tests/parity/.cache/live/`, so later runs only load the new site.

Options (environment variables):

| Variable                      | Default                      | Meaning                                                        |
| ----------------------------- | ---------------------------- | -------------------------------------------------------------- |
| `BASE_LIVE`                   | `https://blog.xmartlabs.com` | Reference site.                                                |
| `BASE_NEW`                    | `http://localhost:3002`      | Site under test.                                               |
| `PARITY_ONLY`                 | `all`                        | `posts` (`/blog/*`), `lists` (everything else) or `all`.       |
| `PARITY_SLUGS`                | –                            | Comma-separated slugs or paths, e.g. `crypto-landscape-2021`.  |
| `PARITY_LIMIT`                | –                            | Only the first _n_ URLs.                                       |
| `PARITY_REFRESH`              | –                            | `1` re-fetches the live site and sitemap instead of the cache. |
| `PARITY_WORKERS`              | `4`                          | Parallel tests (capped at 4 to be polite to production).       |
| `PARITY_DELAY_MS`             | `500`                        | Pause before each live request.                                |
| `PARITY_HEIGHT_TOLERANCE`     | `0`                          | Allowed height difference, px.                                 |
| `PARITY_PIXEL_TOLERANCE`      | `0`                          | Allowed differing pixels, % of the page.                       |
| `PARITY_PIXEL_NOISE`          | `10`                         | Differing pixels ignored as noise (image decoding).            |
| `PARITY_PIXELMATCH_THRESHOLD` | `0.1`                        | pixelmatch per-pixel colour sensitivity (0–1).                 |

One viewport only: `npm run test:parity -- --project=desktop` (or `mobile`).

## Output

- `tests/parity/report/index.html` — sortable, filterable table (URL, viewport, result, status,
  height Δ, pixel Δ, failing checks with meta/text/block details, links to the live, new and
  diff screenshots, which are kept only for pages whose pixels differ).
- `tests/parity/report/report.json` — the same data.
- The exit code is non-zero when any page has an **unexpected** difference.

Each page × viewport ends up as one of: `pass` (identical), `known` (differs only in ways listed
in `known-differences.json`), `fail` (an unexpected difference) or `error` (a page couldn't be
captured).

## Known differences

`known-differences.json` lists accepted differences, each with a reason. An entry matches a
`path` or a `pattern` (regex), optionally only some `viewports`, and names the `checks` it
explains (`"*"` for all; `"meta:<tag>"` for a single meta tag). Add an entry when a difference
is intended; remove it once the pages match again (the report counts known entries for specific
pages that no longer differ).

Entries with `"normalize": true` are site-wide intended fixes (the canonical link, `og:url`,
`og:image`): what they explain counts as equal, so the page can still be `pass`.
`liveMetaRewrite` (`{ "og:image": [regex, replacement] }`) fixes a live meta value before the
comparison, so only that exact live bug is accepted.

When you change what a capture does (`lib/capture.ts`), bump `CAPTURE_VERSION` in
`lib/settings.ts` so cached live captures are taken again.
