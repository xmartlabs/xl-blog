import React from "react";

import * as pagerStyles from "../pager/pager.module.scss";

import { Link } from "gatsby";

const Pages = ({ data }) => {
  const { firstPage,  secondPage, thirdPage, fourthPage, lastPage, currentPage } = data;
  const firstLink = firstPage === 1 ? '/' : `/page/${firstPage}`.toString();
  return(
  <>
    <Link className={firstPage === currentPage ? pagerStyles.selectedPage : pagerStyles.pagerLink} to={firstLink}>
      {firstPage}
    </Link>
    {[secondPage, thirdPage, fourthPage, lastPage].map( page => {
    
    return(
      <Link className={page === currentPage ? pagerStyles.selectedPage : pagerStyles.pagerLink} to={`/page/${page}`}>
        {page}
      </Link>
    )}
    )}
  </>
  );
};

export default Pages;
