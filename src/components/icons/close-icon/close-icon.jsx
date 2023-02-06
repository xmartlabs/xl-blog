import React from "react";

import PropTypes from "prop-types";

export const CloseIcon = ({ className }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M2 22L22 2" stroke="black" stroke-width="4"/>
    <path d="M2 2L22 22" stroke="black" stroke-width="4"/>
  </svg>

);


CloseIcon.propTypes = {
  className: PropTypes.string,
};

CloseIcon.defaultProps = {
  className: '',
};
