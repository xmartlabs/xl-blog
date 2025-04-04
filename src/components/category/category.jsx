import React from "react";
import PropTypes from "prop-types";

import { classnames } from "../../helpers";

import * as styles from "./category.module.scss";

const Category = ({ data, className }) => <p className={classnames(styles.categoryWrapper, className)}>{data}</p>;

Category.propTypes = {
  data: PropTypes.string.isRequired,
  className: PropTypes.string,
};

Category.defaultProps = {
  className: '',
};

export { Category };
