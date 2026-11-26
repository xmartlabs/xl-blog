import {
  type APIRequestContext,
  type APIResponse,
  expect,
  request,
} from '@playwright/test';

import { ADMIN_STATE, BASE_URL, EDITOR_STATE, SEED } from './env';

export type Role = 'editor' | 'admin' | 'anonymous';

/** A REST client with the saved session of `role` (or none). Dispose it after use. */
export const apiAs = (role: Role, options: { maxRedirects?: number } = {}) =>
  request.newContext({
    baseURL: BASE_URL,
    storageState:
      role === 'editor'
        ? EDITOR_STATE
        : role === 'admin'
          ? ADMIN_STATE
          : undefined,
    ...options,
  });

export async function json<T = Record<string, unknown>>(
  response: APIResponse
): Promise<T> {
  expect(
    response.ok(),
    `${response.url()} → ${response.status()}: ${await response.text()}`
  ).toBe(true);
  return (await response.json()) as T;
}

type Doc = { id: number; [key: string]: unknown };

export async function findBySlug(
  api: APIRequestContext,
  collection: 'categories' | 'authors',
  slug: string
): Promise<Doc> {
  const { docs } = await json<{ docs: Doc[] }>(
    await api.get(`/api/${collection}/`, {
      params: { 'where[slug][equals]': slug, depth: 0, limit: 1 },
    })
  );
  expect(docs, `${collection} ${slug}`).toHaveLength(1);
  return docs[0];
}

/** Lexical JSON with one paragraph. */
export const paragraph = (text: string) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: [
      {
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        textFormat: 0,
        textStyle: '',
        children: [
          {
            type: 'text',
            text,
            format: 0,
            style: '',
            mode: 'normal',
            detail: 0,
            version: 1,
          },
        ],
      },
    ],
  },
});

/**
 * A unique slug/title pair for a test post. Letters only: the slug field is kebab-cased
 * (lodash splits letters from digits, e.g. "e2e" → "e-2-e").
 */
export const uniquePost = (label: string) => {
  const id = Array.from({ length: 10 }, () =>
    String.fromCharCode(97 + Math.floor(Math.random() * 26))
  ).join('');
  return {
    slug: `test-${label}-${id}`,
    title: `E2E ${label} post ${id}`,
  };
};

/** Creates a draft post as `api`'s user (REST, like the admin panel's autosave). */
export async function createDraft(
  api: APIRequestContext,
  post: { slug: string; title: string },
  categorySlug: string = SEED.categories[1].slug
): Promise<Doc> {
  const category = await findBySlug(api, 'categories', categorySlug);
  const author = await findBySlug(api, 'authors', SEED.author.slug);
  const { doc } = await json<{ doc: Doc & { slug: string } }>(
    await api.post('/api/posts/?draft=true', {
      data: {
        ...post,
        category: category.id,
        author: author.id,
        tags: ['e2e'],
        content: paragraph(`Body of ${post.title}.`),
        _status: 'draft',
      },
    })
  );
  expect(doc.slug).toBe(post.slug);
  return doc;
}

export async function setStatus(
  api: APIRequestContext,
  id: number,
  status: 'published' | 'draft'
) {
  return json<{ doc: Doc }>(
    await api.patch(`/api/posts/${id}/`, { data: { _status: status } })
  );
}

/** Deletes a post as the admin (editors can't delete). */
export async function deletePost(id: number) {
  const admin = await apiAs('admin');
  try {
    const response = await admin.delete(`/api/posts/${id}/`);
    expect([200, 404]).toContain(response.status());
  } finally {
    await admin.dispose();
  }
}
