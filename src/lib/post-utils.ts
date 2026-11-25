/**
 * Pure helpers shared by server pages and the live-preview client component
 * (no Payload/database imports here).
 */
import kebabCase from 'lodash/kebabCase.js';

import type { Author, Media, Post } from '../payload-types';

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

export const toCardData = (
  post: Pick<Post, 'id' | 'title' | 'slug' | 'thumbnail' | 'thumbnailUrl'>
): CardData => ({
  id: post.id,
  title: post.title,
  slug: post.slug,
  thumbnail: postThumbnail(post),
});

export const asDoc = <T extends object>(
  value: number | T | null | undefined
): T | null => (value && typeof value === 'object' ? value : null);

export const formatPostDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

/** URL segment of an author page: `/authors/<kebab-case slug>/`, e.g. mtnBarreto → mtn-barreto. */
export const authorPathSegment = (authorSlug: string) => kebabCase(authorSlug);

/** URL segment of a tag page; tag variants such as "AI" and "ai" share one. */
export const tagPathSegment = (tag: string) => kebabCase(tag);
