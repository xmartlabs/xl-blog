import React from 'react';

import { NotFoundPage } from '@/components/not-found/NotFoundPage';
import { PostListPage } from '@/components/post-list-page/PostListPage';
import { getCategoryPages } from '@/lib/posts';

type Props = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
  return (await getCategoryPages())
    .filter((page) => page.currentPage === 1)
    .map((page) => ({ category: page.category! }));
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const page = (await getCategoryPages()).find(
    (p) => p.category === category && p.currentPage === 1
  );
  if (!page) return <NotFoundPage />;
  return <PostListPage {...page} pathname={`/categories/${category}/`} />;
}
