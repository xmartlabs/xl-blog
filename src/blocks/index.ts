import type { Block } from 'payload';

/** YouTube video, uploaded video, or a legacy self-hosted file in /images. */
export const VideoBlock: Block = {
  slug: 'video',
  interfaceName: 'VideoBlock',
  labels: { singular: 'Video', plural: 'Videos' },
  fields: [
    {
      name: 'youtubeUrlOrId',
      label: 'YouTube URL or video id',
      type: 'text',
    },
    {
      name: 'file',
      label: 'Uploaded video',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'legacyName',
      label: 'Legacy file name',
      type: 'text',
      admin: { description: 'Old posts only: a file name under /images/.' },
    },
    { name: 'title', type: 'text', defaultValue: 'Xmartlabs' },
    { name: 'width', type: 'text', defaultValue: '100%' },
    { name: 'height', type: 'text', defaultValue: '560px' },
  ],
};

/** One image (standalone) or a row of images, as the old <Image> component rendered them. */
export const ImageGalleryBlock: Block = {
  slug: 'imageGallery',
  interfaceName: 'ImageGalleryBlock',
  labels: { singular: 'Image / gallery', plural: 'Images / galleries' },
  fields: [
    {
      name: 'images',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          name: 'url',
          type: 'text',
          admin: {
            description: 'Legacy image path (used when no upload is set).',
          },
        },
      ],
    },
    { name: 'alt', type: 'text' },
    {
      name: 'standalone',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Render a plain full-width <img> (like a Markdown image) instead of the sized gallery.',
      },
    },
    {
      name: 'width',
      type: 'text',
      admin: { condition: (_, s) => !s?.standalone },
    },
    {
      name: 'height',
      type: 'text',
      admin: { condition: (_, s) => !s?.standalone },
    },
    {
      name: 'aspectRatio',
      type: 'text',
      admin: { condition: (_, s) => !s?.standalone },
    },
  ],
};

export const TableBlock: Block = {
  slug: 'table',
  interfaceName: 'TableBlock',
  labels: { singular: 'Table', plural: 'Tables' },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'headers', type: 'text', hasMany: true, required: true },
    {
      name: 'rows',
      type: 'array',
      fields: [{ name: 'cells', type: 'text', hasMany: true }],
    },
  ],
};

export const CodeBlock: Block = {
  slug: 'code',
  interfaceName: 'CodeBlock',
  labels: { singular: 'Code', plural: 'Code blocks' },
  fields: [
    {
      name: 'language',
      type: 'text',
      defaultValue: 'text',
      admin: {
        description:
          'Prism language id, e.g. js, ts, swift, kotlin, shell, python. Use "text" for none.',
      },
    },
    {
      name: 'code',
      type: 'code',
      required: true,
    },
  ],
};

/** Raw HTML, for legacy markup (embeds, styled HTML) that has no native equivalent. */
export const HtmlEmbedBlock: Block = {
  slug: 'htmlEmbed',
  interfaceName: 'HtmlEmbedBlock',
  labels: { singular: 'HTML embed', plural: 'HTML embeds' },
  fields: [
    {
      name: 'html',
      type: 'code',
      required: true,
      admin: { language: 'html' },
    },
  ],
};

export const postBlocks: Block[] = [
  CodeBlock,
  ImageGalleryBlock,
  VideoBlock,
  TableBlock,
  HtmlEmbedBlock,
];
