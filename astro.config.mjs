// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import remarkUnwrapImages from 'remark-unwrap-images';
import rehypeCodeWrapper from './src/lib/rehype-code-wrapper.mjs';
import remarkCodeLeadingNewlines from './src/lib/remark-code-leading-newlines.mjs';
import rehypeFlattenNestedParagraphs from './src/lib/rehype-flatten-nested-paragraphs.mjs';
import remarkLowercaseCodeLang from './src/lib/remark-lowercase-code-lang.mjs';

export default defineConfig({
  site: 'https://blog.xmartlabs.com',
  // Keep serving static/ at the site root so every `/images/...` path in posts keeps working.
  publicDir: './static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  // Keep whitespace between inline elements, like the Gatsby site rendered it.
  compressHTML: true,
  markdown: {
    syntaxHighlight: 'prism',
    // remark/rehype pipeline, matching the old gatsby-plugin-mdx setup (GFM, no smart quotes).
    processor: unified({
      gfm: true,
      smartypants: false,
      // remark-unwrap-images: gatsby-plugin-mdx applied it, so standalone images render
      // outside a <p> (and get the `.bodyPostContainer > img` styles).
      remarkPlugins: [
        remarkLowercaseCodeLang,
        remarkUnwrapImages,
        remarkCodeLeadingNewlines,
      ],
      rehypePlugins: [rehypeCodeWrapper, rehypeFlattenNestedParagraphs],
    }),
  },
  integrations: [
    mdx(),
    react(),
    sitemap({
      filter: (page) => !page.includes('/admin/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
