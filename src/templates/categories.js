import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, graphql } from "gatsby";

import { Card } from '../components/card';

import * as styles from "./categories.module.scss";

const Categories = ({ data }) => {

  console.log(data)
  const { edges } = data.allMdx;

  return (
    <div className={styles.container}>
      {edges.map(({ node }) => <Card data={node} key={node.id} withCategory={true} />)}
    </div>
  )
}

Categories.propTypes = {
  pageContext: PropTypes.shape({
    category: PropTypes.string.isRequired,
  }),
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      totalCount: PropTypes.number.isRequired,
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
            })
          }),
        }).isRequired
      ),
    }),
  }),
}

export default  Categories;

export const pageQuery = graphql`query ($category: String) {
  allMdx(
    limit: 2000
    sort: {frontmatter: {date: DESC}}
    filter: {frontmatter: {category: {eq: $category}}}
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
      }
    }
  }
}`
