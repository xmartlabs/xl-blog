import React from "react";
import _ from "lodash";

import { Link } from "gatsby";

import { Category } from "../category";
import { useCategory } from '../../helpers';

import * as styles from "./top-post-home.module.scss";

const TopPostHome = ({ data }) => {
  const categoryBlog = useCategory(data.frontmatter.category);

  const urlImages = () => {
    if (typeof window !== 'undefined') {
      const imageUrl = window.location.origin;
      return `${imageUrl}/${data.frontmatter.thumbnail}`;
    }
    return data.frontmatter.thumbnail;
  }

  return (
    <article className={styles.container}>
      <img alt="Blog Cover" className={styles.image} src={urlImages()} onError={(event) => event.target.src = '../../images/generic.jpg'} />
      <div className={styles.infoContainer}>
        <Link to={`/${_.kebabCase(data.frontmatter.permalink)}`}>{data.frontmatter.title}</Link>
        <Category data={categoryBlog.displayName} />
      </div>
    </article>
  );
};

export { TopPostHome };
