# Next.js + Payload migration: pending work

Work left before the new blog (branch `nextjs-payload`, [PR #371](https://github.com/xmartlabs/xl-blog/pull/371)) replaces the Gatsby site in production. The code is complete and CI is green; what's left is the setup on Xmartlabs' accounts, the cutover, and a few follow-ups.

## Order of operations

1. Vercel, Neon, Blob, environment variables and the Google redirect URI (sections below).
2. First deploy from `nextjs-payload`: content import, cron check, parity test against the `vercel.app` URL.
3. DNS cutover: point `blog.xmartlabs.com` to Vercel.
4. **Only then merge PR #371** into `main`, and switch Vercel's Production Branch to `main`. Don't merge earlier: Netlify still deploys `main` to the live site and can't build this app.
5. After 2 weeks without problems: turn off the Netlify site, Netlify Identity and Git Gateway, and delete `netlify.toml` (it makes Netlify skip every build of this codebase, so its last Gatsby deploy stays up as the rollback and PR deploy previews don't fail).

## Vercel setup (needs someone with access)

- [ ] Vercel project linked to `xmartlabs/xl-blog` (Pro team). Framework Next.js; `vercel.json` already sets the build command `npm run ci` and the cron job. Node.js version 24.x in Project Settings → Build. **Production Branch = `nextjs-payload`** (Settings → Git) until the cutover, then `main`.
- [ ] **Neon Postgres** from the Vercel Marketplace (Free plan is enough: the database is ~22 MB), connected to Production and Preview (sets `DATABASE_URL`). In the Neon integration settings, enable **a database branch per preview deployment**, so previews (and their migrations) never touch production data. Neon's integration does this natively; no GitHub workflow or tokens are needed.
- [ ] **Vercel Blob** store connected to the project (sets `BLOB_READ_WRITE_TOKEN`). New uploads go there; the old images stay in `public/images/`. Blob is paid from Pro's monthly credit; the blog's usage is a few cents at most.
- [ ] Environment variables (Production and Preview): `PAYLOAD_SECRET` (different per environment), `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_ALLOWED_DOMAIN=xmartlabs.com`, `CRON_SECRET` (letters/digits), `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_FORM_URL`, `FIRST_ADMIN_EMAIL`/`FIRST_ADMIN_PASSWORD` (production, for the first start; see README "First admin in production"). `NEXT_PUBLIC_SERVER_URL=https://blog.xmartlabs.com` for Production; for Preview either leave it empty (falls back to the branch URL) or set it to the one preview host registered in Google.
- [ ] **Deployment Protection**: turn off Vercel Authentication for Preview deployments (or use shareable links), otherwise bloggers can't open previews and Google's OAuth callback can't reach the preview.
- [ ] First production deploy: the build runs `payload migrate` on the empty Neon database, then builds an empty site, and the first admin is created from `FIRST_ADMIN_EMAIL`. Then run the content migration once against production: `npx vercel env pull .env.production.local`, then `DATABASE_URL=<neon url> CRON_SECRET=<prod secret> REVALIDATE_URL=https://<production host> npm run seed:migrate-content`. The script ends by calling `/next/revalidate/`, so the pages pre-rendered while the database was empty (home, tags, sitemap) are regenerated without a redeploy. (Rehearsed locally on an empty database: migrate + build + import + revalidate → home 12 posts, 442 tags, sitemap 719 URLs.)
- [ ] Cron: check after the first deploy that Project → Settings → Cron Jobs lists `/api/payload-jobs/run/` and that its invocations return 200 (401 = `CRON_SECRET` missing/mismatched). Crons only run on production deployments.
- [ ] **Parity test against the deployment** before switching DNS: `BASE_NEW=https://<project>.vercel.app npm run test:parity` (tests/parity/README.md). Expect 0 unexpected differences, as locally.
- [ ] Cutover: point `blog.xmartlabs.com` to Vercel (Cloudflare DNS). Keep the Netlify site for 2 weeks as a rollback.
- [ ] **robots.txt at cutover**: the site now serves its own `/robots.txt` (allow all except `/admin`, `/api`, `/next/`, plus `Sitemap: https://blog.xmartlabs.com/sitemap-index.xml`). Today's live robots.txt comes from Cloudflare's **managed robots.txt / content signals** setting (only comments, no rules). Decide whether to keep it: if it stays on, Cloudflare prepends its content-signal block (and may add AI-crawler rules) to the site's file. After cutover, `curl https://blog.xmartlabs.com/robots.txt` and check that the `Disallow` and `Sitemap` lines are there; on a preview deployment check `Disallow: /` and the `X-Robots-Tag: noindex, nofollow` header.
- [ ] **CSP**: the Content Security Policy is report-only. For a couple of weeks after cutover, check the Vercel logs for `[csp]` lines (the production GTM container may load other tags; the Typeform iframe wasn't tested locally), adjust `src/lib/csp.mjs`, then set `CSP_ENFORCE=true` (README, "Security headers").
- [ ] Check in the browser on production that the `payload-token` cookie is `Secure` (DevTools → Application → Cookies) after signing in with Google and with the password.

## Google sign-in

- [x] Google Cloud OAuth client ("Web application") in the xmartlabs.com organization, consent screen **Internal**, with the localhost redirect URI (done 2026-11-26). Make sure the project's organization is xmartlabs.com: a client in another organization fails with `Error 403: org_internal`.
- [ ] Add the production redirect URI `https://blog.xmartlabs.com/api/users/oauth/google/callback` to that client (and the `*.vercel.app` production URL if you sign in there before the cutover), plus optionally one fixed preview host. Sign-in can't work on random per-deployment preview URLs (Google needs exact redirect URIs).
- [x] End-to-end test with a real account, locally (2026-11-26): an @xmartlabs.com account signed in through Google and was created as `editor` with its Google id stored. Accounts outside xmartlabs.com are refused by Google itself (Internal consent screen) before reaching the app; the app's own domain check is the second layer (unit tests).
- [ ] Production admins: sign in with Google as `FIRST_ADMIN_EMAIL` (lands in the seeded admin), promote the other admins in Users → Roles, then set `DISABLE_PASSWORD_LOGIN=true` (Google sign-in only; login tokens then last 8 hours) and remove `FIRST_ADMIN_PASSWORD` from the environment. Steps in README, "First admin in production".

## Email (optional, user's call)

- [ ] Password-reset emails are only logged to the server console today (Google users never need them; the break-glass admin's password can be reset by another admin). To send them: create a Resend account, verify a sending domain (e.g. `xmartlabs.com` or a subdomain: DNS records in Cloudflare), then set `RESEND_API_KEY` and `EMAIL_FROM` (e.g. `Xmartlabs Blog <blog@xmartlabs.com>`) in Vercel. The adapter (`@payloadcms/email-resend`, `src/lib/email.ts`) is only enabled when both are set.

## Verify on a deployed preview (not covered by the automated checks)

- [x] Live preview with a signed-in user, the **Preview** button, and that logged-out visitors never see drafts: covered by the e2e tests (`tests/e2e/live-preview.spec.ts`, `draft-privacy.spec.ts`), and checked locally with a Google-signed-in user (2026-11-26), including a YouTube block in Live Preview.
- [ ] Schedule a post from the admin UI and wait for the cron (the jobs endpoint + schedulePublish were tested locally with `CRON_SECRET`).
- [ ] Create a post that uses every block and a **Blob** upload, publish it, see it on `/` and its category page, then unpublish it. (Publishing is covered by `tests/e2e/publishing.spec.ts`; video and image blocks were checked locally with local uploads; Blob uploads need the deployment.)

## Content and media

- [ ] **`public/images/vytallyink_demo2.mp4` (38.5 MB)**, the demo video in `/blog/vytallink-app/`. Vercel documents no per-file limit for static files of Git deployments (the documented limits are 1 GB of source files per CLI deployment on Pro and 10 MB for cacheable _function_ responses, which doesn't apply to `public/`). The whole `public/` is 654 MB, under the 1 GB Pro limit. Check on the first preview deploy that the video plays. If it doesn't (or to keep deployments smaller):
  1. Re-encode it under ~15 MB (`ffmpeg -i in.mp4 -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 96k out.mp4`), or
  2. upload it to the Blob store (Vercel dashboard → Storage → the Blob store → Upload, or `vercel blob put public/images/vytallyink_demo2.mp4`) and set `NEXT_PUBLIC_MEDIA_BASE_URL` to the store's public base URL (the video block's legacy file name is appended), then remove the file from `public/images/`.
- [ ] Missing thumbnails, also missing on live (the fallback image shows): `/images/crashlytics-timber-web.png`, `/images/portada.jpg`, `/images/swift-with-the-best-web.png`.
- [x] Old Jekyll-style URLs (`/YYYY/MM/DD/<name>/`, e.g. `/2014/12/02/linkedin-for-work/`) redirect (308) to `/blog/<slug>/`: `redirects()` in `next.config.mjs`, generated from `migration/legacy/posts.json` (file-name date and post date, case-insensitive). Also covered (`src/lib/legacy-redirects.mjs`, `tests/legacy-redirects.test.ts`): the mistyped link `/2021/08/30/Bender-the-best/` → `/blog/how-to-get-the-best-performance-for-ml-models-on-ios/`, and the file name with a space (`2022-06-27-Top EVM-compatible-frameworks.md`) as `Top%20EVM-…` and `Top-EVM-…`, both dates → `/blog/best-blockchain-development-framework/`. If an editor changes the slug of an old post, its redirect still points to the old slug.

## Known differences from the live (Gatsby) site

The parity test (`npm run test:parity`) compares all 720 URLs of the live sitemap, plus `/tags/` and a 404 page, at 1440px and 375px: **0 unexpected differences** (last run 2026-11-26). The accepted differences, all listed with their reason in `tests/parity/known-differences.json`:

- **SEO fixes**: the new site emits `<link rel=canonical>` and the page's own `og:url`; `og:image` no longer misses the slash after the domain; the 404 page has the default meta tags.
- **Fixed on the new site, broken on live**:
  - **YouTube embeds**: live sends `Referrer-Policy: same-origin`, so YouTube shows "Error 153: Video player configuration error" instead of the video. The new site sends `strict-origin-when-cross-origin`.
  - Embedded tweets render (`crypto-landscape-2021`, `techcrunch-disrupt-2021-takeaways-for-entrepreneurs-and-founders`); on live they stay plain blockquotes.
  - `pdf-charts-images-processing-with-llm`: the "slide with charts" image shows (its relative path is broken on live).
  - A few category pages (`development` pages 5–7, `people-events` page 2): a card thumbnail with a relative path that never loads on live shows the fallback image.
  - `/categories/`: live shows a broken "NaN" pager.
- `challenges-of-building-a-web-with-flutter` (−32px) and `xmartlabs-in-startup-weekend-montevideo` (+10px): captions written as `<p style=…>` get their intended small/italic style; live ignores it because of nested `<p>` tags.
- `/tags/`, `/tags/<tag>/`, `/authors/<slug>/`: these pages use the site layout (nav menu, padding, footer), and tag variants such as "AI"/"ai" are merged into one page; live renders them unstyled and keeps one variant per URL (e.g. live `/tags/ai/` lists 1 post, the new one 14). The live sitemap's empty `/tags//` doesn't exist anymore.
- `robots.txt`: live's is added by Cloudflare (content signals, no rules), not by the site; the new site serves its own (see Vercel setup).

## Follow-ups (after the cutover)

- [ ] **Accessibility** (`tests/e2e/A11Y-FINDINGS.md`): icon-only links and the admin login heading are fixed. Remaining, all from the original design, so they change the look and need a design decision: low color contrast (pink/gray text), a `<main>` landmark around the page content, and heading-level jumps in some old posts (fix by editing those posts in the CMS). The e2e baseline fails on any new issue meanwhile.
- [ ] Remove `blogs/`, `content/` and the `migration/` snapshot once production runs on Payload (keep `migration/legacy/posts.json` while the Jekyll redirects are generated from it, or inline them), and the related import scripts and CI steps.
- [ ] Optional features the old blog didn't have: RSS feed, search, automatic dependency updates (Renovate/Dependabot, Next.js + Payload grouped).

## Docs

- [x] Internal how-to for bloggers, in Spanish: [XL Blog: cómo publicar](https://claude.ai/artifact/GackffrPeGkjZTmseUcWGm) (replaces the Netlify/Decap Notion pages, including the "Blog Snippets" components). Screenshots of each step are being added.
- [ ] Record a new walkthrough video for devs (the one on Drive shows Netlify/Decap).
- [x] `.vscode/launch.json` now runs the Next.js dev server, a server-side debug session and the production build (it pointed at the Gatsby binary).
