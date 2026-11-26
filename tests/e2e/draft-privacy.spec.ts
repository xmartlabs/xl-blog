import { type APIRequestContext, expect, test } from '@playwright/test';

import {
  apiAs,
  createDraft,
  deletePost,
  json,
  setStatus,
  uniquePost,
} from './lib/api';
import { BASE_URL } from './lib/env';

/**
 * Drafts are only visible to signed-in users: /next/preview/ (draft mode) requires a session,
 * the post page checks the session again, and the REST API never returns drafts to anonymous
 * visitors.
 */

let editor: APIRequestContext;
let anonymous: APIRequestContext;
const created: number[] = [];

// A post that only exists as a draft.
const draftOnly = uniquePost('draft-only');
// A published post with newer, unpublished changes.
const edited = uniquePost('edited');
const editedDraftTitle = `${edited.title} (unpublished edit)`;

const previewUrl = (slug: string) =>
  `/next/preview/?path=${encodeURIComponent(`/blog/${slug}/`)}`;

test.beforeAll(async () => {
  editor = await apiAs('editor');
  anonymous = await apiAs('anonymous');

  created.push((await createDraft(editor, draftOnly)).id);

  const doc = await createDraft(editor, edited);
  created.push(doc.id);
  await setStatus(editor, doc.id, 'published');
  await json(
    await editor.patch(`/api/posts/${doc.id}/?draft=true`, {
      data: { title: editedDraftTitle },
    })
  );
});

test.afterAll(async () => {
  for (const id of created) await deletePost(id);
  await editor.dispose();
  await anonymous.dispose();
});

test('the preview route refuses visitors without a session', async () => {
  const response = await anonymous.get(previewUrl(draftOnly.slug), {
    maxRedirects: 0,
  });
  expect(response.status()).toBe(403);
  const cookies = response
    .headersArray()
    .filter((h) => h.name.toLowerCase() === 'set-cookie')
    .map((h) => h.value);
  // No draft-mode cookie is handed out (only, at most, one that clears it).
  for (const cookie of cookies) {
    if (cookie.startsWith('__prerender_bypass=')) {
      expect(cookie).toMatch(
        /__prerender_bypass=;|Max-Age=0|Expires=Thu, 01 Jan 1970/i
      );
    }
  }
  expect((await anonymous.get(`/blog/${draftOnly.slug}/`)).status()).toBe(404);
});

test('the preview route rejects open redirects', async () => {
  const response = await editor.get(
    `/next/preview/?path=${encodeURIComponent('//evil.com/')}`,
    { maxRedirects: 0 }
  );
  expect(response.status()).toBe(400);
});

test('an editor previews a draft and unpublished changes', async () => {
  const response = await editor.get(previewUrl(draftOnly.slug), {
    maxRedirects: 0,
  });
  expect(response.status()).toBe(307);
  expect(response.headers().location).toBe(`/blog/${draftOnly.slug}/`);

  // The editor's context now holds the draft-mode cookie and the session.
  const draftPage = await editor.get(`/blog/${draftOnly.slug}/`);
  expect(draftPage.status()).toBe(200);
  expect(await draftPage.text()).toContain(draftOnly.title);

  const editedPage = await editor.get(`/blog/${edited.slug}/`);
  expect(editedPage.status()).toBe(200);
  expect(await editedPage.text()).toContain(editedDraftTitle);
});

test('a draft-mode cookie without a session shows only published content', async () => {
  // Take the editor's draft-mode cookie, but not its session.
  await editor.get(previewUrl(edited.slug), { maxRedirects: 0 });
  const { cookies } = await editor.storageState();
  const bypass = cookies.find((c) => c.name === '__prerender_bypass');
  expect(bypass, 'draft-mode cookie').toBeTruthy();

  const stale = await apiAs('anonymous');
  try {
    const headers = { Cookie: `__prerender_bypass=${bypass!.value}` };
    const editedPage = await stale.get(`/blog/${edited.slug}/`, { headers });
    expect(editedPage.status()).toBe(200);
    const html = await editedPage.text();
    expect(html).toContain(edited.title);
    expect(html).not.toContain(editedDraftTitle);

    const draftPage = await stale.get(`/blog/${draftOnly.slug}/`, { headers });
    expect(draftPage.status()).toBe(404);
    expect(await draftPage.text()).not.toContain(draftOnly.title);
  } finally {
    await stale.dispose();
  }
});

test('the REST API does not leak drafts to anonymous visitors', async () => {
  for (const params of <Record<string, string>[]>[
    { draft: 'true' },
    { draft: 'true', 'where[_status][equals]': 'draft' },
    { draft: 'true', 'where[slug][equals]': draftOnly.slug },
  ]) {
    const { docs } = await json<{ docs: { slug: string; title: string }[] }>(
      await anonymous.get('/api/posts/', {
        params: { ...params, limit: 100, depth: 0 },
      })
    );
    expect(docs.map((d) => d.slug)).not.toContain(draftOnly.slug);
    for (const doc of docs) expect(doc.title).not.toBe(editedDraftTitle);
  }

  // The published post itself is public: without `draft` its published version, with
  // `draft=true` (latest version is a draft, which anonymous visitors can't read) nothing.
  const published = await json<{ docs: { title: string }[] }>(
    await anonymous.get('/api/posts/', {
      params: { 'where[slug][equals]': edited.slug, depth: 0 },
    })
  );
  expect(published.docs.map((d) => d.title)).toEqual([edited.title]);
  const latest = await json<{ docs: { title: string }[] }>(
    await anonymous.get('/api/posts/', {
      params: { draft: 'true', 'where[slug][equals]': edited.slug, depth: 0 },
    })
  );
  for (const doc of latest.docs) expect(doc.title).toBe(edited.title);

  const byId = await anonymous.get(`/api/posts/${created[0]}/?draft=true`);
  expect([403, 404]).toContain(byId.status());

  const versions = await anonymous.get('/api/posts/versions/');
  expect([401, 403]).toContain(versions.status());
});

test('the editor sees the draft in a browser session', async ({ browser }) => {
  const context = await browser.newContext({
    baseURL: BASE_URL,
    storageState: (await editor.storageState()) as never,
  });
  try {
    const page = await context.newPage();
    await page.goto(previewUrl(draftOnly.slug));
    await expect(page).toHaveURL(new RegExp(`/blog/${draftOnly.slug}/$`));
    await expect(page.getByText(draftOnly.title).first()).toBeVisible();
  } finally {
    await context.close();
  }
});
