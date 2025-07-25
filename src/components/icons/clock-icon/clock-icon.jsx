import React from 'react';

import PropTypes from 'prop-types';

export const ClockIcon = ({ className }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 13 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M6.58768 12.4791C3.31607 12.4791 0.664062 9.82706 0.664062 6.55545C0.664062 3.28384 3.31607 0.631836 6.58768 0.631836C9.85929 0.631836 12.5113 3.28384 12.5113 6.55545C12.5113 9.82706 9.85929 12.4791 6.58768 12.4791ZM7.18004 6.55545V3.59364H5.99532V7.74017H9.54949V6.55545H7.18004Z"
      fill="#9B9B9B"
    />
  </svg>
);

ClockIcon.propTypes = {
  className: PropTypes.string,
};

ClockIcon.defaultProps = {
  className: '',
};
