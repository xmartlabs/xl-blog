'use client';

import React from 'react';

import { classnames } from '../../helpers';

const SeeMoreTitles = ({ onClick = () => {}, className = '', children }) => (
  <a
    onClick={onClick}
    className={classnames(
      className,
      'fixed top-[14%] w-[20.3%] mr-[5%] cursor-pointer max-lg:hidden'
    )}
  >
    {children}
  </a>
);

export { SeeMoreTitles };
