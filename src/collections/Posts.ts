import kebabCase from 'lodash/kebabCase.js';
import type {
  CollectionBeforeChangeHook,
  CollectionConfig,
  DefaultValue,
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
import { authorIdOfUser } from '../lib/default-author';
import {
  revalidateAfterDelete,
  revalidatePostAfterChange,
} from '../lib/revalidate';

/** Set `req.context.legacyImport` to skip the editorial rules (old posts break some of them). */
const isLegacyImport = (req: PayloadRequest) =>
  Boolean(req.context?.legacyImport);

const slugFromTitle: FieldHook = ({ value, data }) => {
  if (typeof value === 'string' && value.trim()) return kebabCase(value);
  if (typeof data?.title === 'string') return kebabCase(data.title);
  return value;
};

/**
 * Preview URLs are relative: the admin panel resolves them against its own origin, so they
 * work on localhost, production and Vercel preview deployments alike. /next/preview turns on
 * Next.js draft mode (signed-in users only) and redirects to the post.
 */
const previewPath = (slug: unknown) =>
  typeof slug === 'string' && slug
    ? `/next/preview/?path=${encodeURIComponent(`/blog/${slug}/`)}`
    : null;

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
    defaultColumns: ['title', '_status', 'publishedDate', 'category', 'author'],
    listSearchableFields: ['title', 'slug', 'tags'],
    description:
      'Drafts save automatically. Publish makes a post live; Schedule Publish (next to Publish) does it later.',
    livePreview: {
      url: ({ data }) => previewPath(data?.slug) ?? '',
    },
    preview: (doc) => previewPath(doc?.slug),
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
    afterChange: [revalidatePostAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  versions: {
    drafts: {
      autosave: { interval: 800 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
  fields: [
    // Main column: title, subtitle, body.
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description:
          'The headline, at least 12 characters. Shown on the post, its card and in search results.',
      },
      validate: (value: unknown, { req }: { req: PayloadRequest }) => {
        if (isLegacyImport(req)) return true;
        if (typeof value !== 'string' || value.trim().length < 12) {
          return 'The title must be at least 12 characters long.';
        }
        return true;
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      admin: {
        description:
          'Optional. Kept from the old blog; not shown on the site at the moment.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      admin: {
        description:
          'The post body. Type “/” or click “+” at the start of a line to add images, videos, code, tables or raw HTML.',
      },
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          FixedToolbarFeature(),
          BlocksFeature({ blocks: postBlocks }),
        ],
      }),
    },
    // Sidebar: URL, date, classification, image.
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      required: true,
      admin: {
        position: 'sidebar',
        description:
          'Becomes the URL: blog.xmartlabs.com/blog/<slug>/. Filled from the title if empty. Changing it on a published post breaks old links.',
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
        description:
          'The date shown on the post; lists are sorted by it. Defaults to today. It doesn’t publish anything: to publish later, use Schedule Publish next to Publish.',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      admin: {
        position: 'sidebar',
        description:
          'Shown above the title; the post also appears on that category’s page.',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      required: true,
      // The author linked to the signed-in user (Users → Author), if any.
      defaultValue: (({ user }) => authorIdOfUser(user)) as DefaultValue,
      admin: {
        position: 'sidebar',
        description:
          'Preselected with your own author profile when an admin has linked it to your user. Not in the list? Create it under Authors.',
      },
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      admin: {
        position: 'sidebar',
        description:
          '1–5 short lowercase topics, e.g. ios, machine-learning. Press Enter after each tag.',
      },
      validate: (value: unknown, { req }: { req: PayloadRequest }) => {
        if (isLegacyImport(req)) return true;
        const count = Array.isArray(value) ? value.length : 0;
        if (count < 1 || count > 5) return 'Add between 1 and 5 tags.';
        return true;
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'Kept from the old blog; not used by the site at the moment.',
      },
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
        description:
          'Post image: the hero on the post page (about 820 px wide) and the card in post lists (cropped to 16:9). Upload a 16:9 image, at least 1600×900 px, and set its focal point so crops keep the important part.',
      },
    },
    {
      name: 'thumbnailUrl',
      label: 'Thumbnail URL (legacy)',
      type: 'text',
      admin: {
        position: 'sidebar',
        description:
          'Old posts only: the image path, e.g. /images/foo.png. An uploaded thumbnail takes precedence.',
        // Only imported posts have one; new posts upload a thumbnail instead.
        condition: (data) => Boolean(data?.thumbnailUrl),
      },
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
      // Imported posts only: the old Markdown file name. Same-day posts and the "more blogs"
      // cards follow the old file order.
      name: 'legacySourceFile',
      type: 'text',
      index: true,
      admin: { hidden: true },
    },
  ],
};
