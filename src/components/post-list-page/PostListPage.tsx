import React from 'react';

import { getCategoryTabs, type ListPage } from '../../lib/posts';
import { BlogList } from '../blog-list/blog-list';
import { HeaderBanner } from '../header-banner';
import { Seo } from '../seo/Seo';

interface Props extends ListPage {
  pathname: string;
  /** Selected filter tab: a category slug, 'all', or '' for none. */
  selectedCategory?: string;
}

/** Home, `/page/<n>/` and category lists. */
export async function PostListPage({
  posts,
  currentPage,
  numPages,
  category,
  pathname,
  selectedCategory = category ?? 'all',
}: Props) {
  const categoryTabs = await getCategoryTabs();
  return (
    <>
      <Seo pathname={pathname} />
      <HeaderBanner />
      <BlogList
        posts={posts}
        pageContext={{ currentPage, numPages, category }}
        selectedCategory={selectedCategory}
        categoryTabs={categoryTabs}
        pathname={pathname}
      />
    </>
  );
}

/** `/page/<n>/` and `/categories/<slug>/page/<n>/`: n ≥ 2, digits only. */
export const parsePageParam = (page: string) =>
  /^[1-9]\d*$/.test(page) ? Number(page) : null;
