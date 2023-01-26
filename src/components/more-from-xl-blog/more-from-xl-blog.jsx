import React from "react";

import { graphql, Link } from "gatsby";

import { classnames } from "../../helpers";

import * as styles from './more-from-xl-blog.module.scss';
import { Card } from "../card";

const MoreFromXlBlog = ({data}) => {
  const { edges } = data.allMdx;

  return (
    <div className={styles.moreFromXlContainer}>
      <div className={styles.titleContainer}>
        <Link to="" className={classnames("text__heading__three__blueTwo", styles.titleStyle)}>More From Xmartlabs Blog →</Link>
      </div>
      <div className={styles.blogsContainer}>
        {edges.map(({node}) => <Card data={node}/>)}
      </div>
    </div>
  );
};

export { MoreFromXlBlog };

export const moreFromXlQuery = graphql`
  query moreFromXlQuery($limit: Int) {
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC}
      limit: 3
      filter: {frontmatter: {category: {eq: "develop"}}}
    ) {
      totalCount
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
`
