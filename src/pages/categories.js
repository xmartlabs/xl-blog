import React from 'react';
import { graphql } from 'gatsby';

import { BlogList } from '/src/components/blog-list/blog-list';
import { HeaderBanner } from '/src/components/header-banner';

const CategoriesPage = (props) => {
  return (
    <>
      <HeaderBanner />
      <BlogList {...props} />;
    </>
  );
};

export default CategoriesPage;

export const blogListQuery = graphql`
  query ($category: String, $limit: Int, $skip: Int) {
    allMdx(
      limit: $limit
      sort: { frontmatter: { date: DESC } }
      filter: { frontmatter: { category: { eq: $category } } }
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
`;
