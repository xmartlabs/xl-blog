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
          <label>New Post</label>
        </div>
        <h1 className={classnames("text__heading__two__separated__black", styles.title)}>
          {data.frontmatter.title}
        </h1>
        <div className={styles.imgContainer}>
          <img src={urlImages()} onError={(event) => event.target.src = '../../images/generic.jpg'} className={styles.img} />
        </div>
      </article>
      <a href={data.frontmatter.permalink}> → Read Article</a>
    </>
  );
};

export { NewestPost };
