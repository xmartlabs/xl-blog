import React from "react";
import PropTypes from "prop-types";

import { classnames } from "../../helpers";

const Category = ({ data, className }) => <p className={classnames("border-0 rounded-[6.49875px] h-[1.4rem] mr-8 text-center font-primary", className)}>{data}</p>;

Category.propTypes = {
  data: PropTypes.string.isRequired,
  className: PropTypes.string,
};

Category.defaultProps = {
  className: '',
};

export { Category };
