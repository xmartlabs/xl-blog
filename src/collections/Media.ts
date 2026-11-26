import type { CollectionConfig } from 'payload';

import { admins, anyone, authenticated } from '../access';

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Media file', plural: 'Media' },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'mimeType', 'updatedAt'],
    description:
      'Images and videos used in posts. Upload images at least 1600 px wide; click the image after uploading to set the focal point (the part that crops keep).',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: admins,
  },
  fields: [
    {
      name: 'alt',
      label: 'Alt text',
      type: 'text',
      required: true,
      admin: {
        description:
          'Describe what the image shows, for screen readers and search engines, e.g. “Team at the 2024 offsite”. For videos, a short title.',
      },
    },
  ],
  upload: {
    // Images, plus MP4/WebM for video blocks (they play in every browser).
    mimeTypes: ['image/*', 'video/mp4', 'video/webm'],
    focalPoint: true,
    // Generated for new image uploads only (legacy posts use image URLs). Sizes larger than
    // the original are skipped and the original is used instead (src/lib/post-utils.ts).
    imageSizes: [
      // Post cards: 16:9 (`pb-[56.25%]` in card.jsx), cropped around the focal point.
      { name: 'card', width: 800, height: 450 },
      // Post page hero: ~51.3rem (≈820 px) wide, 2x for high-density screens.
      { name: 'hero', width: 1600 },
    ],
    adminThumbnail: 'card',
  },
};
