'use client';

import React, { useEffect, useRef, useState } from 'react';

import { SocialElement } from '../social-element';
import { Facebook, Linkedin, TwitterIcon } from '../icons';
import { MORE_BLOGS_SECTION_ID } from '../more-blogs-section/more-blogs-section';
import { TitleBlogIndex } from '../title-blog-index/title-blog-index';
import { classnames, findTitles } from '../../helpers';

const POST_BODY_SELECTOR = '.bodyPostContainer';

// Interactive parts of a post page, hydrated as a single island:
// the table of contents, the fixed share links, and their show/hide-on-scroll logic.
// The post body itself is rendered statically by Astro; it is looked up after mount.
export const PostInteractions = ({ pathname }) => {
  const [disappearSocial, setDisappearSocial] = useState(false);
  const [disappearIndex, setDisappearIndex] = useState(false);
  const [titles, setTitles] = useState(null);
  const refIndexTitles = useRef(null);

  const encodedUrl = `https%3A%2F%2Fblog.xmartlabs.com${pathname}`;
  const shareBlogPostLinks = [
    {
      path: `https://twitter.com/intent/tweet?url=${encodedUrl}`,
      icon: <TwitterIcon />,
      id: 'socialSharePostTwitter',
      label: 'Share this post on X (Twitter)',
    },
    {
      path: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <Facebook />,
      id: 'socialSharePostFacebook',
      label: 'Share this post on Facebook',
    },
    {
      path: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: <Linkedin />,
      id: 'socialSharePostLinkedIn',
      label: 'Share this post on LinkedIn',
    },
  ];

  useEffect(() => {
    const body = document.querySelector(POST_BODY_SELECTOR);
    refIndexTitles.current = body;
    // The headings come from the server-rendered post body, readable only after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (body) setTitles(findTitles(Array.from(body.childNodes)));

    const handleScroll = () => {
      const moreFromXlSize =
        document.getElementById(MORE_BLOGS_SECTION_ID)?.clientHeight || 0;
      const isInbottom =
        Math.ceil(
          window.innerHeight + window.scrollY + moreFromXlSize + 1000
        ) >= document.documentElement.scrollHeight;
      const isInTop = document.documentElement.scrollTop < 750;

      setDisappearSocial(isInbottom);
      setDisappearIndex(isInTop || isInbottom);
    };

    setDisappearIndex(true);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const timeout = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div className="flex justify-end max-lg:hidden">
        <TitleBlogIndex
          data={titles}
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
    </>
  );
};
