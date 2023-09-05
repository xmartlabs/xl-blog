import React, { useEffect, useContext, useState } from "react";

import { Link, graphql } from "gatsby";

import { Pager } from '../components/pager';
import { AppContext, BannerType } from '../config/context';

import { Card } from '../components/card';

import * as styles from "./blog-list.module.scss";

const BlogList = ({ pageContext, data }) => {
  const _ = require("lodash")    
  const { edges, totalCount } = data.allMdx;
  const { setState } = useContext(AppContext);

  useEffect(() => {
    setState(BannerType.home);
  }, []);

  return (
    <>
      <div className={styles.container}>
        {edges.map(({ node }) => <Card data={node} key={node.id} withCategory={true} />)}     
      </div>
      <Pager pageContext={pageContext}/>
    </>
  );
};

export default BlogList;

export const blogListQuery = graphql`query blogListQuery($skip: Int!, $limit: Int!) {
  allMdx(sort: {frontmatter: {date: DESC}}, limit: $limit, skip: $skip) {
    totalCount
    edges {
      node {
        fields {
          slug
        }
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
      }
    }
  }
}`
