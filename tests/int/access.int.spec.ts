/**
 * Access control against the real Payload config and a real (test) database.
 *
 * Data is set up with the Local API's default `overrideAccess: true`; every assertion runs the
 * operation as a specific caller with `overrideAccess: false` and an explicit `user` (null for
 * an anonymous visitor), which is what the REST API and the admin panel do.
 */
import config from '@payload-config';
import { getPayload, type Payload } from 'payload';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import type { Author, Category, Post, User } from '@/payload-types';

const ctx = { disableRevalidate: true };
const run = Date.now().toString(36);

let payload: Payload;
let category: Category;
let author: Author;
let otherAuthor: Author;
let admin: User;
let editor: User;
let otherEditor: User;
let published: Post;
let draft: Post;

/** The user as Payload's auth strategies hand it to access functions. */
const as = (user: User | null) => ({
  overrideAccess: false as const,
  user: user ? { ...user, collection: 'users' as const } : null,
  context: ctx,
});
const anonymous = () => as(null);

const lexical = (text: string) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: [
      {
        type: 'paragraph',
        format: '' as const,
        indent: 0,
        version: 1,
        direction: 'ltr' as const,
        textFormat: 0,
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

const postData = (slug: string, author: number) => ({
  title: `Integration test post ${slug}`,
  slug,
  category: category.id,
  author,
  tags: ['testing'],
  publishedDate: new Date().toISOString(),
  content: lexical('Hello'),
});

const createUser = async (email: string, roles: User['roles']) =>
  (await payload.create({
    collection: 'users',
    data: { email, roles, password: `pw-${run}-${email}` },
    context: ctx,
  })) as User;

beforeAll(async () => {
  payload = await getPayload({ config });
  category = await payload.create({
    collection: 'categories',
    data: { name: 'Testing', slug: `testing-${run}`, order: 1 },
    context: ctx,
  });
  author = await payload.create({
    collection: 'authors',
    data: { name: 'Jane Tester', slug: `jane-${run}` },
    context: ctx,
  });
  otherAuthor = await payload.create({
    collection: 'authors',
    data: { name: 'John Tester', slug: `john-${run}` },
    context: ctx,
  });
  admin = await createUser(`admin-${run}@xmartlabs.com`, ['admin']);
  editor = await createUser(`editor-${run}@xmartlabs.com`, ['editor']);
  otherEditor = await createUser(`other-${run}@xmartlabs.com`, ['editor']);
  published = await payload.create({
    collection: 'posts',
    data: { ...postData(`published-${run}`, author.id), _status: 'published' },
    context: ctx,
  });
  draft = await payload.create({
    collection: 'posts',
    data: { ...postData(`draft-${run}`, author.id), _status: 'draft' },
    draft: true,
    context: ctx,
  });
});

afterAll(async () => {
  await payload?.destroy();
});

describe('anonymous visitors', () => {
  it('see published posts but not drafts', async () => {
    const { docs } = await payload.find({
      collection: 'posts',
      where: { slug: { in: [published.slug, draft.slug] } },
      ...anonymous(),
    });
    expect(docs.map((d) => d.slug)).toEqual([published.slug]);
  });

  it('cannot open a draft by id, even asking for the draft version', async () => {
    await expect(
      payload.findByID({ collection: 'posts', id: draft.id, ...anonymous() })
    ).rejects.toThrow();
    await expect(
      payload.findByID({
        collection: 'posts',
        id: draft.id,
        draft: true,
        ...anonymous(),
      })
    ).rejects.toThrow();
  });

  it('cannot read post versions', async () => {
    await expect(
      payload.findVersions({ collection: 'posts', ...anonymous() })
    ).rejects.toThrow(/not allowed/i);
  });

  it('cannot read users', async () => {
    await expect(
      payload.find({ collection: 'users', ...anonymous() })
    ).rejects.toThrow(/not allowed/i);
    await expect(
      payload.findByID({ collection: 'users', id: admin.id, ...anonymous() })
    ).rejects.toThrow(/not allowed/i);
  });

  it('can read categories and authors, but not create posts or authors', async () => {
    const { totalDocs } = await payload.count({
      collection: 'categories',
      ...anonymous(),
    });
    expect(totalDocs).toBeGreaterThan(0);
    await expect(
      payload.create({
        collection: 'posts',
        data: postData(`anon-${run}`, author.id),
        ...anonymous(),
      })
    ).rejects.toThrow(/not allowed/i);
    await expect(
      payload.create({
        collection: 'authors',
        data: { name: 'Anon', slug: `anon-${run}` },
        ...anonymous(),
      })
    ).rejects.toThrow(/not allowed/i);
  });
});

describe('editors', () => {
  it('can create, update and publish posts, and see drafts', async () => {
    const created = await payload.create({
      collection: 'posts',
      data: postData(`editor-${run}`, author.id),
      draft: true,
      ...as(editor),
    });
    const updated = await payload.update({
      collection: 'posts',
      id: created.id,
      data: { subtitle: 'Edited', _status: 'published' },
      ...as(editor),
    });
    expect(updated).toMatchObject({ subtitle: 'Edited', _status: 'published' });

    const seen = await payload.findByID({
      collection: 'posts',
      id: draft.id,
      draft: true,
      ...as(editor),
    });
    expect(seen.slug).toBe(draft.slug);
  });

  it('cannot delete posts or authors, or manage categories', async () => {
    await expect(
      payload.delete({ collection: 'posts', id: published.id, ...as(editor) })
    ).rejects.toThrow(/not allowed/i);
    await expect(
      payload.delete({ collection: 'authors', id: author.id, ...as(editor) })
    ).rejects.toThrow(/not allowed/i);
    await expect(
      payload.create({
        collection: 'categories',
        data: { name: 'Nope', slug: `nope-${run}`, order: 9 },
        ...as(editor),
      })
    ).rejects.toThrow(/not allowed/i);
    await expect(
      payload.update({
        collection: 'categories',
        id: category.id,
        data: { name: 'Renamed' },
        ...as(editor),
      })
    ).rejects.toThrow(/not allowed/i);
  });

  it('can edit their own name', async () => {
    const updated = await payload.update({
      collection: 'users',
      id: editor.id,
      data: { name: 'Ed Itor' },
      ...as(editor),
    });
    expect(updated.name).toBe('Ed Itor');
  });

  it('cannot promote themselves (roles are ignored)', async () => {
    const updated = await payload.update({
      collection: 'users',
      id: editor.id,
      data: { roles: ['admin'] },
      ...as(editor),
    });
    expect(updated.roles).toEqual(['editor']);
    const stored = await payload.findByID({
      collection: 'users',
      id: editor.id,
    });
    expect(stored.roles).toEqual(['editor']);
  });

  it('cannot link themselves to an author (the link is ignored)', async () => {
    await payload.update({
      collection: 'users',
      id: editor.id,
      data: { author: otherAuthor.id },
      ...as(editor),
    });
    const stored = await payload.findByID({
      collection: 'users',
      id: editor.id,
      depth: 0,
    });
    expect(stored.author ?? null).toBeNull();
  });

  it('cannot change their email or set a password', async () => {
    await expect(
      payload.update({
        collection: 'users',
        id: editor.id,
        data: { email: `takeover-${run}@xmartlabs.com` },
        ...as(editor),
      })
    ).rejects.toThrow(/not allowed/i);
    await expect(
      payload.update({
        collection: 'users',
        id: editor.id,
        data: { password: 'a-new-password' },
        ...as(editor),
      })
    ).rejects.toThrow(/not allowed/i);
    const stored = await payload.findByID({
      collection: 'users',
      id: editor.id,
    });
    expect(stored.email).toBe(editor.email);
  });

  it('cannot change other users', async () => {
    await expect(
      payload.update({
        collection: 'users',
        id: otherEditor.id,
        data: { name: 'Hijacked' },
        ...as(editor),
      })
    ).rejects.toThrow();
    const stored = await payload.findByID({
      collection: 'users',
      id: otherEditor.id,
    });
    expect(stored.name ?? null).toBeNull();
  });

  it('cannot create or delete users', async () => {
    await expect(
      payload.create({
        collection: 'users',
        data: {
          email: `new-${run}@xmartlabs.com`,
          password: 'whatever-123',
          roles: ['editor'],
        },
        ...as(editor),
      })
    ).rejects.toThrow(/not allowed/i);
    await expect(
      payload.delete({ collection: 'users', id: otherEditor.id, ...as(editor) })
    ).rejects.toThrow(/not allowed/i);
  });

  it('see other users (for document locks) without their secrets', async () => {
    // Gives the other user a session (and a hash/salt to leak).
    await payload.login({
      collection: 'users',
      data: {
        email: otherEditor.email,
        password: `pw-${run}-${otherEditor.email}`,
      },
    });
    const own = await payload.findByID({
      collection: 'users',
      id: otherEditor.id,
      ...as(otherEditor),
    });
    expect(own.sessions?.length).toBeGreaterThan(0);

    const other = (await payload.findByID({
      collection: 'users',
      id: otherEditor.id,
      ...as(editor),
    })) as unknown as Record<string, unknown>;
    expect(other.email).toBe(otherEditor.email);
    for (const secret of [
      'hash',
      'salt',
      'password',
      'resetPasswordToken',
      'loginAttempts',
      'lockUntil',
    ]) {
      expect(other[secret]).toBeUndefined();
    }
    expect(other.sessions ?? []).toEqual([]);
  });
});

describe('admins', () => {
  it('can promote and demote users and link authors', async () => {
    const promoted = await payload.update({
      collection: 'users',
      id: otherEditor.id,
      data: { roles: ['admin', 'editor'], author: otherAuthor.id },
      depth: 0,
      ...as(admin),
    });
    expect(promoted.roles).toEqual(['admin', 'editor']);
    expect(promoted.author).toBe(otherAuthor.id);

    const demoted = await payload.update({
      collection: 'users',
      id: otherEditor.id,
      data: { roles: ['editor'] },
      ...as(admin),
    });
    expect(demoted.roles).toEqual(['editor']);
  });

  it('can create and delete users, and delete posts', async () => {
    const user = await payload.create({
      collection: 'users',
      data: {
        email: `temp-${run}@xmartlabs.com`,
        password: 'temp-password-1',
        roles: ['editor'],
      },
      ...as(admin),
    });
    await payload.delete({ collection: 'users', id: user.id, ...as(admin) });

    const post = await payload.create({
      collection: 'posts',
      data: postData(`admin-${run}`, author.id),
      draft: true,
      ...as(admin),
    });
    await payload.delete({ collection: 'posts', id: post.id, ...as(admin) });
  });
});

describe('password login', () => {
  it('locks an account after 5 wrong passwords', async () => {
    const email = `lock-${run}@xmartlabs.com`;
    const password = 'right-password-1';
    await payload.create({
      collection: 'users',
      data: { email, password, roles: ['editor'] },
      context: ctx,
    });
    for (let i = 0; i < 5; i++) {
      await expect(
        payload.login({
          collection: 'users',
          data: { email, password: 'wrong-password' },
        })
      ).rejects.toThrow();
    }
    await expect(
      payload.login({ collection: 'users', data: { email, password } })
    ).rejects.toThrow(/locked/i);
  });
});
