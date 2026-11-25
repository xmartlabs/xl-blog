import React from 'react';

import { Card } from '../card';

export const MORE_BLOGS_SECTION_ID = 'more-blogs-section';

// `relatedPosts`: [{ id, title, slug, thumbnail }]
const MoreBlogsSection = ({
  relatedPosts = [],
  title = '',
  categoryId = '',
}) => (
  <div
    id={MORE_BLOGS_SECTION_ID}
    className="bg-blue-six mt-16 px-[16%] py-0 max-xxl:py-0 max-xxl:px-[5%]"
  >
    <div className="mb-16 pt-16 [&_a]:font-link max-sm:mt-0 max-sm:mx-0 max-sm:mb-16">
      <a
        className="
          text-heading-two-separated text-blue-one no-underline 
          max-sm:leading-[2rem] max-sm:text-[1.4rem]
        "
        href={`/categories/${categoryId}/`}
      >
        More from <span className="text-xl-pink">{title}</span> →
      </a>
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
          key={post.id}
          className="w-[30%] mb-20 [&_p]:absolute [&_p]:top-[13.5rem]"
        />
      ))}
    </div>
  </div>
);

export { MoreBlogsSection };
