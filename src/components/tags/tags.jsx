import React from 'react';

import { classnames } from '../../helpers';

const Tags = ({ blogTags, className = '' }) => (
  <div
    className={classnames(
      'flex flex-row flex-wrap w-full justify-start',
      className
    )}
  >
    {blogTags &&
      blogTags.slice(0, 4).map((post) => (
        <a
          key={post}
          className="
          text-paragraph-small text-blue-one border-[1.5px] border-[rgba(155,155,155,0.5)]
          rounded-[6.49875px] m-[0_1rem_1rem_0] text-left p-[0.6rem] leading-[1rem] font-primary
          bg-blue-six font-medium first-letter:capitalize
        "
        >
          {post}
        </a>
      ))}
  </div>
);

export { Tags };
