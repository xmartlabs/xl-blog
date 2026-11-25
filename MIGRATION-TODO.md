# Next.js + Payload migration: pending work

Work left before the new blog (branch `nextjs-payload`) replaces the Gatsby site in production.

## Vercel setup (needs someone with access)

- [ ] Vercel project linked to `xmartlabs/xl-blog` (Pro team). Framework Next.js; `vercel.json` already sets the build command `npm run ci` and the cron job. Node.js version 24.x in Project Settings → Build.
- [ ] **Neon Postgres** from the Vercel Marketplace, connected to Production and Preview (sets `DATABASE_URL`). In the Neon integration settings, enable **a database branch per preview deployment**, so previews (and their migrations) never touch production data. Neon's integration does this natively; no GitHub workflow or tokens are needed.
- [ ] **Vercel Blob** store connected to the project (sets `BLOB_READ_WRITE_TOKEN`). New uploads go there; the old images stay in `public/images/`.
- [ ] Environment variables (Production and Preview): `PAYLOAD_SECRET` (different per environment), `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_ALLOWED_DOMAIN=xmartlabs.com`, `CRON_SECRET` (letters/digits), `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_FORM_URL`, `FIRST_ADMIN_EMAIL`/`FIRST_ADMIN_PASSWORD` (production, for the first start). `NEXT_PUBLIC_SERVER_URL=https://blog.xmartlabs.com` for Production; for Preview either leave it empty (falls back to the branch URL) or set it to the one preview host registered in Google.
- [ ] **Deployment Protection**: turn off Vercel Authentication for Preview deployments (or use shareable links), otherwise bloggers can't open previews and Google's OAuth callback can't reach the preview.
- [ ] First production deploy: the build runs `payload migrate` on the empty Neon database, then builds an empty site. Then run the content migration once against production: `npx vercel env pull .env.production.local`, then `DATABASE_URL=<neon url> CRON_SECRET=<prod secret> REVALIDATE_URL=https://<production host> npm run seed:migrate-content`. The script ends by calling `/next/revalidate/`, so the pages pre-rendered while the database was empty (home, tags, sitemap) are regenerated without a redeploy. (Rehearsed locally on an empty database: migrate + build + import + revalidate → home 12 posts, 442 tags, sitemap 719 URLs.)
- [ ] Cron: check after the first deploy that Project → Settings → Cron Jobs lists `/api/payload-jobs/run/` and that its invocations return 200 (401 = `CRON_SECRET` missing/mismatched). Crons only run on production deployments.
- [ ] Cutover: point `blog.xmartlabs.com` to Vercel. Keep the Netlify site for 2 weeks as a rollback, then turn off Netlify Identity and Git Gateway.

## Google sign-in

- [ ] Google Cloud OAuth client ("Web application") in the xmartlabs.com organization, consent screen **Internal**. Redirect URIs: `http://localhost:3000/api/users/oauth/google/callback`, `https://blog.xmartlabs.com/api/users/oauth/google/callback`, and optionally one fixed preview host. Sign-in can't work on random per-deployment preview URLs (Google needs exact redirect URIs).
- [ ] End-to-end test with a real account: an @xmartlabs.com account signs in and gets an `editor` user; a personal Gmail is rejected.
- [ ] Promote the real admins, then set `DISABLE_PASSWORD_LOGIN=true` in production (Google sign-in only; login tokens then last 8 hours) and remove `FIRST_ADMIN_PASSWORD` from the environment.

## Verify in the browser (not done by the automated checks)

- [ ] Live preview with a signed-in user: edit a draft's title/body and see the preview pane update; check the **Preview** button; check that a logged-out browser never sees the draft. (Draft mode and access were verified over HTTP: `/next/preview/` returns 403 without a session, and a stale draft-mode cookie without a session shows the published version.)
- [ ] Schedule a post from the admin UI on a deployed preview and wait for the cron (the jobs endpoint + schedulePublish were tested locally with `CRON_SECRET`).
- [ ] Create a post that uses every block and a Blob upload, publish it, see it on `/` and its category page, then unpublish it.

