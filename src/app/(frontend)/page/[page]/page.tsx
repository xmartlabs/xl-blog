import { notFound } from 'next/navigation';
import React from 'react';

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
  if (!pageNumber || pageNumber < 2) notFound();
  const page = (await getHomePages())[pageNumber - 1];
  if (!page) notFound();
  return <PostListPage {...page} pathname={`/page/${pageNumber}/`} />;
}
