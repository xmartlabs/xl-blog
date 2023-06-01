import React from "react";
import PropTypes from "prop-types";

import * as pagerStyles from "../pager/pager.module.scss";

import { Link } from "gatsby";

const Pages = ({ data }) => { 
  const { firstPage,  secondPage, thirdPage, lastPage, currentPage } = data;
  const firstLink = firstPage === 1 ? '/' : `/page/${firstPage}`.toString();

  return(
  <>
    <Link className={firstPage === currentPage ? pagerStyles.selectedPage : pagerStyles.pagerLink} to={firstLink}>
      {firstPage}
    </Link>
    {[secondPage, thirdPage, lastPage].map( page => {
        
      const pagesType = () => {
        if (typeof window !== 'undefined') {
          const windowLocation = window.location.href;

          if (windowLocation.includes("categories") && page > 1) {
            const pattern = new RegExp('\\b(' + ['/page/', `${page-1}`, `${page+1}`].join('|') + ')\\b', 'gi');
            const result = windowLocation.replace(pattern, '');
            return `${result}page/${page}`
          }
          
          return `/page/${page}`
        }
      }

    return(
      <Link className={page === currentPage ? pagerStyles.selectedPage : pagerStyles.pagerLink} to={pagesType()}>
        {page}
      </Link>
    )}
    )}
  </>
  );
};

Pages.propTypes = {
  data: PropTypes.object.isRequired,
};

export { Pages };
