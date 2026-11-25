import type { CollectionConfig } from 'payload';

import { admins, anyone, authenticated } from '../access';

export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: admins,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description:
          'Used in /authors/<slug>/. Legacy ids (e.g. mtnBarreto) are kept as-is.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Profile picture. Takes precedence over Image URL.',
      },
    },
    {
      name: 'imageUrl',
      type: 'text',
      admin: {
        description: 'Legacy picture path, e.g. /images/members/foo.jpg.',
      },
    },
    { name: 'profileUrl', type: 'text' },
    { name: 'github', type: 'text' },
    { name: 'twitter', type: 'text' },
  ],
};
