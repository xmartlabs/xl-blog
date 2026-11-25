import type { CollectionConfig } from 'payload';

import {
  revalidateAfterChange,
  revalidateAfterDelete,
} from '../lib/revalidate';
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
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
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
    {
      name: 'showInFilters',
      label: 'Show as a filter tab',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description:
          'Tab above the post lists. The category page exists either way. (The old site hid Blockchain and Data Engineering.)',
      },
    },
  ],
};
