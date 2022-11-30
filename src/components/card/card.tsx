import React from "react";

import { Link } from "gatsby";

import Category from "../category/category.tsx";

import * as cardStyles from "./card.module.scss";

const Card = ({ data }) => (
  <article key={data.id}>
    <div className={cardStyles.listNode}>
      <img className={cardStyles.styledImage} src={data.frontmatter.thumbnail}/>
      <Category data={data.frontmatter.category}/>
      <Link className={cardStyles.styledLink} to={`/${_.kebabCase(data.frontmatter.permalink)}`}>
      {data.frontmatter.title}
      </Link>
    </div>
  </article>
);

export default Card;
