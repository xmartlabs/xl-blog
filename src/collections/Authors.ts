import type { CollectionConfig } from 'payload';

import {
  revalidateAfterChange,
  revalidateAfterDelete,
} from '../lib/revalidate';
import { admins, anyone, authenticated } from '../access';

export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'profileUrl'],
    listSearchableFields: ['name', 'slug'],
    description:
      'The people shown as post authors. An author doesn’t need a user account; admins can link one to a user (Users → Author) so new posts preselect it.',
  },
  defaultSort: 'name',
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: admins,
  },
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'Full name, as shown on posts.' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description:
          'Used in /authors/<slug>/, e.g. jane-doe. Legacy ids (e.g. mtnBarreto) are kept as-is.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Profile picture, square (shown small next to the author name).',
      },
    },
    {
      name: 'imageUrl',
      label: 'Image URL (legacy)',
      type: 'text',
      admin: {
        description:
          'Old authors only: picture path, e.g. /images/members/foo.jpg. An uploaded image takes precedence.',
        // Only imported authors have one; new authors upload an image instead.
        condition: (data) => Boolean(data?.imageUrl),
      },
    },
    {
      name: 'profileUrl',
      label: 'Profile URL',
      type: 'text',
      admin: {
        description:
          'Link on the author name on posts, e.g. a LinkedIn or GitHub profile.',
      },
    },
    {
      name: 'github',
      type: 'text',
      admin: {
        description: 'Kept from the old blog; not shown on the site.',
      },
    },
    {
      name: 'twitter',
      type: 'text',
      admin: {
        description: 'Kept from the old blog; not shown on the site.',
      },
    },
  ],
};
