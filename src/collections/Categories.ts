import type { CollectionConfig } from 'payload';

import { admins, anyone } from '../access';

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'order'],
  },
  defaultSort: 'order',
  access: {
    read: anyone,
    create: admins,
    update: admins,
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
          'Used in /categories/<slug>/. Changing it breaks existing links.',
      },
    },
    { name: 'order', type: 'number', defaultValue: 99, required: true },
  ],
};
