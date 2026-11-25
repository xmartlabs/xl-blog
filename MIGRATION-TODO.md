# Astro migration: pending work

Work left before the new blog replaces the Gatsby site in production.

## Content and media

- [ ] **Shrink `static/images/vytallyink_demo2.mp4`.** It's 38.5 MiB, but Cloudflare Workers static assets accept at most 25 MiB per file. It's the demo video in "Introducing VytalLink" (`blogs/introducing-vytallink.mdx`, `/blog/vytallink-app/`).
  - Preferred: re-encode it with H.264 to under 25 MiB (e.g. `ffmpeg -i in.mp4 -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 96k out.mp4`). Check that it still looks fine, then replace the file.
  - Alternatives: upload it to YouTube and use `<VideoPlayer id="…" />`, or host it on R2 and set `PUBLIC_MEDIA_BASE_URL`.
  - Until then, `static/.assetsignore` keeps it out of deploys, so the video doesn't play on deployed previews. Remove that entry once the file is fixed.

## CMS sign-in with Google

- [ ] **Decide how to ship the "Sign in with Google" button.** The sign-in service already supports it: branch `google-sign-in` in `~/Documents/GitHub/sveltia-cms-additions`, commit `fe8b181`. Sveltia CMS itself still needs a small patch to show the button (4 files).
  - Upstream PRs for both, plus self-hosting a patched `sveltia-cms.js` until they merge.
  - Or self-host only.
- [ ] Deploy the Additions worker to `cms-auth.xmartlabs.com` and set `backend.base_url` in `static/admin/config.yml`.
- [ ] Google Cloud OAuth client: "Internal" consent screen, redirect URI `https://cms-auth.xmartlabs.com/v1/auth/callback/google`. Worker secrets: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_ALLOWED_DOMAINS=xmartlabs.com`.
- [ ] GitHub App in the xmartlabs org (Contents + Pull requests: write), installed on `xl-blog` only. The Additions setup wizard creates it.
- [ ] Test the `VideoPlayer` editor component in the CMS. It only recognizes single-line `<VideoPlayer … />` tags.

## Hosting

- [ ] Cloudflare Workers Builds connected to `xmartlabs/xl-blog`: build `npm run build`, deploy `npx wrangler deploy`, preview URLs for non-production branches, and the build variables `PUBLIC_GTM_ID`, `PUBLIC_FORM_URL` and `PUBLIC_MEDIA_BASE_URL`.
- [ ] Cutover: point `blog.xmartlabs.com` to the Worker. Keep the Netlify site for 2 weeks as a rollback, then turn off Netlify Identity and Git Gateway.

## Small cleanups

- [ ] Redirect the old Jekyll-style URLs (`/YYYY/MM/DD/<name>/`, e.g. `/2014/12/02/linkedin-for-work/`) to the new `/blog/<slug>/` pages with `static/_redirects`. Six posts still link to them, and they already 404 on the live site.
- [ ] Missing thumbnails, also missing on live (the fallback image shows): `/images/crashlytics-timber-web.png`, `/images/portada.jpg`, `/images/swift-with-the-best-web.png`.
- Known small differences from live: Instagram embeds in "a look back at 2020" render taller (Instagram sizes them itself). In 3 old posts (`wwdc-2015-by-helen`, `challenges-of-building-a-web-with-flutter`, `xmartlabs-in-startup-weekend-montevideo`), captions written as `<p style=…>` now get their intended small/italic style; live ignored it because of nested `<p>` tags.
- [ ] `npm run check` needs `@astrojs/check` and `typescript` installed.
- [ ] `.vscode/launch.json` still points at the Gatsby binary.
- [ ] Update the internal "XL Blog" how-to (publishing, adding authors, giving CMS access) for the new flow.
