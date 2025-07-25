import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { graphql, Link } from 'gatsby';

import AuthorsYAMLData from '../../content/authors.yaml';
import { Category } from '../components/category';
import { classnames, findTitles, useCategory } from '../helpers';
import { AuthorSerializer } from '../serializer';
import { SocialElement } from '../components/social-element';
import {
  ClockIcon,
  Facebook,
  InstagramIcon,
  Linkedin,
  TwitterIcon,
} from '../components/icons';
import { MoreBlogsSection } from '../components/more-blogs-section';
import { Tags } from '../components/tags/tags';
import { TitleBlogIndex } from '../components/title-blog-index/title-blog-index';
import { Seo } from '../components/seo/seo';

import * as styles from '../css/blog-post.module.scss';

const _ = require('lodash');

const getPathname = () => {
  if (typeof window !== 'undefined') {
    return window.location.pathname;
  }
  return '';
};

const BlogPost = ({ data, children }) => {
  const author = AuthorsYAMLData.find(
    ({ author }) => author === data.mdx.frontmatter.author
  );
  const authorBlog = AuthorSerializer.deSerialize(author);
  const [disappearSocial, setDisappearSocial] = useState(false);
  const refMoreFrom = useRef(null);
  const refIndexTitles = useRef(null);
  const categoryBlog = useCategory(data.mdx.frontmatter.category);
  const [disappearIndex, setDisappearIndex] = useState(false);

  const shareBlogPostLinks = [
    {
      path: `https://twitter.com/intent/tweet?url=https%3A%2F%2Fblog.xmartlabs.com${getPathname()}`,
      icon: <TwitterIcon />,
      id: 'socialSharePostTwitter',
    },
    {
      path: `https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fblog.xmartlabs.com${getPathname()}`,
      icon: <Facebook />,
      id: 'socialSharePostFacebook',
    },
    {
      path: `https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fblog.xmartlabs.com${getPathname()}`,
      icon: <Linkedin />,
      id: 'socialSharePostLinkedIn',
    },
  ];

  const shareXlProfileLinks = [
    {
      path: 'https://www.instagram.com/xmartlabs',
      icon: <InstagramIcon />,
      id: 'socialMenuInstagram',
    },
    {
      path: 'https://www.linkedin.com/company/xmartlabs/mycompany/',
      icon: <Linkedin />,
      id: 'socialProfileLinkedIn',
    },
    {
      path: 'https://twitter.com/xmartlabs',
      icon: <TwitterIcon />,
      id: 'socialProfileTwitter',
    },
    {
      path: 'https://es-la.facebook.com/xmartlabs/',
      icon: <Facebook />,
      id: 'socialProfileFacebook',
    },
  ];

  useEffect(() => {
    setDisappearIndex(true);
    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScroll = () => {
    const moreFromXlSize = refMoreFrom?.current?.clientHeight || 0;
    const isInbottom =
      Math.ceil(window.innerHeight + window.scrollY + moreFromXlSize + 1000) >=
      document.documentElement.scrollHeight;
    const isInTop = document.documentElement.scrollTop < 650;

    if (isInbottom) {
      setDisappearSocial(true);
    } else {
      if (!disappearSocial) {
        setDisappearSocial(false);
      }
    }
    if (isInTop || isInbottom) {
      setDisappearIndex(true);
    } else {
      if (!disappearIndex) {
        setDisappearIndex(false);
      }
    }
  };

  const getTitles = () => {
    if (
      typeof window !== 'undefined' &&
      typeof window.document !== 'undefined'
    ) {
      if (refIndexTitles.current) {
        const elementList = Array.from(refIndexTitles.current.childNodes);
        const titlesList = findTitles(elementList);
        return titlesList;
      }
      return null;
    }
    return null;
  };

  const imgUrl = data.mdx.frontmatter.thumbnail
    ? data.mdx.frontmatter.thumbnail.includes('/images')
      ? data.mdx.frontmatter.thumbnail
      : `/${data.mdx.frontmatter.thumbnail}`
    : '../../images/image.png';

  return (
    <div onScroll={handleScroll} id="containerDiv">
      <div className={styles.indexContainer}>
        <TitleBlogIndex
          data={getTitles()}
          disappearIndex={disappearIndex}
          refIndexTitles={refIndexTitles}
        />
      </div>
      <SocialElement
        className={classnames(
          disappearSocial ? styles.socialDisappear : styles.socialAppear,
          styles.blogIcons,
          { [styles.socialDisappear]: disappearIndex }
        )}
        links={shareBlogPostLinks}
      />
      <div className={styles.bannerContainer}>
        <div className={styles.categoryTagsContainer}>
          <Category
            data={categoryBlog.displayName}
            className={styles.category}
          />
        </div>
        <h1
          className={classnames(
            styles.titleContainer,
            'text__heading__one__blueOne'
          )}
        >
          {data.mdx.frontmatter.title}
        </h1>
        <div className={styles.authorContainer}>
          <div className={styles.authorInformation}>
            <img
              src={`/images/${authorBlog.image}`}
              alt={authorBlog.displayName}
              className={styles.authorImage}
            />
            <div className={styles.nameDateTimeContainer}>
              <Link
                className={classnames(
                  styles.authorName,
                  'text__paragraph__bold__blueOne'
                )}
                to={author.profile_url}
              >
                {authorBlog.displayName}
              </Link>
              <label
                className={classnames(
                  styles.postDate,
                  'text__label__bold__grayTwo'
                )}
              >
                {data.mdx.frontmatter.date}
              </label>
              <label
                className={classnames(
                  'text__label__bold__grayTwo',
                  styles.timeToRead
                )}
              >
                <ClockIcon className={styles.clockIcon} />
                {data.mdx.fields.timeToRead.text}
              </label>
            </div>
          </div>
        </div>
      </div>
      <img
        src={imgUrl}
        alt="Blog Main Image"
        onError={(event) => (event.target.src = '../../images/image.png')}
        className={styles.blogMainImage}
      />
      <div className={styles.bodyPostContainer} ref={refIndexTitles}>
        {children}
      </div>
      <div className={styles.blogBottomElements}>
        <div className={styles.socialBottomContainer}>
          <SocialElement
            className={classnames(styles.socialBottom, styles.blogIcons)}
            links={shareXlProfileLinks}
          />
        </div>
        <Tags blogTags={data.mdx.frontmatter.tags} className={styles.tags} />
      </div>
      <MoreBlogsSection
        relatedPosts={data.mdx.relatedPosts}
        refMoreFrom={refMoreFrom}
        title={categoryBlog.displayName}
      />
    </div>
  );
};

export const Head = ({ data }) => {
  //   // Mailchimp newsletter popup
  return (
    <Seo
      seoImageUrl={data.mdx.frontmatter.thumbnail}
      title={data.mdx.frontmatter.title}
      pathname={`/blog/${data.mdx.frontmatter.permalink}`}
    >
      <script
        id="mcjs"
        src={
          '!function(c,h,i,m,p){m=c.createElement(h),p=c.getElementsByTagName(h)[0],m.async=1,m.src=i,p.parentNode.insertBefore(m,p)}(document,"script","https://chimpstatic.com/mcjs-connected/js/users/1015680a3007c259370b6f4e9/d1d99830b33d13826f947dbb1.js");'
        }
      />
    </Seo>
  );
};

export const query = graphql`
  query ($id: String) {
    mdx(id: { eq: $id }) {
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
`;

export default BlogPost;
