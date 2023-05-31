import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, graphql } from "gatsby";

import { Pager } from '../components/pager';
import { Card } from "../components/card";

import * as styles from "./categories.module.scss";

const CategoriesPage = ({pageContext, data}) => {
  const { edges } = data.allMdx;


  return (
    <>
      <div className={styles.container}>
        {edges.map(({ node }) => <Card data={node} key={node.id} withCategory={true} />)}
      </div>
      <Pager pageContext={pageContext}/>
    </>
  )
};

CategoriesPage.propTypes = {
  data: PropTypes.shape({
    allMd: PropTypes.shape({
      group: PropTypes.arrayOf(
        PropTypes.shape({
          fieldValue: PropTypes.string.isRequired,
          totalCount: PropTypes.number.isRequired,
        }).isRequired
      ),
    }),
  }),
}

export default CategoriesPage;

export const pageQuery = graphql`query($category: String, $skip: Int!, $limit: Int!) {
  allMdx(
    limit: $limit
    skip: $skip
    sort: {frontmatter: {date: DESC}}
    filter: {frontmatter: {category: {eq: $category}}}
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
      }
    }
  }
}`
