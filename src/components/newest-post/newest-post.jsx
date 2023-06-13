import React from "react";

import { classnames, useCategory } from '../../helpers';

import { Category } from "../category";

import * as styles from "./newest-post.module.scss";

const NewestPost = ({ data }) => {
  const categoryBlog = useCategory(data.frontmatter.category);
  
  const urlImages = () => {
    if (typeof window !== 'undefined') {
      const imageUrl = window.location.origin;
      return `${imageUrl}/${data.frontmatter.thumbnail}`;
    }
    return data.frontmatter.thumbnail;
  }

  return (
    <>
      <article className={styles.container}>
        <div className={styles.categoryContainer}>
          <Category data={categoryBlog.displayName} className={styles.category} />
          <label className="text__paragraph__small__xlPink">New Post</label>
        </div>
        <h1 className={classnames("text__comment__title__black", styles.title)}>
          {data.frontmatter.title}
        </h1>
        <div className={styles.imgContainer}>
          <img src={urlImages()} onError={(event) => event.target.src = '../../images/generic.jpg'} className={styles.img} />
        </div>
        <p className={classnames("text__paragraph__two__blueTwo", styles.cardLabel)}>
          Xmartlabs provided development services to improve the performance
          of machine learning models for a wine cellar management system.
        </p>
        <a href={data.frontmatter.permalink} className={classnames("text__link__big__xlPink", styles.readBlog)}> → Read Article</a>
      </article>
    </>
  );
};

export { NewestPost };
