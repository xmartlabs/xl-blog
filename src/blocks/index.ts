import type { Block, PayloadRequest, TextFieldSingleValidation } from 'payload';

import { isValidYouTubeInput } from '../lib/youtube';

/**
 * Post body blocks (the "/" and "+" menus of the editor). Labels and descriptions are for
 * editors; changing them doesn't change stored content or the rendered HTML.
 */

const validateYouTube: TextFieldSingleValidation = (value, { req }) => {
  if ((req as PayloadRequest | undefined)?.context?.legacyImport) return true;
  if (!value || !value.trim() || isValidYouTubeInput(value)) return true;
  return 'This doesn’t look like a YouTube link. Paste the link from the browser or the Share button, or the 11-character video ID.';
};

/** YouTube video, uploaded video, or a legacy self-hosted file in /images. */
export const VideoBlock: Block = {
  slug: 'video',
  interfaceName: 'VideoBlock',
  labels: { singular: 'YouTube or video file', plural: 'Videos' },
  fields: [
    {
      name: 'youtubeUrlOrId',
      label: 'YouTube link or video ID',
      type: 'text',
      validate: validateYouTube,
      admin: {
        description:
          'Paste a YouTube link (youtube.com/watch?v=…, youtu.be/…, /shorts/…) or the video ID. Leave empty to use an uploaded video instead.',
      },
    },
    {
      name: 'file',
      label: 'Uploaded video',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Or upload an MP4/WebM video file. Used when there is no YouTube link.',
        condition: (_, siblingData) => !siblingData?.youtubeUrlOrId,
      },
    },
    {
      name: 'legacyName',
      label: 'Legacy file name',
      type: 'text',
      admin: {
        description: 'Old posts only: a file name under /images/.',
        condition: (_, siblingData) => Boolean(siblingData?.legacyName),
      },
    },
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Xmartlabs',
      admin: {
        description: 'Accessible name of the player (read by screen readers).',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'width',
          type: 'text',
          defaultValue: '100%',
          admin: { description: 'CSS width, e.g. 100% or 640px.' },
        },
        {
          name: 'height',
          type: 'text',
          defaultValue: '560px',
          admin: { description: 'CSS height, e.g. 560px.' },
        },
      ],
    },
  ],
};

/** One image (standalone) or a row of images, as the old <Image> component rendered them. */
export const ImageGalleryBlock: Block = {
  slug: 'imageGallery',
  interfaceName: 'ImageGalleryBlock',
  labels: { singular: 'Images (one or a row)', plural: 'Images' },
  fields: [
    {
      name: 'images',
      type: 'array',
      minRows: 1,
      required: true,
      admin: {
        description:
          'One image, or several shown side by side. Upload or pick each image.',
      },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          name: 'url',
          label: 'Image URL (legacy)',
          type: 'text',
          admin: {
            description:
              'Old posts only: image path, used when no upload is set.',
            condition: (_, siblingData) => Boolean(siblingData?.url),
          },
        },
      ],
    },
    {
      name: 'alt',
      label: 'Alt text',
      type: 'text',
      admin: {
        description:
          'Describe the image(s) for screen readers and search engines.',
      },
    },
    {
      name: 'standalone',
      label: 'Full width',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Show each image full width, like a plain Markdown image, instead of the sized row below.',
      },
    },
    {
      type: 'row',
      admin: { condition: (_, siblingData) => !siblingData?.standalone },
      fields: [
        {
          name: 'width',
          type: 'text',
          admin: { description: 'Optional CSS width, e.g. 80%.' },
        },
        {
          name: 'height',
          type: 'text',
          admin: { description: 'Optional CSS height, e.g. 400px.' },
        },
        {
          name: 'aspectRatio',
          type: 'text',
          admin: { description: 'Optional, e.g. 16/9.' },
        },
      ],
    },
  ],
};

export const TableBlock: Block = {
  slug: 'table',
  interfaceName: 'TableBlock',
  labels: { singular: 'Table', plural: 'Tables' },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: { description: 'Optional caption above the table.' },
    },
    {
      name: 'headers',
      label: 'Column headers',
      type: 'text',
      hasMany: true,
      required: true,
      admin: {
        description: 'One per column. Press Enter after each header.',
      },
    },
    {
      name: 'rows',
      type: 'array',
      admin: {
        description:
          'One entry per row; add its cells in the same order as the headers.',
      },
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
          'For syntax highlighting: e.g. js, ts, swift, kotlin, shell, python. Use "text" for none.',
      },
    },
    {
      name: 'code',
      type: 'code',
      required: true,
      admin: { description: 'Paste the code as-is; indentation is kept.' },
    },
  ],
};

/** Raw HTML, for legacy markup (embeds, styled HTML) that has no native equivalent. */
export const HtmlEmbedBlock: Block = {
  slug: 'htmlEmbed',
  interfaceName: 'HtmlEmbedBlock',
  labels: { singular: 'Raw HTML (advanced)', plural: 'Raw HTML blocks' },
  fields: [
    {
      name: 'html',
      label: 'HTML',
      type: 'code',
      required: true,
      admin: {
        language: 'html',
        description:
          'Advanced: inserted into the page as-is. Mostly for content imported from the old blog, or embeds with no block of their own (e.g. a tweet or an iframe). Prefer the other blocks when one fits; broken HTML can break the page layout.',
      },
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
