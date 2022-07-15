import React from "react"
import * as pagerStyles from "../css/pager.module.css"

import { Link } from "gatsby"

const Pages = ({ data }) => {
  const { firstPage,  secondPage, thirdPage, lastPage, currentPage } = data
  const firstLink = `/page/${firstPage}`.toString()
  const secondLink = `/page/${secondPage}`.toString()
  const thirdLink = `/page/${thirdPage}`.toString()
  const lastLink = `/page/${lastPage}`.toString()
  return(
    <>
      <Link className={firstPage === currentPage ? pagerStyles.selectedPage : pagerStyles.pagerLink} to={firstLink} rel="prev">
        {firstPage}
      </Link>
      <Link className={secondPage === currentPage ? pagerStyles.selectedPage : pagerStyles.pagerLink} to={secondLink} rel="prev">
        {secondPage}
      </Link>
      <Link className={thirdPage === currentPage ? pagerStyles.selectedPage : pagerStyles.pagerLink} to={thirdLink} rel="prev">
        {thirdPage}
      </Link>
      <Link className={lastPage === currentPage ? pagerStyles.selectedPage : pagerStyles.pagerLink} to={lastLink} rel="prev">
        {lastPage}
      </Link>
    </>
  )
}

export default Pages
