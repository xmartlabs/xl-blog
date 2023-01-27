import React from "react";

import { graphql, Link, useStaticQuery } from "gatsby";

import { classnames } from "../../helpers";

import { Card } from "../../components/card";

import * as styles from './more-from-xl-blog.module.scss';

export const MoreFromXlBlog = () => {
  const data = useStaticQuery(graphql`
    query MoreFromXlQuery {
      allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: 3
      ) {
        edges {
          node {
            id
            frontmatter {
              date(formatString: "MMMM D, YYYY")
              title
              author
              category
              tags
              permalink
              thumbnail
            }
            body
            slug
          }
        }
      }
    }
  `)
  const { edges } = data.allMdx
  return (
    <div className={styles.moreFromXlContainer}>
      <div className={styles.titleContainer}>
        <Link to="/" className={classnames("text__heading__three__blueTwo", styles.titleStyle)}>More From Xmartlabs Blog →</Link>
      </div>
      <div className={styles.blogsContainer}>
        {edges.map(({node}) => <Card data={node} className={styles.cardStyles}/>)}
      </div>
    </div>
  );
}
