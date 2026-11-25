import { getCollection, type CollectionEntry } from 'astro:content';
import kebabCase from 'lodash/kebabCase.js';

import { POSTS_PER_PAGE } from './site';

export type Post = CollectionEntry<'blog'>;
export type Category = CollectionEntry<'categories'>;

/** URL slug of a post: `/blog/<slug>/`. Same rule the Gatsby site used. */
export const postSlug = (post: Post) => kebabCase(post.data.permalink);

/** Plain, serializable card data (passed to React islands). */
export const toCardData = (post: Post) => ({
  id: post.id,
  title: post.data.title,
  slug: postSlug(post),
  thumbnail: post.data.thumbnail ?? null,
});

let postsCache: Post[] | undefined;

/** All posts, newest first. Fails the build if two posts map to the same URL. */
export const getPosts = async (): Promise<Post[]> => {
  if (postsCache) return postsCache;

  const posts = await getCollection('blog');
  const bySlug = new Map<string, Post>();
  for (const post of posts) {
    const slug = postSlug(post);
    const other = bySlug.get(slug);
    if (other) {
      throw new Error(
        `Duplicate post URL /blog/${slug}/: "${other.filePath}" and "${post.filePath}" have permalinks that map to the same slug.`
      );
    }
    bySlug.set(slug, post);
  }

  postsCache = posts.sort(
    (a, b) =>
      b.data.date.getTime() - a.data.date.getTime() || a.id.localeCompare(b.id)
  );
  return postsCache;
};

/** Categories sorted by their `order` field. */
export const getCategories = async (): Promise<Category[]> =>
  (await getCollection('categories')).sort(
    (a, b) => a.data.order - b.data.order
  );

/** Filter tabs shown above the post list. */
export const getCategoryTabs = async () => [
  { id: 'all', label: 'All', href: '/' },
  ...(await getCategories()).map((category) => ({
    id: category.id,
    // Keep multi-word names on one line, like the old tabs did.
    label: category.data.name.replace(/ /g, ' '),
    href: `/categories/${category.id}/`,
  })),
];

/** Splits `items` into pages of POSTS_PER_PAGE. */
export const paginate = <T>(items: T[]) =>
  Array.from(
    { length: Math.max(1, Math.ceil(items.length / POSTS_PER_PAGE)) },
    (_, i) => items.slice(i * POSTS_PER_PAGE, (i + 1) * POSTS_PER_PAGE)
  );

export const formatPostDate = (date: Date) =>
  date.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
