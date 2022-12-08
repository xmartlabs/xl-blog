import * as React from 'react';

import { MDXRenderer } from 'gatsby-plugin-mdx';
import { graphql, Link } from 'gatsby';

import AuthorsYAMLData from "../../content/authors.yaml";
import CategoriesYAMLDATA from "../../content/categories.yaml";
import { Category } from "../components/category";

import * as styles from '../css/blog-post.module.scss';

const _ = require("lodash");

const BlogPost = ({ data }) => {
  const author = AuthorsYAMLData.find(({ author }) => (author === data.mdx.frontmatter.author));
  const category = CategoriesYAMLDATA.find(({ category }) => (category === data.mdx.frontmatter.category));

  return (
    <>
      <div className={styles.headerContainer}>
        <Category data={category.display_name}/>
        <h1 className={styles.titleContainer}>
          { data.mdx.frontmatter.title }
        </h1>
        <div className={styles.authorContainer}>
          <div className={styles.authorInformation}>
            <img src={`images/${author.image}`} alt={author.display_name} className={styles.authorImage} />
            <Link className={styles.authorName} to={`/authors/${ _.kebabCase(author.author) }`}>{ author.display_name }</Link>
          </div>
          <p className={styles.postDate} >{data.mdx.frontmatter.date}</p>
        </div>
      </div>
      <div className={styles.bodyPostContainer}>
        <MDXRenderer>
          {data.mdx.body}
        </MDXRenderer>
      </div>
    </>
  );
};

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

export default BlogPost; 
