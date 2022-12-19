import React from "react";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

import * as categoryStyles from "./category.module.scss";

const Category = ({ data }) => (
  <div className={categoryStyles.categoryWrapper}>
    <FontAwesomeIcon className={categoryStyles.styledIcon} icon={faCircle}/>
    <p className="category">{data}</p>
    {console.log(data)}
  </div>
);

Category.propTypes = {
  data: PropTypes.object.isRequired,
};

export { Category };
