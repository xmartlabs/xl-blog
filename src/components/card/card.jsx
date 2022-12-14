import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import { Link } from "gatsby";

import { Category } from "../category";

import * as cardStyles from "./card.module.scss";
import { useContext } from "react";
import { AppContext, BannerType } from "../../config/context";

const Card = ({ data }) => {
  return (
    <article key={data.id} className={cardStyles.container}>
      <img className={cardStyles.styledImage} src={data.frontmatter.thumbnail}/>
      <Category data={data.frontmatter.category}/>
      <Link className={cardStyles.styledLink} to={`/${_.kebabCase(data.frontmatter.permalink)}`} >
        {data.frontmatter.title}
      </Link>
    </article>
  )
};


Card.propTypes = {
  data: PropTypes.object.isRequired,
};

export { Card };
