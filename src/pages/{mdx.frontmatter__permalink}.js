import * as React from 'react';
import { useContext, useEffect, useState } from 'react'

import { MDXRenderer } from 'gatsby-plugin-mdx';
import { graphql, Link } from 'gatsby';

import AuthorsYAMLData from "../../content/authors.yaml";
import { Category } from "../components/category";
import { classnames, useCategory } from "../helpers";
import { AuthorSerializer } from '../serializer';
import { AppContext, BannerType } from '../config/context';
import { SocialBlog } from '../components/social-blog';

import * as styles from '../css/blog-post.module.scss';

const _ = require("lodash");

const BlogPost = ({ data }) => {
  const author = AuthorsYAMLData.find(({ author }) => (author === data.mdx.frontmatter.author));
  const authorBlog = AuthorSerializer.deSerialize(author);
  const { setState } = useContext(AppContext);
  const [ disappearSocial, setDisappearSocial ] = useState(false);

  const categoryBlog = useCategory(data.mdx.frontmatter.category);

  useEffect(() => {
    setState(BannerType.blog);
    
    window.addEventListener('scroll', handleScroll, {
      passive: true
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScroll = () => {
    const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;
    if (bottom) {
      setDisappearSocial(true);
    } else {
      if (!disappearSocial) {
        setDisappearSocial(false);
      }
    };
  };

  const shareBlogPostLinks = {
    twitter: "https://twitter.com/share?ref_src=twsrc%5Etfw",
    facebook: "https://www.facebook.com/dialog/share?app_id=145634995501895&display=popup&href=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2F&redirect_uri=https%3A%2F%2Fdevelopers.facebook.com%2Ftools%2Fexplorer",
    linkedIn: "rhtyj",
  };
  const shareXlProfileLinks = {
    twitter: "hola",
    facebook: "<a href=`https://www.facebook.com/sharer/sharer.php?u=data.permalink`>",
    linkedIn: "tyjtyj",
  };

  return (
    <div onScroll={handleScroll}>
      <SocialBlog className={disappearSocial ? styles.socialDisappear : styles.socialAppear} links={shareBlogPostLinks} />
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
      <div className={styles.socialBottomContainer}>
        <span className={classnames('text__paragraph__bold__grayTwo', styles.sharePosition)}>Share:</span>
        <SocialBlog className={styles.socialBottom} link={shareXlProfileLinks} />
      </div>
    </div>
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
