'use client';

import React, { useEffect, useRef } from 'react';

import { Pager } from '../pager';
import { Card } from '../card';
import { ErrorSafeLocalStorage, classnames } from '../../helpers';

// Props are plain serializable data so this can be rendered from a Server Component:
// - posts: [{ id, title, slug, thumbnail }]
// - pageContext: { currentPage, numPages, category }
// - selectedCategory: category id, 'all', or '' (none selected)
// - categoryTabs: [{ id, label, href }]
// - pathname: current page path (with trailing slash)
/**
 * @param {{
 *   posts?: { id: string | number, title: string, slug: string, thumbnail: string | null }[],
 *   pageContext: { currentPage: number, numPages: number, category?: string },
 *   selectedCategory?: string,
 *   categoryTabs?: { id: string, label: string, href: string }[],
 *   pathname: string,
 * }} props
 */
export const BlogList = ({
  posts = [],
  pageContext,
  selectedCategory = 'all',
  categoryTabs = [],
  pathname,
}) => {
  // Scroll to desired page height
  const categoryFiltersRef = useRef(null);
  useEffect(() => {
    const scrollTo = ErrorSafeLocalStorage.getItem('scrollTo');
    if (!scrollTo) return;

    ErrorSafeLocalStorage.removeItem('scrollTo');

    const timeout = setTimeout(() => {
      if (scrollTo === 'categories') {
        // Place filters at the top of the viewport and scroll down to account for the navbar
        categoryFiltersRef.current?.scrollIntoView({ behavior: 'instant' });
        window.scrollBy(0, -140);
      } else {
        window.scrollTo(0, Number(scrollTo));
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <>
      <div
        className="
          w-full max-w-full flex flex-row flex-nowrap 
          md:m-[8rem_0_5rem_0] md:gap-[6%] md:items-center md:justify-center 
          max-md:gap-[3rem] max-md:m-[3rem_0_1.5rem_0] max-md:p-[0_2rem_0.5rem_2rem] max-md:overflow-x-auto
        "
        ref={categoryFiltersRef}
      >
        {categoryTabs.map(({ id, label, href }) => (
          <a
            key={id}
            aria-current={href === pathname ? 'page' : undefined}
            onClick={() =>
              ErrorSafeLocalStorage.setItem('scrollTo', window.scrollY)
            }
            className={classnames(
              '!text-filter font-primary tracking-[1px] list-none no-underline w-fit text-gray-five',
              id === selectedCategory &&
                'text-xl-pink border-b-[2px] border-xl-pink'
            )}
            href={href}
          >
            {label}
          </a>
        ))}
      </div>
      <div
        className="
          m-[0_16%_0] grid grid-cols-[repeat(auto-fill,minmax(28%,1fr))] gap-16 
          max-sm:m-0 max-sm:gap-[4rem_0] max-sm:grid-cols-[auto]
        "
      >
        {posts.map((post) => (
          <Card data={post} key={post.id} />
        ))}
      </div>
      <Pager {...pageContext} pathname={pathname} />
    </>
  );
};
