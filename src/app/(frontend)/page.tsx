import React from 'react';

import { PostListPage } from '@/components/post-list-page/PostListPage';
import { getHomePages } from '@/lib/posts';

export default async function HomePage() {
  const [firstPage] = await getHomePages();
  return <PostListPage {...firstPage} pathname="/" />;
}
