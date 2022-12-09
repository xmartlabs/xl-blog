import * as React from 'react';

import { MDXRenderer } from 'gatsby-plugin-mdx';
import { graphql, Link } from 'gatsby';

import AuthorsYAMLData from "../../content/authors.yaml";
import CategoriesYAMLDATA from "../../content/categories.yaml";
import { Category } from "../components/category";

import * as styles from '../css/blog-post.module.scss';

import { AuthorSerializer, CategorySerializer } from '../networking';

const _ = require("lodash");

const BlogPost = ({ data }) => {
  const author = AuthorsYAMLData.find(({ author }) => (author === data.mdx.frontmatter.author));
  const authorBlog = AuthorSerializer.deSerialize(author);

  const category = CategoriesYAMLDATA.find(({ category }) => (category === data.mdx.frontmatter.category));
  const categoryBlog = CategorySerializer.deSerialize(category);

  console.log(categoryBlog);
  console.log(authorBlog)

  return (
    <>
      <div className={styles.headerContainer}>
        <Category data={categoryBlog.displayName}/>
        <h1 className={styles.titleContainer}>
          { data.mdx.frontmatter.title }
        </h1>
        <div className={styles.authorContainer}>
          <div className={styles.authorInformation}>
            <img src={`images/${authorBlog.image}`} alt="" className={styles.authorImage} />
            <Link className={styles.authorName} to={`/authors/${ _.kebabCase(authorBlog.author) }`}>{ authorBlog.displayName }</Link>
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
