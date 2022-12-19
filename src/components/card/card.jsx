import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import { Link } from "gatsby";

import { Category } from "../category";
import CategoriesYAMLDATA from "../../../content/categories.yaml";
import { CategorySerializer } from '../../serializer';

import * as styles from "./card.module.scss";

const Card = ({ data }) => {

  const category = CategoriesYAMLDATA.find(({ category }) => (category === data.frontmatter.category));
  const categoryBlog = CategorySerializer.deSerialize(category);

  return (
    <Link className={styles.styledLink} to={`/${_.kebabCase(data.frontmatter.permalink)}`}>
      <article key={data.id} className={styles.container}>
        <img className={styles.styledImage} src={data.frontmatter.thumbnail}/>
        <Category data={categoryBlog.displayName}/>
        <h1 className={styles.title}>
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
