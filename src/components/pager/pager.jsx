import React, { useEffect } from "react";
import { Link } from "gatsby";

import PropTypes from "prop-types";
import { actualCategory } from "../../helpers/actual-category";

import * as styles from "./pager.module.scss";

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

  return actualCategory() ? `/categories/${actualCategory()}/page/${(currentPage - 1)}` : `/page/${(currentPage - 1)}`;
};

const setNextPage = ({numPages, currentPage}) => {
  if (currentPage === numPages) {
    return '';
  }

  return actualCategory() ? `/categories/${actualCategory()}/page/${(currentPage + 1)}` : `/page/${(currentPage + 1)}`;
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
