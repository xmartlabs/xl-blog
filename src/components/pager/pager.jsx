'use client';

import React from 'react';

import { ErrorSafeLocalStorage } from '../../helpers';

const buildPageUrl = ({ page, category }) => {
  let url = '/';
  if (category) url = `/categories/${category}/`;
  if (page > 1) url = `${url}page/${page}/`;
  return url;
};

const itemsArroundCurrentPage = 2;
const centralItemsLength = itemsArroundCurrentPage * 2 + 1;
const getPagerItems = (currentPage, numPages) => {
  // Too few pages, all will be shown
  if (numPages < centralItemsLength + 2)
    return Array.from({ length: numPages }, (_, i) => i + 1);

  // Pages surrounding the current page
  const centralItems = Array.from(
    { length: centralItemsLength },
    (_, i) => currentPage - itemsArroundCurrentPage + i
  );

  // Keep number of pages but shift them to avoid numbers outside of [2, numPages - 1]
  const shift =
    centralItems[0] < 2
      ? 2 - centralItems[0]
      : centralItems[centralItems.length - 1] > numPages - 1
        ? numPages - 1 - centralItems[centralItems.length - 1]
        : 0;
  if (shift) centralItems.forEach((_, i) => (centralItems[i] += shift));

  // Replace first and/or last elements with ellipsis if applicable
  if (centralItems[0] > 2) centralItems[0] = '';
  if (centralItems[centralItems.length - 1] < numPages - 1)
    centralItems[centralItems.length - 1] = '';

  // Add first and last page, always shown
  return [1, ...centralItems, numPages];
};

const PagerLink = ({ text, url, disabled, pathname }) => (
  <a
    className="
      font-link-light no-underline min-w-[32px] text-center text-default-gray cursor-pointer 
      disabled:cursor-not-allowed disabled:text-disabled-gray disabled:pointer-events-none
    "
    aria-current={url === pathname ? 'page' : undefined}
    aria-disabled={disabled || undefined}
    onClick={() => ErrorSafeLocalStorage.setItem('scrollTo', 'categories')}
    // "Prev" on the first page and "Next" on the last one link nowhere (the old site
    // linked to non-existent pages).
    href={disabled ? undefined : url}
  >
    {text}
  </a>
);

const Pager = ({ numPages, currentPage, category, pathname }) => {
  return (
    <div className="flex flex-row justify-center my-20 font-medium py-4 px-0 max-sm:my-20 max-sm:mx-auto">
      <PagerLink
        text="← Prev"
        url={buildPageUrl({ page: currentPage - 1, category })}
        disabled={currentPage === 1}
        pathname={pathname}
      />
      <div className="w-[10px]" />
      {getPagerItems(currentPage, numPages).map((item, index) =>
        item === currentPage ? (
          <span
            key={item}
            className="font-link-light no-underline min-w-[32px] text-center text-xl-pink cursor-pointer"
          >
            {item}
          </span>
        ) : item === '' ? (
          <span
            key={`ellipsis-${index}`}
            className="font-link-light no-underline min-w-[32px] text-center text-default-gray cursor-pointer"
          >
            ...
          </span>
        ) : (
          <PagerLink
            key={item}
            text={item}
            url={buildPageUrl({ page: item, category })}
            disabled={item === 'prev' || item === 'next'}
            pathname={pathname}
          />
        )
      )}
      <div className="w-[10px]" />
      <PagerLink
        text="Next →"
        url={buildPageUrl({ page: currentPage + 1, category })}
        disabled={currentPage === numPages}
        pathname={pathname}
      />
    </div>
  );
};

export { Pager };