## Content and media

- [ ] **`public/images/vytallyink_demo2.mp4` (38.5 MB)**, the demo video in `/blog/vytallink-app/`. Vercel documents no per-file limit for static files of Git deployments (the documented limits are 1 GB of source files per CLI deployment on Pro and 10 MB for cacheable _function_ responses, which doesn't apply to `public/`). The whole `public/` is 654 MB, under the 1 GB Pro limit. Check on the first preview deploy that the video plays. If it doesn't (or to keep deployments smaller):
  1. Upload it to the Blob store (Vercel dashboard → Storage → the Blob store → Upload, or `vercel blob put public/images/vytallyink_demo2.mp4`).
  2. Set `NEXT_PUBLIC_MEDIA_BASE_URL` to the store's public base URL (the video block's legacy file name is appended), or edit the post's video block and upload the file there.
  3. Remove the file from `public/images/`.
- [ ] Missing thumbnails, also missing on live (the fallback image shows): `/images/crashlytics-timber-web.png`, `/images/portada.jpg`, `/images/swift-with-the-best-web.png`.
- [x] Old Jekyll-style URLs (`/YYYY/MM/DD/<name>/`, e.g. `/2014/12/02/linkedin-for-work/`) redirect (308) to `/blog/<slug>/`: `redirects()` in `next.config.mjs`, generated from `migration/legacy/posts.json` (file-name date and post date, case-insensitive). Not covered: `/2021/08/30/Bender-the-best` (a mistyped link; the post is `/blog/how-to-get-the-best-performance-for-ml-models-on-ios/`) and the file name with a space (`2022-06-27-Top EVM-compatible-frameworks.md`). If an editor changes the slug of an old post, its redirect still points to the old slug.

## Known differences from the live (Gatsby) site

Full height sweep at 1440px (175 posts + list pages, tag, author and 404 pages): 178 of 191 pages identical. The rest:

- `/blog/a-look-back-at-2020/`: Instagram embeds render taller (Instagram sizes them itself).
- `wwdc-2015-by-helen` (+32px), `challenges-of-building-a-web-with-flutter` (−32px), `xmartlabs-in-startup-weekend-montevideo` (+10px): captions written as `<p style=…>` get their intended small/italic style; live ignores it because of nested `<p>` tags.
- `crypto-landscape-2021`, `techcrunch-disrupt-2021-takeaways-for-entrepreneurs-and-founders`: the embedded tweets render; on live they stay plain blockquotes (Gatsby's hydration replaces them before Twitter's script runs).
- `pdf-charts-images-processing-with-llm`: the "slide with charts" image shows; on live its relative `../static/…` path is broken.
- `/tags/`, `/tags/<tag>/`, `/authors/<slug>/`: these pages use the site layout (nav menu, padding, footer), and tag variants such as "AI"/"ai" are merged into one page; live renders them unstyled and keeps one variant per URL (e.g. live `/tags/ai/` lists 1 post, the new one 14).
- `/categories/`: live shows a broken "NaN" pager; heights match.
- 404s from `notFound()` (unknown post/category/tag/author/page number) return status 404 but Next 16 sends an error shell and renders the styled 404 on the client. URLs that match no route at all get the fully server-rendered 404 (`app/global-not-found.tsx`, `experimental.globalNotFound`).
- No `robots.txt`: live's is added by Cloudflare (content signals), not by the site.

## Small cleanups

- [ ] `.vscode/launch.json` still points at the Gatsby binary.
- [ ] Remove `blogs/`, `content/` and the `migration/` snapshot once production runs on Payload (keep `migration/legacy/posts.json` while the Jekyll redirects are generated from it, or inline them).
- [ ] Update the internal "XL Blog" how-to (publishing, adding authors, giving CMS access) for the new flow; README "Writing posts" is a starting point.
