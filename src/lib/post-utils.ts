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

/** Generated sizes of uploaded images (Media `upload.imageSizes`). */
export type MediaSize = 'card' | 'hero';

/**
 * URL of an uploaded file: the given generated size when it exists, else the original. Sizes
 * are missing for videos, uploads made before the sizes existed, and images smaller than the
 * size.
 */
export const mediaUrl = (
  value: number | Media | null | undefined,
  size?: MediaSize
) => {
  if (!value || typeof value !== 'object') return null;
  return (size && value.sizes?.[size]?.url) || value.url || null;
};

/**
 * Post image: the uploaded thumbnail (in `size` when given: `card` for cards, `hero` for the
 * post page), else the legacy Thumbnail URL, unchanged.
 */
export const postThumbnail = (
  post: Pick<Post, 'thumbnail' | 'thumbnailUrl'>,
  size?: MediaSize
) => mediaUrl(post.thumbnail, size) ?? post.thumbnailUrl ?? null;

/** Shown for authors created without a photo (the "Xmartlabs Team" avatar). */
export const DEFAULT_AUTHOR_IMAGE = '/images/members/xl.png';

/** The author's photo: an upload, the legacy URL, or the default avatar. */
export const authorImage = (author: Author | null | undefined) =>
  (author && (mediaUrl(author.image) ?? author.imageUrl)) ||
  DEFAULT_AUTHOR_IMAGE;

export const toCardData = (
  post: Pick<Post, 'id' | 'title' | 'slug' | 'thumbnail' | 'thumbnailUrl'>
): CardData => ({
  id: post.id,
  title: post.title,
  slug: post.slug,
  thumbnail: postThumbnail(post, 'card'),
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

/**
 * Legacy posts whose Gatsby node was re-created (edited on a cached build) after the old
 * site's last clean build, so they come after the other legacy posts in node order.
 * Verified against the live "More from" cards of every post.
 */
const RECREATED_LEGACY_NODES = new Set([
  '2015-09-29-Introducing-Eureka-iOS-form-library-written-in-pure-Swift.md',
]);

type NodeOrderFields = Pick<
  Post,
  'legacySourceFile' | 'publishedDate' | 'createdAt'
>;

const compareStrings = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

const nodeOrderRank = ({ legacySourceFile }: NodeOrderFields) =>
  !legacySourceFile ? 2 : RECREATED_LEGACY_NODES.has(legacySourceFile) ? 1 : 0;

/**
 * The old site's Gatsby node order: Gatsby lists nodes by creation counter, i.e. the source
 * files in byte order on a clean build, and a node re-created by an edit moves to the end.
 * Legacy posts: source file name (code-unit order, not the database collation), the
 * re-created ones last; then posts created in the CMS, by publication and creation date.
 */
export const compareNodeOrder = (a: NodeOrderFields, b: NodeOrderFields) =>
  nodeOrderRank(a) - nodeOrderRank(b) ||
  compareStrings(a.legacySourceFile ?? '', b.legacySourceFile ?? '') ||
  compareStrings(a.publishedDate ?? '', b.publishedDate ?? '') ||
  compareStrings(a.createdAt, b.createdAt);
