import React from "react";
import { Link } from "gatsby";

import PropTypes from "prop-types";

import * as styles from "./pager.module.scss";

import { Pages } from "../pages";


const setPrevPage = ({currentPage}) => {
  if (currentPage === 1) {
    return 'javascript:void(0)'
  }
  
  if ((currentPage - 1) === 1) {
    return '/'
  }

  return `/page/${(currentPage - 1)}`
};

const setNextPage = ({numPages, currentPage}) => {
  if (currentPage === numPages) {
    return 'javascript:void(0)'
  }

  return `/page/${(currentPage + 1)}`
};

const setPagesData = ({numPages, currentPage}) => {
  if (currentPage + 2 >= numPages) {
    return {
      firstPage: (numPages - 3),
      secondPage: (numPages - 2),
      thirdPage: (numPages - 1),
      lastPage: numPages,
      currentPage: currentPage
    };
  } 
  
  if (currentPage - 2 <= 1) {
    return {
      firstPage: 1,
      secondPage: 2,
      thirdPage: 3,
      lastPage: 4,
      currentPage: currentPage
    };
  }

  return {
    firstPage: (currentPage - 2),
    secondPage: (currentPage - 1),
    thirdPage: currentPage,
    lastPage: (currentPage + 1),
    currentPage: currentPage
  };
};

const Pager = ({ pageContext }) => {
  const {numPages,  currentPage} = pageContext;
  const pagesData = setPagesData({numPages, currentPage});
  const prevPage = setPrevPage({currentPage});
  const nextPage = setNextPage({numPages, currentPage});
  
  return(
    <div className={styles.pagerContainer}>
      <Link className={currentPage === 1 ? styles.disabledPagerLink : styles.pagerLink} to={prevPage} rel="prev">
        ← Prev
      </Link>
      <Pages data={pagesData}/>
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
