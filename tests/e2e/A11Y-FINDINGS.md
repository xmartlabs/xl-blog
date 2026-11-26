# Accessibility findings (axe-core)

Scanned by `tests/e2e/a11y.spec.ts` (axe-core 4.14, WCAG 2.0/2.1/2.2 A+AA and best-practice rules) on the e2e build: home `/`, a category page, a post with code and images (`/blog/react-native-line-2/`), the 404 page and `/admin/login/`. Third-party iframes are excluded. The counts are recorded in `a11y-baseline.json`; the test fails only on new rules or more serious/critical nodes. Full details of the last run (selectors, HTML, failure summaries): `tests/e2e/.cache/a11y-report.json` (git-ignored).

The public markup and styles must stay identical to the old site for now, so none of these were fixed. This is the follow-up list.

## Summary

| Page        | Serious             | Moderate                                             |
| ----------- | ------------------- | ---------------------------------------------------- |
| Home        | color-contrast (7)  | landmark-one-main (1), region (7)                    |
| Category    | color-contrast (7)  | landmark-one-main (1), region (7)                    |
| Post        | color-contrast (28) | heading-order (2), landmark-one-main (1), region (8) |
| 404         | color-contrast (8)  | region (2)                                           |
| Admin login | color-contrast (5)  | landmark-one-main (1), region (8)                    |

No critical or minor findings. `lang="en"` is set on every page, and every scanned image has an `alt`.

## Serious

### link-name: links without an accessible name — fixed

Fixed: every icon-only social/share link has an `aria-label` (`SocialElement` + its link lists), and the 404 logo link has one. Kept for reference:

Icon-only links (an SVG with no title or label):

- Footer social links (GitHub, LinkedIn, Twitter, Instagram) on every page; on post pages also the author/company social links and the share buttons (Twitter, Facebook, LinkedIn) of `PostInteractions`.
- The 404 page's logo link (`main > a[href="/"]`).

**Fix (no visual change):** add `aria-label` to each link (e.g. `aria-label="Xmartlabs on GitHub"`, `aria-label="Share on LinkedIn"`), or `<title>` inside the SVG, and `aria-hidden="true"` on the decorative SVG. Changes markup only, not the look; it does change the HTML compared to the old site, so it's left for the follow-up.

### color-contrast: text below 4.5:1

| Where                                                          | Colors                         | Ratio     |
| -------------------------------------------------------------- | ------------------------------ | --------- |
| Nav menu links (Work, Services, …) on the dark bar             | `#858585` on `#222831`         | 4.01      |
| "Let's Talk" button                                            | white on `#ee1a64` (14px bold) | 4.22      |
| Links in post bodies, 404 "Show me those posts" link           | `#ee1a64` on white             | 4.22      |
| Post date and reading time labels                              | `#9b9b9b` on `#f4f7fc`         | 2.58      |
| Image captions in legacy bodies (`<p style="color:gray">`)     | `#808080` on white             | 3.94      |
| Prism Okaidia theme: constants/properties in code blocks       | `#f92672` on `#272822`         | 3.92      |
| Admin login: "Blog" logo label, Google button text, hint texts | `#ee1a64`/`#808080`            | 3.94–4.22 |

**Fix (visual change, needs design sign-off):** darken the brand pink for text (e.g. `#d0104f` is ~5.4:1 on white), the nav gray (≥ `#9a9a9a` on `#222831`), and the date labels (≥ `#6b6b6b` on `#f4f7fc`). The admin login colors (`src/app/(payload)/custom.scss`, `src/auth/GoogleLoginButton.tsx`) aren't part of the public-parity contract and could be fixed independently.

## Moderate

### landmark-one-main / region: no `<main>` landmark

Public pages have no `<main>` (only the 404 page has one), so all content is outside landmarks. **Fix:** wrap the page content in `<main>` (and the nav in `<nav>`, the footer in `<footer>` if not already). Normally no visual change, but the CSS targets the old markup (`#site-root > …` and direct-child selectors), so check in the browser. The admin login page's region/landmark findings come from Payload's own layout plus our Google button block (`beforeLogin`), outside a landmark.

### heading-order (post)

Legacy post bodies jump from `<h1>` to `<h3>` (`Login with Arguments`, `Implementation` in the scanned post). Content issue of individual posts; fix by editing those headings to `h2` in the CMS (changes the rendering of those posts, so not done during the parity period).

### page-has-heading-one (admin login) — fixed

Fixed: `GoogleLoginButton` renders a visually hidden `<h1>` (also when Google sign-in is off). Kept for reference:

Payload's login page has no `<h1>`. Could be added to our `beforeLogin` component (e.g. a visually hidden "Sign in to Xmartlabs Blog" heading) without visual change.

## Trivially fixable without visual change

- ~~`aria-label` on the icon-only links (link-name, all public pages)~~ — done.
- A visually hidden `<h1>` on `/admin/login/` (admin only, no parity constraint).
- `<main>` around the page content: usually invisible, but verify the layout because of the legacy CSS selectors.
