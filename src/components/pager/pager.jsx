import React, { useEffect } from "react";
import { Link } from "gatsby";

import PropTypes from "prop-types";

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

  return category ? `/categories/${category}/page/${(currentPage - 1)}` : `/page/${(currentPage - 1)}`;
};

const setNextPage = ({numPages, currentPage, category}) => {
  if (currentPage === numPages) {
    return '';
  }

  return category ? `/categories/${category}/page/${(currentPage + 1)}` : `/page/${(currentPage + 1)}`;
};

const setActualPage = ({currentPage, category}) => {
  if (currentPage === 1) {
    return category ? `/categories/${category}/` : `/`
  }

  return category ? `/categories/${category}/page/${(currentPage)}` : `/page/${(currentPage)}`;
}

const Pager = ({ pageContext }) => {
  const {numPages,  currentPage, category} = pageContext;
  const prevPage = setPrevPage({currentPage, category});
  const nextPage = setNextPage({numPages, currentPage, category});
  const actualPage = setActualPage({currentPage, category});

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
        <Link to={actualPage} className={styles.linkNumber}>{currentPage}</Link>
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
