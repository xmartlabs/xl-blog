import 'server-only';

import { cache } from 'react';

import type { Author, Category, Post } from '../payload-types';
import { getPayloadClient } from './payload';
import {
  asDoc,
  authorPathSegment,
  compareNodeOrder,
  tagPathSegment,
  toCardData,
  type CardData,
} from './post-utils';
import { POSTS_PER_PAGE } from './site';

export * from './post-utils';

const PUBLISHED = { _status: { equals: 'published' } } as const;

/**
 * Newest first. Same-day posts keep the old order (source file name, ascending); new posts
 * have no source file and fall back to creation time.
 */
const NEWEST_FIRST = ['-publishedDate', 'legacySourceFile', '-createdAt'];

/**
 * A post by slug, with author, category and uploads populated. Only published posts, unless
 * `draft` is set (draft mode for a signed-in user): then the latest draft is returned.
 */
export async function getPostBySlug(
  slug: string,
  { draft = false }: { draft?: boolean } = {}
): Promise<Post | null> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: 'posts',
    where: draft
      ? { slug: { equals: slug } }
      : { slug: { equals: slug }, ...PUBLISHED },
    limit: 1,
    depth: 2,
    draft,
    // Draft reads are only requested after checking the signed-in user (see the post page).
    overrideAccess: draft,
  });
  return docs[0] ?? null;
}

export async function getAllPostSlugs(): Promise<string[]> {
  return (await getPublishedPosts()).map((post) => post.slug);
}

/** Every published post (newest first), with category, author and thumbnail populated. */
export const getPublishedPosts = cache(async (): Promise<Post[]> => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: 'posts',
    where: PUBLISHED,
    sort: NEWEST_FIRST,
    pagination: false,
    depth: 1,
    overrideAccess: false,
  });
  return docs;
});

/** Categories sorted by their `order` field. */
export const getCategories = cache(async (): Promise<Category[]> => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: 'categories',
    sort: ['order', 'name'],
    pagination: false,
    depth: 0,
    overrideAccess: false,
  });
  return docs;
});

export interface CategoryTab {
  id: string;
  label: string;
  href: string;
}

/** Filter tabs shown above the post list. */
export const getCategoryTabs = async (): Promise<CategoryTab[]> => [
  { id: 'all', label: 'All', href: '/' },
  ...(await getCategories())
    .filter((category) => category.showInFilters !== false)
    .map((category) => ({
      id: category.slug,
      // Keep multi-word names on one line, like the old tabs did.
      label: category.name.replace(/ /g, ' '),
      href: `/categories/${category.slug}/`,
    })),
];

/** Splits `items` into pages of POSTS_PER_PAGE. */
export const paginate = <T>(items: T[]) =>
  Array.from(
    { length: Math.max(1, Math.ceil(items.length / POSTS_PER_PAGE)) },
    (_, i) => items.slice(i * POSTS_PER_PAGE, (i + 1) * POSTS_PER_PAGE)
  );

const categorySlugOf = (post: Post) => asDoc<Category>(post.category)?.slug;
const authorOf = (post: Post) => asDoc<Author>(post.author);

export interface ListPage {
  posts: CardData[];
  currentPage: number;
  numPages: number;
  category?: string;
}

/** Pages of the home list: `/` and `/page/<n>/`. */
export const getHomePages = async (): Promise<ListPage[]> => {
  const pages = paginate(await getPublishedPosts());
  return pages.map((posts, i) => ({
    posts: posts.map(toCardData),
    currentPage: i + 1,
    numPages: pages.length,
  }));
};

/** One entry per page of every category that has posts. */
export const getCategoryPages = async (): Promise<ListPage[]> => {
  const posts = await getPublishedPosts();
  const categories = await getCategories();
  return categories.flatMap((category) => {
    const categoryPosts = posts.filter(
      (post) => categorySlugOf(post) === category.slug
    );
    if (categoryPosts.length === 0) return [];
    const pages = paginate(categoryPosts);
    return pages.map((pagePosts, i) => ({
      category: category.slug,
      currentPage: i + 1,
      numPages: pages.length,
      posts: pagePosts.map(toCardData),
    }));
  });
};

export interface LinkList {
  /** URL segment (`/authors/<segment>/`, `/tags/<segment>/`). */
  segment: string;
  /** Author slug (e.g. `mtnBarreto`) or the tag as first written. */
  name: string;
  posts: { title: string; slug: string }[];
}

/** Authors with at least one published post, keyed by URL segment. */
export const getAuthorPages = async (): Promise<LinkList[]> => {
  const groups = new Map<string, LinkList>();
  for (const post of await getPublishedPosts()) {
    const author = authorOf(post);
    if (!author) continue;
    const segment = authorPathSegment(author.slug);
    let group = groups.get(segment);
    if (!group) {
      group = { segment, name: author.slug, posts: [] };
      groups.set(segment, group);
    }
    group.posts.push({ title: post.title, slug: post.slug });
  }
  return [...groups.values()];
};

/**
 * Tags grouped by URL segment, so variants such as "AI" and "ai" share one page.
 * Tags whose segment is empty are skipped.
 */
export const getTags = async (): Promise<LinkList[]> => {
  const groups = new Map<string, LinkList>();
  for (const post of await getPublishedPosts()) {
    for (const tag of new Set(post.tags ?? [])) {
      const segment = tagPathSegment(tag);
      if (!segment) continue;
      let group = groups.get(segment);
      if (!group) {
        group = { segment, name: tag, posts: [] };
        groups.set(segment, group);
      }
      if (!group.posts.some((p) => p.slug === post.slug)) {
        group.posts.push({ title: post.title, slug: post.slug });
      }
    }
  }
  return [...groups.values()].sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Up to 3 other published posts of the same category, in the old site's order (Gatsby's
 * `relatedPosts` resolver returned them in node order; see `compareNodeOrder`).
 */
export async function getRelatedPosts(post: Post): Promise<CardData[]> {
  const category = asDoc<Category>(post.category);
  if (!category) return [];
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: 'posts',
    where: {
      category: { equals: category.id },
      id: { not_equals: post.id },
      ...PUBLISHED,
    },
    pagination: false,
    depth: 1,
    overrideAccess: false,
  });
  return docs.sort(compareNodeOrder).slice(0, 3).map(toCardData);
}
