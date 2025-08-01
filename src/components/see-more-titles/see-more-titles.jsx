import React from 'react';
import PropTypes from 'prop-types';

import { classnames } from '../../helpers';

const SeeMoreTitles = ({ onClick, className, children }) => (
  <a
    onClick={onClick}
    className={classnames(
      className,
      'fixed top-[14%] w-[20.3%] mr-[5%] cursor-pointer'
    )}
  >
    {children}
  </a>
);

SeeMoreTitles.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
};

SeeMoreTitles.defaultProps = {
  className: '',
  onClick: () => {},
};

export { SeeMoreTitles };
