import React from 'react';

import { NotFoundPage } from '@/components/not-found/NotFoundPage';
import {
  PostListPage,
  parsePageParam,
} from '@/components/post-list-page/PostListPage';
import { getHomePages } from '@/lib/posts';

type Props = { params: Promise<{ page: string }> };

export async function generateStaticParams() {
  return (await getHomePages())
    .slice(1)
    .map((page) => ({ page: String(page.currentPage) }));
}

export default async function HomeListPage({ params }: Props) {
  const pageNumber = parsePageParam((await params).page);
  // Page 1 lives at `/`.
  if (!pageNumber || pageNumber < 2) return <NotFoundPage />;
  const page = (await getHomePages())[pageNumber - 1];
  if (!page) return <NotFoundPage />;
  return <PostListPage {...page} pathname={`/page/${pageNumber}/`} />;
}
