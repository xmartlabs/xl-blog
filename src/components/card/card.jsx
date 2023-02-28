import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import { Link } from "gatsby";

import { Category } from "../category";
import { useCategory } from '../../helpers';

import * as styles from "./card.module.scss";

const Card = ({ data }) => {
  const categoryBlog = useCategory(data.frontmatter.category);

  const urlImages = () => {
    if (typeof window !== 'undefined') {
      const imageUrl = window.location.origin;
      return `${imageUrl}/${data.frontmatter.thumbnail}`;
    }
    return data.frontmatter.thumbnail;
  }

  return (
    <Link className={styles.styledLink} to={`/${_.kebabCase(data.frontmatter.permalink)}`}>
      <article key={data.id} className={styles.container}>
        <div className={styles.imageContainer}>
          <img className={styles.styledImage} src={urlImages()}/>
        </div>
        <Category data={categoryBlog.displayName}/>
        <h1 className="text__heading__two__separated__black">
          {data.frontmatter.title}
        </h1>
      </article>
    </Link>
  );
};

Card.propTypes = {
  data: PropTypes.object.isRequired,
};

export { Card };
