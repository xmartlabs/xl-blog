import kebabCase from 'lodash/kebabCase.js';
import type {
  CollectionBeforeChangeHook,
  CollectionConfig,
  FieldHook,
  PayloadRequest,
} from 'payload';
import {
  BlocksFeature,
  FixedToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical';

import { admins, authenticated, authenticatedOrPublished } from '../access';
import { postBlocks } from '../blocks';

/** Set `req.context.legacyImport` to skip the editorial rules (old posts break some of them). */
const isLegacyImport = (req: PayloadRequest) =>
  Boolean(req.context?.legacyImport);

const slugFromTitle: FieldHook = ({ value, data }) => {
  if (typeof value === 'string' && value.trim()) return kebabCase(value);
  if (typeof data?.title === 'string') return kebabCase(data.title);
  return value;
};

/** The legacy reading time no longer applies once the body is edited. */
const dropStaleReadingTime: CollectionBeforeChangeHook = ({
  data,
  originalDoc,
  req,
}) => {
  if (
    isLegacyImport(req) ||
    !originalDoc?.legacyReadingTime ||
    !('content' in data)
  )
    return data;
  if (JSON.stringify(data.content) !== JSON.stringify(originalDoc.content)) {
    data.legacyReadingTime = null;
  }
  return data;
};

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'publishedDate', 'author', '_status'],
  },
  defaultSort: '-publishedDate',
  access: {
    read: authenticatedOrPublished,
    create: authenticated,
    update: authenticated,
    delete: admins,
    readVersions: authenticated,
  },
  hooks: {
    beforeChange: [dropStaleReadingTime],
  },
  versions: {
    drafts: {
      autosave: { interval: 800 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      validate: (value: unknown, { req }: { req: PayloadRequest }) => {
        if (isLegacyImport(req)) return true;
        if (typeof value !== 'string' || value.trim().length < 12) {
          return 'The title must be at least 12 characters long.';
        }
        return true;
      },
    },
    { name: 'subtitle', type: 'text' },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      required: true,
      admin: {
        position: 'sidebar',
        description:
          'URL: /blog/<slug>/. Filled from the title when empty. Changing it breaks existing links.',
      },
      hooks: { beforeValidate: [slugFromTitle] },
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'MMMM d, yyyy' },
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      validate: (value: unknown, { req }: { req: PayloadRequest }) => {
        if (isLegacyImport(req)) return true;
        const count = Array.isArray(value) ? value.length : 0;
        if (count < 1 || count > 5) return 'Add between 1 and 5 tags.';
        return true;
      },
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Hero and card image. Takes precedence over Thumbnail URL.',
      },
    },
    {
      name: 'thumbnailUrl',
      type: 'text',
      admin: { description: 'Legacy image path, e.g. /images/foo.png.' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'legacyReadingTime',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description:
          'Imported posts: the "N min read" the old site showed. Cleared when the body changes.',
        condition: (data) => Boolean(data?.legacyReadingTime),
      },
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          FixedToolbarFeature(),
          BlocksFeature({ blocks: postBlocks }),
        ],
      }),
    },
  ],
};
