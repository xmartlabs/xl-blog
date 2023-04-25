import React, { useEffect, useContext } from "react";
import { graphql } from "gatsby";

import { Card } from '../components/card';
import { Pager } from '../components/pager';
import { AppContext, BannerType } from '../config/context';

import * as blogListStyles from "./blog-list.module.scss";

const BlogList = ({ pageContext, data }) => {
  const _ = require("lodash")    
  const { edges, totalCount } = data.allMdx;
  const { setState } = useContext(AppContext);

  useEffect(() => {
    setState(BannerType.home);
  }, []);

  return (
    <>
      <div className={blogListStyles.container} >
        {edges.map(({ node }) => <Card data={node} key={node.id} category={true} /> )}
      </div>
      <Pager pageContext={pageContext}/>
    </>
  );
};

export default BlogList;

export const blogListQuery = graphql`
  query blogListQuery($skip: Int!, $limit: Int!) {
    allMdx(
    sort: { fields: [frontmatter___date], order: DESC }
    limit: $limit
    skip: $skip
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
