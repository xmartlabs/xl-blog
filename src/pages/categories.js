import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";

import { Pager } from '../components/pager';
import { Card } from "../components/card";

import * as styles from "./categories.module.scss";
import { NewestPost } from "../components/newest-post/newest-post";

const CategoriesPage = ({pageContext, data}) => {
  const { edges } = data.allMdx;


  return (
    <>
      <div className="topPostsContainer">
        <div className="newestContainer"><NewestPost dataCat={edges[0].node} /></div>
      </div>
      <div className={styles.container}>
        {edges.map(({ node }) => <Card data={node} key={node.id} withCategory={false} />)}
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

export const pageQuery = graphql`query($category: String, $limit: Int) {
  allMdx(
    limit: $limit
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
