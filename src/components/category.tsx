import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import * as generalStyles from "../css/general.module.scss"

const Category = ({ data }) => (
    <div className={generalStyles.categoryWrapper}>
      <FontAwesomeIcon className={generalStyles.styledIcon} icon={faCircle}/>
      <p className="category">{data}</p>
    </div>
)

export default Category
