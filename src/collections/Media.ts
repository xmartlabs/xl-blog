import type { CollectionConfig } from 'payload';

import { admins, anyone, authenticated } from '../access';

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: admins,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    mimeTypes: ['image/*', 'video/*'],
  },
};
