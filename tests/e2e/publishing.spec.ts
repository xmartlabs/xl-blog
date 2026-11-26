import { type APIRequestContext, expect, test } from '@playwright/test';

import {
  apiAs,
  createDraft,
  deletePost,
  setStatus,
  uniquePost,
} from './lib/api';
import { SEED } from './lib/env';

/**
 * Draft → publish → unpublish through the REST API as an editor, checking the public pages
 * after each step. Publishing revalidates the statically generated pages on demand
 * (src/lib/revalidate.ts); pages are regenerated on their next request.
 */

const category = SEED.categories[1].slug;
let editor: APIRequestContext;
let anonymous: APIRequestContext;
let postId: number | undefined;

test.beforeAll(async () => {
  editor = await apiAs('editor');
  anonymous = await apiAs('anonymous');
});

test.afterAll(async () => {
  if (postId) await deletePost(postId);
  await editor.dispose();
  await anonymous.dispose();
});

const pageText = async (path: string) => {
  const response = await anonymous.get(path);
  return { status: response.status(), html: await response.text() };
};

/** Polls a public page until it matches (regeneration happens on the next request). */
const expectPage = (
  path: string,
  check: (page: { status: number; html: string }) => boolean,
  message: string
) =>
  expect
    .poll(async () => check(await pageText(path)), {
      message: `${path}: ${message}`,
      timeout: 20_000,
    })
    .toBe(true);

test('an editor publishes and unpublishes a post', async () => {
  const post = uniquePost('publish');
  const postPath = `/blog/${post.slug}/`;

  // 1. Draft: not public.
  const draft = await createDraft(editor, post, category);
  postId = draft.id;
  expect(draft._status).toBe('draft');

  const missing = await pageText(postPath);
  expect(missing.status).toBe(404);
  expect(missing.html).not.toContain(post.title);
  // The styled 404 is in the server-rendered HTML (not only rendered by the client).
  expect(missing.html).toContain('land of lost URLs');
  expect(missing.html).not.toContain('__next_error__');
  const home = await pageText('/');
  expect(home.status).toBe(200);
  expect(home.html).not.toContain(post.title);

  // 2. Publish: the post page, the home page and its category page show it.
  const { doc: published } = await setStatus(editor, draft.id, 'published');
  expect(published._status).toBe('published');
  await expectPage(
    postPath,
    (p) => p.status === 200 && p.html.includes(post.title),
    'shows the published post'
  );
  await expectPage(
    '/',
    (p) => p.status === 200 && p.html.includes(post.title),
    'lists the published post'
  );
  await expectPage(
    `/categories/${category}/`,
    (p) => p.status === 200 && p.html.includes(post.title),
    'lists the published post'
  );

  // 3. Unpublish: gone again.
  const { doc: unpublished } = await setStatus(editor, draft.id, 'draft');
  expect(unpublished._status).toBe('draft');
  await expectPage(
    postPath,
    (p) => p.status === 404 && !p.html.includes(post.title),
    'is a 404 again'
  );
  await expectPage(
    '/',
    (p) => p.status === 200 && !p.html.includes(post.title),
    'no longer lists the post'
  );
});

test('unknown URLs return the server-rendered styled 404', async () => {
  for (const path of [
    '/blog/does-not-exist/',
    '/categories/does-not-exist/',
    '/categories/does-not-exist/page/2/',
    '/tags/does-not-exist/',
    '/authors/does-not-exist/',
    '/page/999/',
    '/no/such/route/',
  ]) {
    const { status, html } = await pageText(path);
    expect(status, path).toBe(404);
    expect(html, path).toContain('land of lost URLs');
    expect(html, path).not.toContain('__next_error__');
  }
  // And the seeded content still renders.
  for (const post of SEED.posts) {
    const { status, html } = await pageText(`/blog/${post.slug}/`);
    expect(status, post.slug).toBe(200);
    expect(html).toContain(post.title);
  }
});

test('the 404 page works in the browser', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const response = await page.goto('/blog/does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole('heading', { name: /land of lost URLs/ })
  ).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  expect(errors).toEqual([]);
});
