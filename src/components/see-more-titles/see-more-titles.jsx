import React from "react";
import PropTypes from "prop-types";

import { classnames } from "../../helpers";

import * as styles from "./see-more-titles.module.scss";

const SeeMoreTitles = ({ onClick, className, children}) => (
  <a onClick={onClick} className={classnames(className, styles.container)} href="" >
    {children}
  </a>
);

SeeMoreTitles.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func
};

SeeMoreTitles.defaultProps = {
  className: '',
  onClick: () => {},
};

export { SeeMoreTitles };
