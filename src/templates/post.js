import * as React from 'react';
import { useContext, useEffect, useState, useRef } from 'react';
import { Disqus } from 'gatsby-plugin-disqus';
import { graphql, Link } from 'gatsby';

import AuthorsYAMLData from "../../content/authors.yaml";
import { Category } from "../components/category";
import { classnames, findTitles, useCategory } from "../helpers";
import { AuthorSerializer } from '../serializer';
import { AppContext, BannerType } from '../config/context';
import { SocialElement } from '../components/social-element';
import { TwitterIcon, Facebook, Linkedin, ClockIcon, InstagramIcon} from "../components/icons";
import { MoreBlogsSection } from '../components/more-blogs-section';
import { Tags } from '../components/tags/tags';

import * as styles from '../css/blog-post.module.scss';

const _ = require("lodash");

const BlogPost = ({ data, children }) => {
  const author = AuthorsYAMLData.find(({ author }) => (author === data.mdx.frontmatter.author));
  const authorBlog = AuthorSerializer.deSerialize(author);
  const { setState } = useContext(AppContext);
  const [ disappearSocial, setDisappearSocial ] = useState(false);
  const refMoreFrom = useRef(null);
  const refIndexTitles = useRef(null);
  const categoryBlog = useCategory(data.mdx.frontmatter.category);
  const [ selectLink, setSelectLink ] = useState('');
  const [ disappearIndex, setDisappearIndex ] = useState(false);
  const [ titleOnView, setTitleOnView ] = useState('');

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
      path: "https://www.instagram.com/xmartlabs", 
      icon: <InstagramIcon />,
      id: "socialMenuInstagram"
    },
    {
      path: "https://www.linkedin.com/company/xmartlabs/mycompany/", 
      icon: <Linkedin />,
      id: "socialProfileLinkedIn"
    },
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
  ];

  useEffect(() => {
    setState(BannerType.blog);
    setDisappearIndex(true);
    window.addEventListener('scroll', handleScroll, {
      passive: true
    });

    window.addEventListener('scroll', getActiveTitle, {
      passive: true
    });

    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 1);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', getActiveTitle);
    };
  }, [])


  const handleScroll = () => {
    const moreFromXlSize = refMoreFrom?.current?.clientHeight || 0;
    const isInbottom = Math.ceil(window.innerHeight + window.scrollY + moreFromXlSize + 1000) >= document.documentElement.scrollHeight;
    const isInTop = document.documentElement.scrollTop < 1000;
    
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

  const getActiveTitle = () => {
    if (typeof window !== 'undefined') {
      if (refIndexTitles.current) {
        const elementList = Array.from(refIndexTitles.current.childNodes);
        const titles = findTitles(elementList);
        const scrollPosition = window.scrollY;
        let activeTitle = titles[0];
        titles.forEach(title => {
          const titleTop = title.getBoundingClientRect().top + window.scrollY - 500;
          if (scrollPosition >= titleTop) {
            activeTitle = title;
          }
        });
        setTitleOnView(activeTitle?.textContent);
        setSelectLink('');
      }
    }
  };

  const getTitles = () => {
    if (typeof window !== 'undefined' && typeof window.document !== "undefined") {
      if (refIndexTitles.current) {
        const elementList = Array.from(refIndexTitles.current.childNodes);
        const titlesList = findTitles(elementList);
        return (
          <div className={classnames({[styles.disappearIndex]: disappearIndex}, styles.indexSubContainer)}>
            {titlesList.map((title) => 
              <a href={"#" + title.id} key={title.id} onClick={() => setSelectLink(title.id)}
                className={classnames(
                  { [styles.selectedLink]: title.id === selectLink || titleOnView === title.id},
                  styles.links
                )}
              >
                {title.innerText.length > 55 ? title.innerText.slice(0, 55) + "..." : title.innerText}
              </a>
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

  const imgUrl = () => {
    if(data.mdx.frontmatter.thumbnail) {
      if (data.mdx.frontmatter.thumbnail.includes("/images")) {
        return data.mdx.frontmatter.thumbnail;
      } else {
        return `/${data.mdx.frontmatter.thumbnail}`;
      }
    } else {
      return '../../images/image.png';
    }
  }

  return (
    <div onScroll={handleScroll} id='containerDiv'>
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
            <img src={`/images/${authorBlog.image}`} alt="" className={styles.authorImage} />
            <Link className={classnames(styles.authorName, "text__paragraph__bold__black")} to={author.profile_url}>{ authorBlog.displayName }</Link>
          </div>
          <div className={styles.blogInfoContainer}>
            <label className={classnames(styles.postDate, "text__label__bold__grayTwo")} >{data.mdx.frontmatter.date}</label>
            <ClockIcon className={styles.clockIcon} />
            <label className={classnames("text__label__bold__grayTwo", styles.timeToRead)} >
              {data.mdx.fields.timeToRead.text}
            </label>
          </div>
        </div>
      </div>
        <img src={imgUrl()} onError={(event) => event.target.src = '../../images/image.png'} className={styles.blogMainImage} />
        <div className={styles.bodyPostContainer} ref={refIndexTitles}>
          {children}
        </div>
        <div className={styles.blogBottomElements}>
          <div className={styles.socialBottomContainer}>
            <SocialElement className={classnames(styles.socialBottom, styles.blogIcons)} links={shareXlProfileLinks} />
          </div>
          <Tags blogTags={data.mdx.frontmatter.tags} className={styles.tags} />
        </div>
        <MoreBlogsSection relatedPosts={data.mdx.relatedPosts} refMoreFrom={refMoreFrom} title={categoryBlog.category}/>
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
    fields {
      slug
      timeToRead {
        text
      }
    }
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
