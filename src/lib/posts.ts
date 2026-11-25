import 'server-only';

import type { Author, Category, Media, Post } from '../payload-types';
import { getPayloadClient } from './payload';

/** Plain card data, as the Card component expects. */
export interface CardData {
  id: number;
  title: string;
  slug: string;
  thumbnail: string | null;
}

const mediaUrl = (value: number | Media | null | undefined) =>
  value && typeof value === 'object' ? (value.url ?? null) : null;

export const postThumbnail = (post: Pick<Post, 'thumbnail' | 'thumbnailUrl'>) =>
  mediaUrl(post.thumbnail) ?? post.thumbnailUrl ?? null;

export const authorImage = (author: Author) =>
  mediaUrl(author.image) ?? author.imageUrl ?? null;

export const toCardData = (post: Post): CardData => ({
  id: post.id,
  title: post.title,
  slug: post.slug,
  thumbnail: postThumbnail(post),
});

export const asDoc = <T extends object>(
  value: number | T | null | undefined
): T | null => (value && typeof value === 'object' ? value : null);

/** Published post by slug, with author, category and body uploads populated. */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    limit: 1,
    depth: 2,
    overrideAccess: false,
  });
  return docs[0] ?? null;
}

export async function getAllPostSlugs(): Promise<string[]> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    pagination: false,
    depth: 0,
    select: { slug: true },
    overrideAccess: false,
  });
  return docs.map((doc) => doc.slug);
}

/**
 * Up to 3 other posts of the same category. The old site used file order (oldest first);
 * publication date ascending is the closest equivalent.
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
      _status: { equals: 'published' },
    },
    sort: ['publishedDate', 'createdAt'],
    limit: 3,
    depth: 1,
    overrideAccess: false,
  });
  return docs.map(toCardData);
}

export const formatPostDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
