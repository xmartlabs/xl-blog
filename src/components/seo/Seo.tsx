import React from 'react';

import { SITE } from '../../lib/site';

interface SeoProps {
  /** Site-relative path of the page, e.g. `/blog/foo/`. */
  pathname: string;
  title?: string;
  description?: string;
  /** Site-relative image path, e.g. `/images/foo.png`, or an absolute URL. */
  image?: string | null;
}

/**
 * The same head tags the Gatsby/Astro site emitted. The combined `name` + `property` meta
 * tags can't be expressed with Next's metadata API, so they are rendered as elements: React 19
 * hoists `<title>`, `<meta>` and `<link>` into `<head>`. Render exactly one per page.
 */
export function Seo({ pathname, title, description, image }: SeoProps) {
  const seo = {
    title: title || SITE.title,
    description: description || SITE.description,
    url: new URL(pathname, SITE.url).href,
    image: new URL(image || '/images/og-thumbnail.png', SITE.url).href,
  };
  return (
    <>
      <meta name="title" property="og:title" content={seo.title} />
      <meta name="url" property="og:url" content={seo.url} />
      <meta
        name="description"
        property="og:description"
        content={seo.description}
      />
      <meta name="image" property="og:image" content={seo.image} />
      <meta name="twitter:card" content="summary_large_image" />
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={seo.url} />
    </>
  );
}
