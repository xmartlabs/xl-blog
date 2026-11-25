import { describe, expect, it } from 'vitest';

import type { Media } from '../src/payload-types';
import { postThumbnail, toCardData } from '../src/lib/post-utils';

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
