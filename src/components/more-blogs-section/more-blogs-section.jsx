import React from 'react';

import { Link } from 'gatsby';
import PropTypes from 'prop-types';

import { Card } from '../card';

const MoreBlogsSection = ({ relatedPosts, refMoreFrom, title }) => (
  <div
    className="bg-blue-six mt-16 px-[16%] py-0 max-xxl:py-0 max-xxl:px-[5%]"
    ref={refMoreFrom}
  >
    <div className="mb-16 pt-16 [&_a]:font-link max-sm:mt-0 max-sm:mx-0 max-sm:mb-16">
      <Link
        className="
          text-heading-two-separated text-blue-one no-underline 
          max-sm:leading-[2rem] max-sm:text-[1.4rem]
        "
        to={`/categories/${title}`}
      >
        More from <span className="text-xl-pink">{title}</span> →
      </Link>
    </div>
    <div
      className="
        flex flex-row items-baseline w-[92.5rem] m-auto gap-20 max-w-full
        max-xs:flex max-xs:flex-col max-xs:items-center max-xs:w-auto max-xs:gap-0
      "
    >
      {relatedPosts.slice(0, 3).map((post) => (
        <Card
          data={post}
          key={post.frontmatter.title}
          className="w-[30%] mb-20 [&_p]:absolute [&_p]:top-[13.5rem]"
        />
      ))}
    </div>
  </div>
);

export { MoreBlogsSection };

MoreBlogsSection.propTypes = {
  title: PropTypes.string,
  refMoreFrom: PropTypes.shape({
    current: PropTypes.object,
  }),
  data: PropTypes.shape({
    allMdx: PropTypes.shape({
      edges: PropTypes.shape({
        node: PropTypes.shape({
          id: PropTypes.string,
          body: PropTypes.string,
          frontmatter: PropTypes.shape({
            author: PropTypes.string,
            date: PropTypes.string,
            permalink: PropTypes.string.isRequired,
            tags: PropTypes.array,
            thumbnail: PropTypes.string,
            title: PropTypes.string.isRequired,
          }),
        }),
      }),
    }),
    mdx: PropTypes.shape({
      frontmatter: PropTypes.shape({
        author: PropTypes.string,
        date: PropTypes.string,
        tags: PropTypes.array,
        title: PropTypes.string,
      }),
    }),
  }),
};

MoreBlogsSection.defaultProps = {
  refMoreFrom: { current: null },
  title: '',
};
