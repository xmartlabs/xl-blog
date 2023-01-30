import React from "react";

import { graphql, Link, useStaticQuery } from "gatsby";

import { classnames } from "../../helpers";

import { Card } from "../../components/card";

import * as styles from './more-from-xl-blog.module.scss';

const MoreFromXlBlog = ({ data }) => {
  const { edges } = data.allMdx;
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

export { MoreFromXlBlog };
