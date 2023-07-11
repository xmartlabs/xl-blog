import React from "react";
import PropTypes from "prop-types";

import * as pagerStyles from "../pager/pager.module.scss";

import { Link } from "gatsby";

const Pages = ({ data }) => {
  const { currentPage } = data;
  return(
  <>
    <Link className={pagerStyles.selectedPage}>
      {currentPage}
    </Link>
  </>
  );
};

Pages.propTypes = {
  data: PropTypes.object.isRequired,
  linkDisabled: PropTypes.bool.isRequired,
};

export { Pages };
