import React from "react";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { classnames } from "../../helpers";

import * as categoryStyles from "./category.module.scss";

const Category = ({ data, className }) => (
  <div className={classnames(categoryStyles.categoryWrapper, className)}>
    <FontAwesomeIcon className={categoryStyles.styledIcon} icon={faCircle}/>
    <p className="category">{data}</p>
  </div>
);

Category.propTypes = {
  data: PropTypes.object.isRequired,
};

export { Category };
