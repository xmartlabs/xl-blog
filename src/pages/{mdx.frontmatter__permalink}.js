import * as React from 'react';
import { useContext, useEffect, useState } from 'react'
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { graphql, Link } from 'gatsby';

import AuthorsYAMLData from "../../content/authors.yaml";
import { Category } from "../components/category";
import { classnames, useCategory } from "../helpers";
import { AuthorSerializer } from '../serializer';
import { AppContext, BannerType } from '../config/context';
import { SocialElement } from '../components/social-element';
import { TwitterIcon, Facebook, Linkedin } from "../components/icons";

import * as styles from '../css/blog-post.module.scss';

const _ = require("lodash");

const BlogPost = ({ data }) => {
  const author = AuthorsYAMLData.find(({ author }) => (author === data.mdx.frontmatter.author));
  const authorBlog = AuthorSerializer.deSerialize(author);
  const { setState } = useContext(AppContext);
  const [ disappearSocial, setDisappearSocial ] = useState(false);
  const categoryBlog = useCategory(data.mdx.frontmatter.category);

  const checkWindow = () => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return;
  }

  const shareBlogPostLinks = [
    {
      path: `https://twitter.com/intent/tweet?url=URL&text=${checkWindow()}`, 
      icon: <TwitterIcon />
    },
    {
      path: `https://www.facebook.com/sharer/sharer.php?u=https://blog.xmartlabs.com/blog${checkWindow()}`, 
      icon: <Facebook />,
    },
    {
      path: `https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fblog.xmartlabs.com%2Fblog%2F${checkWindow()}%2F`,
      icon: <Linkedin />,
    }
  ];
  
  const shareXlProfileLinks = [
    {path: "https://twitter.com/xmartlabs", icon: <TwitterIcon />},
    {path: "https://es-la.facebook.com/xmartlabs/", icon: <Facebook />},
    {path: "https://www.linkedin.com/company/xmartlabs/mycompany/", icon: <Linkedin />}
  ];

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
  
  return (
    <div onScroll={handleScroll}>
      <SocialElement className={classnames(disappearSocial ? styles.socialDisappear : styles.socialAppear, styles.blogIcons)} links={shareBlogPostLinks} />
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
        <SocialElement className={classnames(styles.socialBottom, styles.blogIcons)} links={shareXlProfileLinks} />
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
