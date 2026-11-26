import 'server-only';

import {
  getAuthorPages,
  getCategoryPages,
  getHomePages,
  getPublishedPosts,
  getTags,
} from './posts';
import { SITE } from './site';

/** Every public page, as site-relative paths (the admin panel and API are excluded). */
export async function getSitemapPaths(): Promise<string[]> {
  const [homePages, categoryPages, posts, authors, tags] = await Promise.all([
    getHomePages(),
    getCategoryPages(),
    getPublishedPosts(),
    getAuthorPages(),
    getTags(),
  ]);
  return [
    '/',
    ...homePages.slice(1).map((page) => `/page/${page.currentPage}/`),
    '/categories/',
    ...categoryPages.map((page) =>
      page.currentPage === 1
        ? `/categories/${page.category}/`
        : `/categories/${page.category}/page/${page.currentPage}/`
    ),
    ...posts.map((post) => `/blog/${post.slug}/`),
    ...authors.map((author) => `/authors/${author.segment}/`),
    '/tags/',
    ...tags.map((tag) => `/tags/${tag.segment}/`),
  ];
}

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const xmlResponse = (body: string) =>
  new Response(`<?xml version="1.0" encoding="UTF-8"?>${body}`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });

/** Same format and URLs as the old site: /sitemap-index.xml → /sitemap-0.xml. */
export const sitemapIndexResponse = () =>
  xmlResponse(
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${SITE.url}/sitemap-0.xml</loc></sitemap></sitemapindex>`
  );

export async function sitemapResponse() {
  const urls = (await getSitemapPaths())
    .map(
      (path) =>
        `<url><loc>${escapeXml(new URL(path, SITE.url).href)}</loc><changefreq>daily</changefreq><priority>0.7</priority></url>`
    )
    .join('');
  return xmlResponse(
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">${urls}</urlset>`
  );
}
