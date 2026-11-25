# XL Blog

The Xmartlabs blog (https://blog.xmartlabs.com): a static site built with [Astro](https://astro.build), edited through [Sveltia CMS](https://sveltiacms.app) and served by [Cloudflare Workers](https://developers.cloudflare.com/workers/static-assets/) static assets.

## Where things live

| Path                          | What                                                                                                                        |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `blogs/*.md`, `blogs/*.mdx`   | Posts. Use `.mdx` only when the post needs components (`<VideoPlayer>`, `<Image>`, `<Table>`).                              |
| `content/authors/<id>.yml`    | Authors (`name`, `image`, `profile_url`, `github`, `twitter`). The file name is the id used in a post's `author`.           |
| `content/categories/<id>.yml` | Categories (`name`, `order` of the filter tabs). The file name is the id used in a post's `category`.                       |
| `static/`                     | Served as-is at the site root (`static/images/foo.png` → `/images/foo.png`), including the CMS at `/admin/`.                |
| `src/content.config.ts`       | Frontmatter schemas. The build fails if a post has a missing/unknown field value.                                           |
| `src/pages/`                  | Routes: `/`, `/page/<n>/`, `/categories/<id>/[page/<n>/]`, `/blog/<slug>/`, `/authors/<id>/`, `/tags/<tag>/`, 404.          |
| `src/components/`             | React components (rendered to static HTML; only the nav menu, post list and post table of contents/share bar are hydrated). |

A post URL is `/blog/<permalink in kebab-case>/` (lodash `kebabCase`, e.g. `/my-Post/` → `/blog/my-post/`). The build fails if two posts map to the same URL.

## Local development

Requires Node 24 (see `.nvmrc`).

```sh
npm install
cp env.development.example .env.development   # optional, see below
npm run dev       # http://localhost:4321
npm run build     # static site in dist/ (+ checks no file exceeds Cloudflare's 25 MiB limit)
npm run preview   # serve dist/
```

### Environment variables

| Variable                | Purpose                                                                                |
| ----------------------- | -------------------------------------------------------------------------------------- |
| `PUBLIC_GTM_ID`         | Google Tag Manager container id. GTM is only included when set.                        |
| `PUBLIC_FORM_URL`       | URL of the "Let's talk" form (iframe).                                                 |
| `PUBLIC_MEDIA_BASE_URL` | Base URL for `<VideoPlayer name="…" />` files (e.g. an R2 bucket). Empty → `/images/`. |

They are read at build time, so set them in the Cloudflare build settings too.

## CMS

The CMS is at https://blog.xmartlabs.com/admin/ (`static/admin/`). It commits to `main` through GitHub; sign-in goes through the Sveltia CMS Additions worker configured as `backend.base_url` in `static/admin/config.yml`.

- **Posts**: "Blog" creates `.md` posts, "Blog (MDX, advanced)" creates `.mdx` posts.
- **Authors / Categories**: add or edit them from the "Authors" and "Categories" collections; they appear in the post form right away. New categories also get a filter tab and `/categories/<id>/` pages.
- **Testing locally**: run `npm run dev`, open http://localhost:4321/admin/ and choose "Work with Local Repository" (Chromium-based browsers). Changes are written straight to your checkout; no auth server is needed.

## Deploy

Cloudflare Workers Builds is connected to the GitHub repo (worker config in `wrangler.jsonc`):

- Build command `npm run build`, deploy command `npx wrangler deploy`.
- Pushes to `main` deploy production; other branches get preview URLs (non-production branch builds/preview URLs enabled in the worker settings).
- `static/_headers` sets the security and cache headers.
- Manual deploy: `npm run deploy` (needs `wrangler login`).

Files over 25 MiB can't be deployed as static assets; `npm run build` fails on them (unless they are listed in `static/.assetsignore`, which keeps them out of deploys; see `MIGRATION-TODO.md`).

## Components in MDX posts

`<VideoPlayer>`, `<Image>` and `<Table>` are available in every `.mdx` post without importing them. To add another one, create it in `src/components/` and add it to the `components` map passed to `<Content />` in `src/pages/blog/[slug].astro`.

## Available Components

### Image Component

The Image component is a flexible React component that can display either a single image or multiple images in a row. It supports various styling options and maintains consistent aspect ratios.

#### Props

| Prop          | Type                 | Default       | Required | Description                                                     |
| ------------- | -------------------- | ------------- | -------- | --------------------------------------------------------------- |
| `src`         | `string \| string[]` | -             | Yes      | Image URL for single image or array of URLs for multiple images |
| `alt`         | `string`             | `"Xmartlabs"` | No       | Alt text for accessibility                                      |
| `width`       | `string`             | `"100%"`      | No       | Width of the image(s)                                           |
| `height`      | `string`             | `"315px"`     | No       | Height of the image(s)                                          |
| `aspectRatio` | `string`             | `"16/9"`      | No       | CSS aspect ratio property                                       |

#### Usage Examples

**Single Image:**

```mdx
<Image
  src="https://example.com/image.jpg"
  alt="Example image"
  width="80%"
  height="400px"
/>
```

**Multiple Images:**

```mdx
<Image
  src={[
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
  ]}
  alt="Gallery images"
  height="250px"
/>
```

**Custom Aspect Ratio:**

```mdx
<Image
  src="https://example.com/square-image.jpg"
  alt="Square image"
  aspectRatio="1/1"
  width="300px"
/>
```

#### Features

- **Single or Multiple Images**: Pass a string for one image or an array for multiple images
- **Even Distribution**: Multiple images are automatically distributed evenly across the container width
- **Responsive Design**: Supports percentage-based widths for responsive layouts
- **Aspect Ratio Control**: Maintains consistent aspect ratios using CSS
- **Object Fit Cover**: Images maintain their aspect ratio and cover the container
- **Flexible Layout**: Multiple images wrap to new rows on smaller screens
- **Accessibility**: Proper alt text support with automatic numbering for multiple images

### VideoPlayer Component

The VideoPlayer component allows you to embed YouTube videos in your blog posts or use videos stored in the CMS. The CMS editor also offers it under "Insert" in MDX posts.

The supported formats are: `MP4, WebM, and OGG`

#### Props

| Prop     | Type     | Default       | Required                     | Description                       |
| -------- | -------- | ------------- | ---------------------------- | --------------------------------- |
| `id`     | `string` | -             | Yes                          | YouTube video ID                  |
| `name`   | `string` | -             | Yes (Only if ID not present) | Name of the file (with extension) |
| `width`  | `string` | `"100%"`      | No                           | Width of the video player         |
| `height` | `string` | `"560px"`     | No                           | Height of the video player        |
| `title`  | `string` | `"Xmartlabs"` | No                           | Title for the iframe              |

#### Usage Example

For Youtube:

```mdx
<VideoPlayer id="dsCiJIhfM5E" width="100%" height="400px" />
```

For CMS Video:

```mdx
<VideoPlayer name="screen recording.mp4" width="100%" height="400px" />
```

### Documenting the new Component

It's very important to document **how** we can use the components for non-developers that create blogs, this can be documented in the Blog's Notion page, the [Snippet Section](https://www.notion.so/xmartlabs/Blog-Snippets-238fbac623cd80fbb43ffabb3ff38ef2).

```

```
