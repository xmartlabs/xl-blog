import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';

import { Pager } from '../pager';
import { Card } from '../card';
import { ErrorSafeLocalStorage, classnames } from '../../helpers';

const Categories = {
  all: 'All',
  development: 'Development',
  'product-design': 'Design',
  'machine-learning': 'Machine\u00a0Learning',
  'people-events': 'People',
  strategy: 'Strategy',
  qa: 'QA',
};

export const BlogList = ({ pageContext, data, location: { pathname } }) => {
  const selectedCategory = pathname.startsWith('/categories/')
    ? pathname.split('/')[2]
    : 'all';

  const posts = data?.allMdx?.edges || [];

  // Scroll to desired page height
  const categoryFiltersRef = useRef(null);
  useEffect(() => {
    const scrollTo = ErrorSafeLocalStorage.getItem('scrollTo');
    if (!scrollTo) return;

    ErrorSafeLocalStorage.removeItem('scrollTo');

    const timeout = setTimeout(() => {
      if (scrollTo === 'categories') {
        // Place filters at the top of the viewport and scroll down to account for the navbar
        categoryFiltersRef.current?.scrollIntoView({ behavior: 'instant' });
        window.scrollBy(0, -140);
      } else {
        window.scrollTo(0, Number(scrollTo));
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <>
      <div
        className="
          w-full max-w-full flex flex-row flex-nowrap 
          md:m-[8rem_0_5rem_0] md:gap-[6%] md:items-center md:justify-center 
          max-md:gap-[3rem] max-md:m-[3rem_0_1.5rem_0] max-md:p-[0_2rem_0.5rem_2rem] max-md:overflow-x-auto
        "
        ref={categoryFiltersRef}
      >
        {Object.keys(Categories).map((category) => (
          <Link
            key={category}
            onClick={() =>
              ErrorSafeLocalStorage.setItem('scrollTo', window.scrollY)
            }
            className={classnames(
              '!text-filter font-primary tracking-[1px] list-none no-underline w-fit text-gray-five',
              category === selectedCategory &&
                'text-xl-pink border-b-[2px] border-xl-pink'
            )}
            to={category === 'all' ? '/' : `/categories/${category}/`}
          >
            {Categories[category]}
          </Link>
        ))}
      </div>
      <div
        className="
          m-[0_16%_0] grid grid-cols-[repeat(auto-fill,minmax(28%,1fr))] gap-16 
          max-sm:m-0 max-sm:gap-[4rem_0] max-sm:grid-cols-[auto]
        "
      >
        {posts.map(({ node }) => (
          <Card data={node} key={node.id} withCategory={false} />
        ))}
      </div>
      <Pager {...pageContext} />
    </>
  );
};

BlogList.propTypes = {
  data: PropTypes.shape({
    allMdX: PropTypes.shape({
      group: PropTypes.arrayOf(
        PropTypes.shape({
          fieldValue: PropTypes.string.isRequired,
          totalCount: PropTypes.number.isRequired,
        }).isRequired
      ),
    }),
  }),
};
