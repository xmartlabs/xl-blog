import { notFound } from 'next/navigation';
import React from 'react';

import {
  PostListPage,
  parsePageParam,
} from '@/components/post-list-page/PostListPage';
import { getCategoryPages } from '@/lib/posts';

type Props = { params: Promise<{ category: string; page: string }> };

export async function generateStaticParams() {
  return (await getCategoryPages())
    .filter((page) => page.currentPage > 1)
    .map((page) => ({
      category: page.category!,
      page: String(page.currentPage),
    }));
}

export default async function CategoryListPage({ params }: Props) {
  const { category, page: pageParam } = await params;
  const pageNumber = parsePageParam(pageParam);
  // Page 1 lives at `/categories/<slug>/`.
  if (!pageNumber || pageNumber < 2) notFound();
  const page = (await getCategoryPages()).find(
    (p) => p.category === category && p.currentPage === pageNumber
  );
  if (!page) notFound();
  return (
    <PostListPage
      {...page}
      pathname={`/categories/${category}/page/${pageNumber}/`}
    />
  );
}
