import React from "react"
import * as pagerStyles from "../css/pager.module.scss"
import Pages from "../components/pages"

import { Link } from "gatsby"

const setPrevPage = ({currentPage}) => {
  if (currentPage === 1) {
    return 'javascript:void(0)'
  }
  
  if ((currentPage - 1) === 1) {
    return '/'
  }

  return `/page/${(currentPage - 1)}`
}

const setNextPage = ({numPages, currentPage}) => {
  if (currentPage === numPages) {
    return 'javascript:void(0)'
  }
  return `/page/${(currentPage + 1)}`
}

const setPagesData = ({numPages, currentPage}) => {
  if (currentPage + 2 >= numPages) {
    return {
      firstPage: (numPages - 4),
      secondPage: (numPages - 3),
      thirdPage: (numPages - 2),
      fourthPage: (numPages - 1),
      lastPage: numPages,
      currentPage: currentPage
    };
  } 
  
  if (currentPage - 2 <= 1) {
    return {
      firstPage: 1,
      secondPage: 2,
      thirdPage: 3,
      fourthPage: 4,
      lastPage: 5,
      currentPage: currentPage
    };
  }

  return {
    firstPage: (currentPage - 2),
    secondPage: (currentPage - 1),
    thirdPage: currentPage,
    fourthPage: (currentPage + 1),
    lastPage: (currentPage + 2),
    currentPage: currentPage
  }
}

const Pager = ({ pageContext }) => {
  const {numPages,  currentPage} = pageContext
  const pagesData = setPagesData({numPages, currentPage})
  const prevPage = setPrevPage({currentPage})
  const nextPage = setNextPage({numPages, currentPage})
  return(
    <div className={pagerStyles.pagerContainer}>
      <Link className={currentPage === 1 ? pagerStyles.disabledPagerLink : pagerStyles.pagerLink} to={prevPage} rel="prev">
      ← Prev
      </Link>
      <Pages data={pagesData}/>
      <Link className={currentPage === numPages ? pagerStyles.disabledPagerLink : pagerStyles.pagerLink} to={nextPage} rel="next">
      Next →
      </Link>
    </div>
  )
}

export default Pager
