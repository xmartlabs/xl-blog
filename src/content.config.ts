import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Keep ids exactly as the file names (the default lowercases them, e.g. `mtnBarreto`).
const idFromFile = ({ entry }: { entry: string }) =>
  entry.replace(/\.ya?ml$/, '');

// Optional fields mirror the optional fields of the CMS form
// (and the gaps in older posts).
const blog = defineCollection({
  loader: glob({ base: './blogs', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().nullish(),
    permalink: z.string(),
    featured: z.boolean().nullish(),
    date: z.coerce.date(),
    category: reference('categories'),
    thumbnail: z.string().nullish(),
    tags: z
      .array(z.coerce.string())
      .nullish()
      .transform((tags) => tags ?? []),
    author: reference('authors'),
  }),
});

const authors = defineCollection({
  loader: glob({
    base: './content/authors',
    pattern: '*.yml',
    generateId: idFromFile,
  }),
  schema: z.object({
    name: z.string(),
    image: z.string().nullish(),
    profile_url: z.string().nullish(),
    github: z.string().nullish(),
    twitter: z.string().nullish(),
  }),
});

const categories = defineCollection({
  loader: glob({
    base: './content/categories',
    pattern: '*.yml',
    generateId: idFromFile,
  }),
  schema: z.object({
    name: z.string(),
    order: z.number().default(99),
  }),
});

export const collections = { blog, authors, categories };
