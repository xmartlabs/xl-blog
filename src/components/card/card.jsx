import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import { Link } from "gatsby";

import { Category } from "../category";
import { classnames, useCategory } from '../../helpers';

import * as styles from "./card.module.scss";

const Card = ({ data, className, keyCard }) => {
  const categoryBlog = useCategory(data.frontmatter.category);

  return (
    <Link className={classnames(styles.styledLink, className)} to={`/${_.kebabCase(data.frontmatter.permalink)}`}>
      <article key={data.id} className={styles.container} keyCard={keyCard}>
        <div className={styles.imageContainer}>
          <img className={styles.styledImage} src={data.frontmatter.thumbnail}/>
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
  className: PropTypes.string,
};

Card.defaultProps = {
  className: '',
}

export { Card };
