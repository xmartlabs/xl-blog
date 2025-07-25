import React from 'react';

import PropTypes from 'prop-types';

export const Facebook = ({ className }) => (
  <svg
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M10.1412 0.354004C4.93286 0.354004 0.710937 4.57593 0.710937 9.78425C0.710937 14.4909 4.15958 18.3922 8.66818 19.1004L8.66818 12.5096H6.2729V9.78425H8.66818L8.66818 7.70677C8.66818 5.34355 10.0752 4.0384 12.23 4.0384C13.2617 4.0384 14.3405 4.22229 14.3405 4.22229L14.3405 6.54213H13.1523C11.9801 6.54213 11.6151 7.2692 11.6151 8.01514V9.78425H14.2301L13.8124 12.5096H11.6151L11.6151 19.1004C16.1228 18.3931 19.5714 14.4899 19.5714 9.78425C19.5714 4.57593 15.3495 0.354004 10.1412 0.354004Z"
      fill="#9B9B9B"
    />
  </svg>
);

Facebook.propTypes = {
  className: PropTypes.string,
};

Facebook.defaultProps = {
  className: '',
};
