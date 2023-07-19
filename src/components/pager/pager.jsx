import React, { useEffect } from "react";
import { Link } from "gatsby";

import PropTypes from "prop-types";

import * as styles from "./pager.module.scss";

const buildPageLocation = ({ numPages, page, category }) => {
  if (page === numPages) {
    return '';
  }

  if (!category && page === 1) {
    return '/'
  }

  return category ? `/categories/${category}/page/${page}` : `/page/${page}`;
};

const Pager = ({ pageContext }) => {
  const {numPages,  currentPage, category} = pageContext;
  const prevPage = buildPageLocation({ page: currentPage - 1, category});
  const nextPage = buildPageLocation({ numPages, page: currentPage + 1, category});
  const actualPage = buildPageLocation({ page: currentPage, category });

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
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
