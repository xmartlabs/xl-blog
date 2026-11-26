import { describe, expect, it } from 'vitest';

import type { Media } from '../src/payload-types';
import {
  authorImage,
  DEFAULT_AUTHOR_IMAGE,
  compareNodeOrder,
  postThumbnail,
  toCardData,
} from '../src/lib/post-utils';

const media = {
  id: 1,
  alt: 'x',
  url: '/api/media/file/photo.jpg',
  sizes: {
    card: { url: '/api/media/file/photo-800x450.jpg' },
    hero: { url: '/api/media/file/photo-1600x900.jpg' },
  },
} as unknown as Media;

describe('postThumbnail', () => {
  it('keeps the legacy URL output', () => {
    const post = { thumbnail: null, thumbnailUrl: '/images/foo.png' };
    expect(postThumbnail(post)).toBe('/images/foo.png');
    expect(postThumbnail(post, 'card')).toBe('/images/foo.png');
    expect(postThumbnail(post, 'hero')).toBe('/images/foo.png');
  });

  it('uses the generated size of an upload, else the original', () => {
    const post = { thumbnail: media, thumbnailUrl: '/images/foo.png' };
    expect(postThumbnail(post)).toBe('/api/media/file/photo.jpg');
    expect(postThumbnail(post, 'card')).toBe(
      '/api/media/file/photo-800x450.jpg'
    );
    expect(postThumbnail(post, 'hero')).toBe(
      '/api/media/file/photo-1600x900.jpg'
    );
    const small = {
      ...media,
      sizes: { card: { url: null }, hero: { url: null } },
    } as unknown as Media;
    expect(postThumbnail({ thumbnail: small }, 'hero')).toBe(
      '/api/media/file/photo.jpg'
    );
  });

  it('cards use the card size', () => {
    expect(
      toCardData({
        id: 1,
        title: 'T',
        slug: 's',
        thumbnail: media,
        thumbnailUrl: null,
      }).thumbnail
    ).toBe('/api/media/file/photo-800x450.jpg');
  });
});

describe('compareNodeOrder', () => {
  const post = (
    legacySourceFile: string | null,
    publishedDate = '2020-01-01T00:00:00.000Z',
    createdAt = '2024-01-01T00:00:00.000Z'
  ) => ({ legacySourceFile, publishedDate, createdAt });

  it('orders legacy posts by source file (code units), re-created nodes and CMS posts last', () => {
    const posts = [
      post(null, '2026-02-01T00:00:00.000Z'),
      post('2016-03-07-ci-with-xcode-server-and-fastlane.mdx'),
      post(null, '2026-01-01T00:00:00.000Z'),
      post(
        '2015-09-29-Introducing-Eureka-iOS-form-library-written-in-pure-Swift.md'
      ),
      post('2015-07-09-Android-logging-with-Crashlytics-and-Timber.mdx'),
      post('2015-07-09-a-lowercase-name.md'),
    ];
    expect(
      [...posts]
        .sort(compareNodeOrder)
        .map((p) => p.legacySourceFile ?? p.publishedDate)
    ).toEqual([
      '2015-07-09-Android-logging-with-Crashlytics-and-Timber.mdx',
      '2015-07-09-a-lowercase-name.md',
      '2016-03-07-ci-with-xcode-server-and-fastlane.mdx',
      '2015-09-29-Introducing-Eureka-iOS-form-library-written-in-pure-Swift.md',
      '2026-01-01T00:00:00.000Z',
      '2026-02-01T00:00:00.000Z',
    ]);
  });
});

describe('authorImage', () => {
  const author = (fields: object) =>
    ({ id: 1, name: 'A', slug: 'a', ...fields }) as never;

  it('prefers the uploaded photo, then the legacy URL', () => {
    expect(
      authorImage(
        author({
          image: { url: '/api/media/file/a.jpg' },
          imageUrl: '/images/members/a.png',
        })
      )
    ).toBe('/api/media/file/a.jpg');
    expect(authorImage(author({ imageUrl: '/images/members/a.png' }))).toBe(
      '/images/members/a.png'
    );
  });

  it('falls back to the default avatar for authors without a photo', () => {
    expect(authorImage(author({}))).toBe(DEFAULT_AUTHOR_IMAGE);
    expect(authorImage(author({ imageUrl: '' }))).toBe(DEFAULT_AUTHOR_IMAGE);
    expect(authorImage(null)).toBe(DEFAULT_AUTHOR_IMAGE);
  });
});
