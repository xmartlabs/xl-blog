import React from "react";

import PropTypes from "prop-types";

export const HamburguerIcon = ({ className }) => (
  <svg width="29" height="12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 29 12" className={className}>
    <path fill="#000" d="M.906.445h28v3h-28zM11.906 8.445h17v3h-17z"/>
  </svg>
)

HamburguerIcon.propTypes = {
  className: PropTypes.string,
};

HamburguerIcon.defaultProps = {
  className: '',
};
