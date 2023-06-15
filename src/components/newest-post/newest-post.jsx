import React from "react";
import { useStaticQuery, graphql } from "gatsby";

import { classnames, useCategory } from '../../helpers';
import { useMediaQuery } from "../../hooks";

import { Category } from "../category";

import * as styles from "./newest-post.module.scss";

const NewestPost = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const dataNP = useStaticQuery(graphql`
    query NewestPost {
      allMdx(limit: 1, sort: {frontmatter: {date: DESC}}) {
        edges {
          node {
            fields {
              slug
            }
            id
            frontmatter {
              title
              category
              permalink
              thumbnail
              excerpt
            }
            body
          }
        }
      }
    }
  `)

  const { edges } = dataNP.allMdx;
  const data = edges[0].node;

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
        <h1 className={classnames(isMobile ? "text__heading__two__black" :"text__comment__title__black", styles.title)}>
          {data.frontmatter.title}
        </h1>
        <div className={styles.imgContainer}>
          <img src={urlImages()} onError={(event) => event.target.src = '../../images/generic.jpg'} className={styles.img} />
        </div>
        <p className={classnames("text__paragraph__two__blueTwo", styles.cardLabel)}>
          {data.frontmatter.excerpt}
        </p>
        <a href={data.frontmatter.permalink} className={classnames("text__link__big__xlPink", styles.readBlog)}> → Read Article</a>
      </article>
    </>
  );
};

export { NewestPost };
