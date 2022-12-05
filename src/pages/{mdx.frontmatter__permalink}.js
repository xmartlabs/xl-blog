import * as React from 'react';

import { MDXRenderer } from 'gatsby-plugin-mdx';
import { graphql, Link } from 'gatsby';

import AuthorsYAMLData from "../../content/authors.yaml";
import CategoriesYAMLDATA from "../../content/categories.yaml";

import * as blogPostStyles from './blog-post.module.scss';

const _ = require("lodash")

const BlogPost = ({ data }) => {
  const author = AuthorsYAMLData.find(author => { return author.author === data.mdx.frontmatter.author })
  const category = CategoriesYAMLDATA.find(category => { return category.category === data.mdx.frontmatter.category })
  return (
    <div className={blogPostStyles.container}>
      <div className={blogPostStyles.headerContainer}>
        <div className={blogPostStyles.typePost}>
          {category.category}
        </div>
        <div className={blogPostStyles.categoryContainer}>
          <Link to={`/categories/${ _.kebabCase(category.category) }`}>{ category.title }</Link>
        </div>
        <div className={blogPostStyles.authorContainer}>
          <Link to={`/authors/${ _.kebabCase(author.author) }`}>{ author.display_name }</Link>
          <div className={blogPostStyles.authorImage}>
            { author.image }
          </div>
          <div className={blogPostStyles.authorUrl}>
            { author.profile_url }
          </div>
          <p className={blogPostStyles.postDate}>{data.mdx.frontmatter.date}</p>
        </div>
      </div>
      <MDXRenderer>
        {data.mdx.body}
      </MDXRenderer>
    </div>
  )
}

export const query = graphql`
  query ($id: String) {
    mdx(id: {eq: $id}) {
      frontmatter {
        title
        date(formatString: "MMMM D, YYYY")
        author
        category
        tags
      }
      body
    }
  }
`

export default BlogPost
