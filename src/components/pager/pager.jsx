import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

import { ErrorSafeLocalStorage } from "../../helpers";
import * as styles from "./pager.module.scss";

const buildPageUrl = ({ page, category }) => {
  let url = '/';
  if (category) url = `/categories/${category}/`;
  if (page > 1) url = `${url}page/${page}`;
  return url;
};

const itemsArroundCurrentPage = 2;
const centralItemsLength = itemsArroundCurrentPage * 2 + 1;
const getPagerItems = (currentPage, numPages) => {
  // Too few pages, all will be shown
  if (numPages < centralItemsLength + 2) return Array.from({ length: numPages }, (_, i) => i + 1);

  // Pages surrounding the current page
  const centralItems = Array.from({ length: centralItemsLength }, (_, i) => currentPage - itemsArroundCurrentPage + i);

  // Keep number of pages but shift them to avoid numbers outside of [2, numPages - 1]
  const shift = centralItems[0] < 2
    ? 2 - centralItems[0]
    : centralItems[centralItems.length - 1] > numPages - 1
    ? numPages - 1 - centralItems[centralItems.length - 1]
    : 0;
  if (shift) centralItems.forEach((_, i) => centralItems[i] += shift);

  // Replace first and/or last elements with ellipsis if applicable
  if (centralItems[0] >  2) centralItems[0] = '';
  if (centralItems[centralItems.length - 1] <  numPages - 1) centralItems[centralItems.length - 1] = '';

  // Add first and last page, always shown
  return [1, ...centralItems, numPages];
}

const PagerLink = ({ text, url, disabled }) => (
  <Link
    className={styles.pagerLink}
    disabled={disabled}
    onClick={() => ErrorSafeLocalStorage.setItem('scrollTo', 'categories')}
    to={url}>
    {text}
  </Link>
);

const Pager = ({ numPages, currentPage, category }) => {
  return(
    <div className={styles.pagerContainer}>
      <PagerLink text="← Prev" url={buildPageUrl({ page: currentPage - 1, category })} disabled={currentPage === 1} />
      <div className={styles.spacer} />
      {getPagerItems(currentPage, numPages).map((item) => (
        item === currentPage ? (
          <span key={item} className={styles.currentPage}>{item}</span>
        ) : item === '' ? (
          <span key={item} className={styles.ellipsis}>...</span>
        ) : (
          <PagerLink
            key={item}
            text={item}
            url={buildPageUrl({ page: item, category })}
            disabled={item === 'prev' || item === 'next'}
          />
        )))}
      <div className={styles.spacer} />
      <PagerLink text="Next →" url={buildPageUrl({ page: currentPage + 1, category })} disabled={currentPage === numPages} />
    </div>
  );
};

Pager.propTypes = {
  numPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  category: PropTypes.string,
};

export { Pager };
