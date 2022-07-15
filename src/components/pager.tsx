import React from "react"
import * as pagerStyles from "../css/pager.module.css"
import Pages from "../components/pages"

import { Link } from "gatsby"

const Pager = ({ pageContext }) => {
  const { numPages,  currentPage} = pageContext
  let pagesData = {}
  if (currentPage + 3 >= numPages) {
    pagesData = {firstPage: (numPages - 3), secondPage: (numPages - 2), thirdPage: (numPages - 1), lastPage: numPages, currentPage: currentPage}
  } else {
    pagesData = {firstPage: currentPage, secondPage: (currentPage + 1), thirdPage: (currentPage + 2), lastPage: (currentPage + 3), currentPage: currentPage}
  }
  const prevPage = currentPage - 1 === 1 ? "/" : `/page/${(currentPage - 1)}`.toString()
  const nextPage = `/page/${(currentPage + 1)}`.toString()
  return(
    <div className={pagerStyles.pagerContainer}>
      <Link className={pagerStyles.pagerLink} to={prevPage} rel="prev">
      ← Prev
      </Link>
      <Pages data={pagesData}/>
      <Link className={pagerStyles.pagerLink} to={nextPage} rel="next">
      Next →
      </Link>
    </div>
  )
}

export default Pager
