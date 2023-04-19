import * as React from 'react';
import { useContext, useEffect, useState, useRef } from 'react';
import { Disqus } from 'gatsby-plugin-disqus';

import { MDXRenderer } from 'gatsby-plugin-mdx';
import { graphql, Link } from 'gatsby';

import AuthorsYAMLData from "../../content/authors.yaml";
import { Category } from "../components/category";
import { classnames, findTitles, useCategory } from "../helpers";
import { AuthorSerializer } from '../serializer';
import { AppContext, BannerType } from '../config/context';
import { SocialElement } from '../components/social-element';
import { TwitterIcon, Facebook, Linkedin, ClockIcon, PinkCircle } from "../components/icons";
import { MoreBlogsSection } from '../components/more-blogs-section';
import { Tags } from '../components/tags/tags';

import * as styles from '../css/blog-post.module.scss';

const _ = require("lodash");

const BlogPost = ({ data }) => {
  const author = AuthorsYAMLData.find(({ author }) => (author === data.mdx.frontmatter.author));
  const authorBlog = AuthorSerializer.deSerialize(author);
  const { setState } = useContext(AppContext);
  const [ disappearSocial, setDisappearSocial ] = useState(false);
  const refMoreFrom = useRef(null);
  const categoryBlog = useCategory(data.mdx.frontmatter.category);
  const [ selectLink, setSelectLink ] = useState('');
  const [ disappearIndex, setDisappearIndex ] = useState(false);

  const checkWindow = () => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '';
  }

  const checkWindowOrigin = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  }

  const shareBlogPostLinks = [
    {
      path: `https://twitter.com/intent/tweet?url=URL&text=${checkWindow()}`, 
      icon: <TwitterIcon />,
      id: "socialSharePostTwitter"
    },
    {
      path: `https://www.facebook.com/sharer/sharer.php?u=https://blog.xmartlabs.com/blog${checkWindow()}`, 
      icon: <Facebook />,
      id: "socialSharePostFacebook"
    },
    {
      path: `https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fblog.xmartlabs.com%2Fblog%2F${checkWindow()}%2F`,
      icon: <Linkedin />,
      id: "socialSharePostLinkedIn"
    }
  ];
  
  const shareXlProfileLinks = [
    {
      path: "https://twitter.com/xmartlabs", 
      icon: <TwitterIcon />,
      id: "socialProfileTwitter"
    },
    {
      path: "https://es-la.facebook.com/xmartlabs/", 
      icon: <Facebook />,
      id: "socialProfileFacebook"
    },
    {
      path: "https://www.linkedin.com/company/xmartlabs/mycompany/", 
      icon: <Linkedin />,
      id: "socialProfileLinkedIn"
    }
  ];

  useEffect(() => {
    setState(BannerType.blog);
    setDisappearIndex(true)
    window.addEventListener('scroll', handleScroll, {
      passive: true
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  const handleScroll = () => {
    const moreFromXlSize = refMoreFrom?.current?.clientHeight || 0;
    const isInbottom = Math.ceil(window.innerHeight + window.scrollY + moreFromXlSize + 1000) >= document.documentElement.scrollHeight;
    const isInTop = document.documentElement.scrollTop < 1200;
    
    if (isInbottom) {
      setDisappearSocial(true);
    } else {
      if (!disappearSocial) {
        setDisappearSocial(false);
      }
    };
    if (isInTop || isInbottom) {
      setDisappearIndex(true);
    } else {
      if (!disappearIndex) {
        setDisappearIndex(false);
      }
    }
  };

  const getTitles = () => {
    if (typeof window !== 'undefined' && typeof window.document !== "undefined") {
      const postContainer = document.getElementById('postContainer');
      if (postContainer) {
        const elementList = Array.from(postContainer.childNodes);
        const titlesList = findTitles(elementList);
        return (
          <div className={classnames({[styles.disappearIndex]: disappearIndex}, styles.indexSubContainer)}>
            {titlesList.map((title) => 
              <><div>{title.id === selectLink && <PinkCircle className={styles.pinkCircle} />}</div><a href={"#" + title.id} key={title.id} onClick={() => setSelectLink(title.id)}
                className={classnames(
                  { [styles.selectedLink]: title.id === selectLink },
                  styles.links
                )}
              >
                {title.innerHTML.length > 55 ? title.innerHTML.slice(0, 55) + "..." : title.innerHTML}
              </a></>
            )}
          </div>
        );    
      }
      return null;
    }
    return null;
  };

  const disqusConfig = {
    url: `${checkWindowOrigin()}${data.mdx.frontmatter.permalink}`,
    identifier: data.mdx.slug,
    title: data.mdx.frontmatter.title,
  }

  return (
    <div onScroll={handleScroll}>
      <div className={styles.indexContainer}>
        {getTitles()}
      </div>
      <SocialElement className={classnames(disappearSocial ? styles.socialDisappear : styles.socialAppear, styles.blogIcons, {[styles.socialDisappear]: disappearIndex})} links={shareBlogPostLinks} />
        <div className={styles.bannerContainer}>
          <div className={styles.categoryTagsContainer}>
            <Category data={categoryBlog.displayName} className={styles.category}/>
          </div>
          <h1 className={classnames(styles.titleContainer, "text__heading__one__black")}>
            { data.mdx.frontmatter.title }
          </h1>
          <div className={styles.authorContainer}>
            <div className={styles.authorInformation}>
              <img src={`images/${authorBlog.image}`} alt="" className={styles.authorImage} />
              <Link className={classnames(styles.authorName, "text__paragraph__bold__black")} to={`/authors/${ _.kebabCase(authorBlog.author) }`}>{ authorBlog.displayName }</Link>
            </div>
            <div className={styles.blogInfoContainer}>
              <label className={classnames(styles.postDate, "text__label__bold__grayTwo")} >{data.mdx.frontmatter.date}</label>
              <ClockIcon className={styles.clockIcon} />
              <label className={classnames("text__label__bold__grayTwo", styles.timeToRead)} >
                {data.mdx.timeToRead} min read
              </label>
            </div>
          </div>
        </div>
        <div>
          <img src={data.mdx.frontmatter.thumbnail} onError={(event) => event.target.src = '../../images/image.png'} className={styles.blogMainImage} />
          <div className={styles.bodyPostContainer} id="postContainer">
            <MDXRenderer>
              {data.mdx.body}
            </MDXRenderer>
          </div>
        </div>
        <div className={styles.blogBottomElements}>
          <div className={styles.socialBottomContainer}>
            <span className={classnames('text__paragraph__bold__grayTwo', styles.sharePosition)}>Share:</span>
            <SocialElement className={classnames(styles.socialBottom, styles.blogIcons)} links={shareXlProfileLinks} />
          </div>
          <Tags blogTags={data.mdx.frontmatter.tags} className={styles.tags} />
        </div>
      <MoreBlogsSection data={data} refMoreFrom={refMoreFrom} title={categoryBlog.displayName} category={BannerType.blog}/>
      <div className={styles.disqusSection}>
        <h3 className={styles.disqusTitle}>Comments:</h3>
        <div id="disqus_thread">
          <Disqus config={disqusConfig} />
        </div>
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
        permalink
        thumbnail
      }
      body
      timeToRead
      slug
      relatedPosts {
        frontmatter {
          title
          date(formatString: "MMMM D, YYYY")
          author
          category
          tags
          permalink
          thumbnail
        }
      }
    }
  }
`

export default BlogPost; 
