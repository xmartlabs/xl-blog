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
    const isInTop = document.documentElement.scrollTop < 750;

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
      <div className="flex justify-end">
        <TitleBlogIndex
          data={getTitles()}
          disappearIndex={disappearIndex}
          refIndexTitles={refIndexTitles}
        />
      </div>
      <SocialElement
        className={classnames(
          disappearSocial
            ? 'transition-[transform,opacity] duration-500 ease-in-out opacity-0'
            : 'transition-[transform,opacity] duration-500 ease-in-out opacity-100',
          '[&_a]:flex [&_a]:items-center [&_a]:m-[0.7rem]',
          {
            'transition-[transform,opacity] duration-500 ease-in-out opacity-0':
              disappearIndex,
          }
        )}
        links={shareBlogPostLinks}
      />
      <div className="p-[10rem_44%_20rem_16%] bg-blue-six max-lg:p-[10rem_27%_20rem_16%] max-sm:min-h-full max-sm:p-[8rem_1rem_6rem_5%]">
        <div className="flex flex-row items-baseline">
          <Category
            data={categoryBlog.displayName}
            className="flex justify-center text-[0.8rem] leading-[2rem] font-black text-blue-one bg-neutral-100 mb-4 w-auto px-4 h-[1.8rem] uppercase tracking-[0.1rem] max-sm:w-auto max-sm:px-4 max-sm:h-[1.5rem] max-sm:leading-[1.7rem]"
          />
        </div>
        <h1 className="my-2 mx-0 text-heading-one text-blue-one font-link max-sm:m-0">
          {data.mdx.frontmatter.title}
        </h1>
        <div className="w-full">
          <div className="flex flex-row mt-8">
            <img
              src={`/images/${authorBlog.image}`}
              alt={authorBlog.displayName}
              className="rounded-[10px] mr-8 w-[5.5rem] h-full"
            />
            <div className="flex flex-col items-start justify-between">
              <Link
                className={'no-underline font-link font-bold'}
                to={author.profile_url}
              >
                {authorBlog.displayName}
              </Link>
              <label className="w-auto text-label-bold text-gray-two font-semibold">
                {data.mdx.frontmatter.date}
              </label>
              <label className="w-auto text-label-bold text-gray-two font-semibold">
                <ClockIcon className="mr-[0.5rem] inline" />
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
        className="transform translate-y-[-230px] ml-[16%] mb-20 w-[48.5rem] max-w-[78vh] h-auto max-sm:transform max-sm:-translate-y-12 max-sm:m-0 max-sm:w-full max-sm:h-auto"
      />
      <div className="bodyPostContainer" ref={refIndexTitles}>
        {children}
      </div>
      <div className="flex flex-row-reverse justify-start items-baseline p-[5rem_33%_2rem_16%] max-xxl:pr-[41%] max-lg:pr-[10%] max-sm:flex-col max-sm:p-0">
        <div className="flex flex-row justify-end max-sm:justify-start">
          <SocialElement
            className="flex flex-row static items-center w-full z-0 max-sm:w-auto [&_a]:flex [&_a]:items-center [&_a]:m-[0.7rem]"
            links={shareXlProfileLinks}
          />
        </div>
        <Tags
          blogTags={data.mdx.frontmatter.tags}
          className="max-sm:w-[90%] max-sm:mt-4 max-sm:ml-4"
        />
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
