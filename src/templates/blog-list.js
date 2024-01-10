import React from "react";
import { graphql } from "gatsby";

import { BlogList as BlogListComponent } from "../components/blog-list/blog-list"

const BlogList = (props) => {
  return <BlogListComponent {...props} />;
};
export default BlogList;

export const blogListQuery = graphql`
  query($category: String, $limit: Int, $skip: Int) {
    allMdx(
      limit: $limit
      sort: {frontmatter: {date: DESC}}
      filter: {frontmatter: {category: {eq: $category}}}
      skip: $skip
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
  }
`
