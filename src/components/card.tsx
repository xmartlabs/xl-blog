import React from "react"
import Category from "./category"
import * as generalStyles from "../css/general.module.scss"

import { Link } from "gatsby"

const Card = ({ data }) => (
  <article key={data.id}>
    <div className={generalStyles.listNode}>
      <img className={generalStyles.styledImage} src={data.frontmatter.thumbnail}/>
      <Category data={data.frontmatter.category}/>
      <Link className={generalStyles.styledLink} to={`/${_.kebabCase(data.frontmatter.permalink)}`}>
          {data.frontmatter.title}
      </Link>
    </div>
  </article>
)

export default Card
