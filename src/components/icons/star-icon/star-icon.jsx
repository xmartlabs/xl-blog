import React from "react";

import PropTypes from "prop-types";

export const StarIcon = ({ className }) => (
  <svg width="62" height="63" viewBox="0 0 62 63" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M61.7422 31.3888C51.5573 31.3888 44.013 28.3297 39.0112 23.3279C34.0094 18.3261 30.9504 10.7818 30.9504 0.596924C30.9504 10.7818 27.8913 18.3261 22.8895 23.3279C17.8877 28.3297 10.3434 31.3888 0.15853 31.3888C10.3434 31.3888 17.8877 34.4478 22.8895 39.4496C27.8913 44.4514 30.9504 51.9957 30.9504 62.1806C30.9504 51.9957 34.0094 44.4514 39.0112 39.4496C44.013 34.4478 51.5573 31.3888 61.7422 31.3888Z" fill="#EE1A64"/>
  </svg>
);

StarIcon.propTypes = {
  className: PropTypes.string,
};

StarIcon.defaultProps = {
  className: '',
}
