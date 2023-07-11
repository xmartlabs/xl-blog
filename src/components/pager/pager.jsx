import React, { useEffect } from "react";
import { Link } from "gatsby";

import PropTypes from "prop-types";

import * as styles from "./pager.module.scss";

const actualCategory = (currentPage) => {
  if (typeof window !== 'undefined') {
    const windowLocation = window.location.href;
    if (windowLocation.includes("categories")) {
      const pattern = new RegExp('\\b(' + ['/page/', `${currentPage}`].join('|') + ')\\b', 'gi');
      const result = windowLocation.replace(pattern, '');
      return result;
    }
  }
}


const setPrevPage = ({currentPage, category}) => {
  if (currentPage === 1) {
    return 'javascript:void(0)'
  }
  
  if (!category && (currentPage - 1) === 1) {
    return '/'
  }

  if (category && (currentPage - 1) === 1) {
    return `/categories/${category}`;
  }

  return actualCategory() ? `${actualCategory(currentPage)}page/${(currentPage - 1)}` : `/page/${(currentPage - 1)}`;
};

const setNextPage = ({numPages, currentPage}) => {
  if (currentPage === numPages) {
    return '';
  }

  return actualCategory() ? `${actualCategory(currentPage)}page/${(currentPage + 1)}` : `/page/${(currentPage + 1)}`;
};

const setPagesData = ({ currentPage }) => {
  return {
    currentPage: currentPage
  };
};

const Pager = ({ pageContext }) => {
  const {numPages,  currentPage, category} = pageContext;
  const pagesData = setPagesData({numPages, currentPage});
  const prevPage = setPrevPage({currentPage, category});
  const nextPage = setNextPage({numPages, currentPage});

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 1);
    
  }, []);

  return(
    <div className={styles.pagerContainer}>
      <Link className={currentPage === 1 ? styles.disabledPagerLink : styles.pagerLink} to={prevPage} rel="prev">
        ← Prev
      </Link>
        <Link to={pagesData.currentPage} className={styles.linkNumber}>{pagesData.currentPage}</Link>
      <Link className={currentPage === numPages ? styles.disabledPagerLink : styles.pagerLink} to={nextPage} rel="next">
        Next →
      </Link>
    </div>
  );
};

Pager.propTypes = {
  pageContext: PropTypes.object.isRequired,
};

export { Pager };
