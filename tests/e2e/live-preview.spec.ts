import { type APIRequestContext, expect, test } from '@playwright/test';

import { apiAs, createDraft, deletePost, uniquePost } from './lib/api';
import { EDITOR_STATE } from './lib/env';

/**
 * The admin panel's Preview button and Live Preview: an editor edits a draft's title and the
 * preview iframe (/next/preview/ → the post page in draft mode, LivePreviewPost) follows.
 */

test.use({ storageState: EDITOR_STATE });

let editor: APIRequestContext;
let postId: number | undefined;
const post = uniquePost('live-preview');

test.beforeAll(async () => {
  editor = await apiAs('editor');
  postId = (await createDraft(editor, post)).id;
});

test.afterAll(async () => {
  if (postId) await deletePost(postId);
  await editor.dispose();
});

test('the Preview button opens the draft through /next/preview/', async ({
  page,
}) => {
  await page.goto(`/admin/collections/posts/${postId}/`);
  const button = page.locator('#preview-button');
  await expect(button).toBeVisible({ timeout: 30_000 });
  const href = await button.getAttribute('href');
  expect(href).toBeTruthy();
  const url = new URL(href!, page.url());
  expect(url.pathname).toBe('/next/preview/');
  expect(url.searchParams.get('path')).toBe(`/blog/${post.slug}/`);

  // Following it (same session) shows the draft.
  await page.goto(url.toString());
  await expect(page).toHaveURL(new RegExp(`/blog/${post.slug}/$`));
  await expect(page.getByText(post.title).first()).toBeVisible();
});

test('Live Preview updates while the title is edited', async ({ page }) => {
  await page.goto(`/admin/collections/posts/${postId}/`);
  const title = page.locator('#field-title');
  await expect(title).toHaveValue(post.title, { timeout: 30_000 });

  await page.locator('#live-preview-toggler').click();
  const iframe = page.locator('#live-preview-iframe');
  await expect(iframe).toBeVisible();
  const src = await iframe.getAttribute('src');
  expect(src).toContain('/next/preview/');
  const preview = page.frameLocator('#live-preview-iframe');
  await expect(preview.getByText(post.title).first()).toBeVisible({
    timeout: 30_000,
  });

  const newTitle = `${post.title} edited live`;
  await title.fill(newTitle);
  await expect(
    preview.getByText(newTitle, { exact: true }).first()
  ).toBeVisible({
    timeout: 20_000,
  });
});
