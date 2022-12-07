import * as React from 'react';

import { MDXRenderer } from 'gatsby-plugin-mdx';
import { graphql, Link } from 'gatsby';

import AuthorsYAMLData from "../../content/authors.yaml";
import CategoriesYAMLDATA from "../../content/categories.yaml";
import { Category } from "../components/category";

import * as styles from './blog-post.module.scss';

const _ = require("lodash")

const BlogPost = ({ data }) => {
  const author = AuthorsYAMLData.find(author => { return author.author === data.mdx.frontmatter.author });
  const category = CategoriesYAMLDATA.find(category => { return category.category === data.mdx.frontmatter.category });

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <Category data={category.display_name}/>
        <div className={styles.titleContainer}>
          { data.mdx.frontmatter.title }
        </div>
        <div className={styles.authorContainer}>
          <div className={styles.authorInformation}>
            <div className={styles.authorImage}>
              <img src={author.image} />
            </div>
            <Link className={styles.authorName} to={`/authors/${ _.kebabCase(author.author) }`}>{ author.display_name }</Link>
            </div>
          <div className={styles.postDateContainer}>
            <p className={styles.postDate}>{data.mdx.frontmatter.date}</p>
          </div>
        </div>
      </div>
      <div className={styles.bodyPostContainer}>
        <MDXRenderer>
          {data.mdx.body}
        </MDXRenderer>
      </div>
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
