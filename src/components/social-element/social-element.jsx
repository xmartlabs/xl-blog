import React from 'react';

import { classnames } from '../../helpers/utils';

const SocialElement = ({ className = '', links }) => {
  return (
    <div
      className={classnames(
        'flex flex-col items-center w-[14.8%] fixed top-64 max-lg:hidden',
        className
      )}
    >
      {links.map((item) => (
        <a
          key={item.id}
          href={item.path}
          target="_blank"
          rel="noopener noreferrer"
          className="w-6 h-6"
        >
          {item.icon}
        </a>
      ))}
    </div>
  );
};

export { SocialElement };
