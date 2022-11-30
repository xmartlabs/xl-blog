import React from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

import * as category from "./category.module.scss";

const Category = ({ data }) => (
  <div className={category.categoryWrapper}>
    <FontAwesomeIcon className={category.styledIcon} icon={faCircle}/>
    <p className="category">{data}</p>
  </div>
);

export default Category;
