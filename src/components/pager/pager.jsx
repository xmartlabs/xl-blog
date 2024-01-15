import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

import { ErrorSafeLocalStorage } from "../../helpers";
import * as styles from "./pager.module.scss";

const buildPageLocation = ({ numPages, page, category }) => {
  if (page - 1 < 1) return category ? `/categories/${category}` : `/`;

  if (page - 1 === numPages) return '';

  return category ? `/categories/${category}/page/${page}` : `/page/${page}`;
};

const Pager = ({ pageContext }) => {
  const { numPages,  currentPage, category } = pageContext;
  const prevPage = buildPageLocation({ page: currentPage - 1, category});
  const nextPage = buildPageLocation({ numPages, page: currentPage + 1, category});

  const onClick = () => {
    ErrorSafeLocalStorage.setItem('scrollTo', 'categories');
  };

  return(
    <div className={styles.pagerContainer}>
      <Link className={styles.pagerLink} disabled={currentPage <= 1} onClick={onClick} to={prevPage} rel="prev">
        ← Prev
      </Link>
      <div className={styles.linkNumber}>{currentPage}</div>
      <Link className={styles.pagerLink} disabled={currentPage >= numPages} onClick={onClick} to={nextPage} rel="next">
        Next →
      </Link>
    </div>
  );
};

Pager.propTypes = {
  pageContext: PropTypes.object.isRequired,
};

export { Pager };
