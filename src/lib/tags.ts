import kebabCase from 'lodash/kebabCase.js';

import { getPosts, postSlug } from './posts';

/**
 * Tags grouped by URL slug, so variants such as "AI" and "ai" share one page.
 * Tags whose slug is empty are skipped.
 */
export const getTags = async () => {
  const groups = new Map<
    string,
    { slug: string; name: string; posts: { title: string; slug: string }[] }
  >();
  for (const post of await getPosts()) {
    for (const tag of new Set(post.data.tags)) {
      const slug = kebabCase(tag);
      if (!slug) continue;
      let group = groups.get(slug);
      if (!group) {
        group = { slug, name: tag, posts: [] };
        groups.set(slug, group);
      }
      if (!group.posts.some((p) => p.slug === postSlug(post))) {
        group.posts.push({ title: post.data.title, slug: postSlug(post) });
      }
    }
  }
  return [...groups.values()].sort((a, b) => a.name.localeCompare(b.name));
};
