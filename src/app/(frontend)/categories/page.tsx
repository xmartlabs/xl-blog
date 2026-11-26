import React from 'react';

import { PostListPage } from '@/components/post-list-page/PostListPage';
import { getPublishedPosts, toCardData } from '@/lib/posts';

// Gatsby also built /categories/ from its category template: every post on one page,
// with no filter tab selected.
export default async function AllCategoriesPage() {
  const posts = (await getPublishedPosts()).map(toCardData);
  return (
    <PostListPage
      posts={posts}
      currentPage={1}
      numPages={1}
      selectedCategory=""
      pathname="/categories/"
    />
  );
}
