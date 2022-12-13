import * as React from 'react';

import { MDXRenderer } from 'gatsby-plugin-mdx';
import { graphql, Link } from 'gatsby';

import AuthorsYAMLData from "../../content/authors.yaml";
import CategoriesYAMLDATA from "../../content/categories.yaml";
import { Category } from "../components/category";
import { classnames } from "../helpers/utils";
import { AuthorSerializer, CategorySerializer } from '../serializer';

import * as styles from '../css/blog-post.module.scss';

const _ = require("lodash");

const BlogPost = ({ data }) => {
  const author = AuthorsYAMLData.find(({ author }) => (author === data.mdx.frontmatter.author));
  const category = CategoriesYAMLDATA.find(({ category }) => (category === data.mdx.frontmatter.category));
  const authorBlog = AuthorSerializer.deSerialize(author);
  const categoryBlog = CategorySerializer.deSerialize(category);

  return (
    <>
      <div className={styles.bannerContainer}>
        <Category data={categoryBlog.displayName}/>
        <h1 className={classnames(styles.titleContainer, "text__heading__one__black")}>
          { data.mdx.frontmatter.title }
        </h1>
        <div className={styles.authorContainer}>
          <div className={styles.authorInformation}>
            <img src={`images/${authorBlog.image}`} alt="" className={styles.authorImage} />
            <Link className={classnames(styles.authorName, "text__paragraph__bold__black")} to={`/authors/${ _.kebabCase(authorBlog.author) }`}>{ authorBlog.displayName }</Link>
          </div>
          <label className={classnames(styles.postDate, "text__label__bold__grayTwo")} >{data.mdx.frontmatter.date}</label>
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
