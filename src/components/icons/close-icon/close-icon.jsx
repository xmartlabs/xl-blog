import React from "react";

import PropTypes from "prop-types";

export const CloseIcon = ({ className }) => (
  <svg viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M10.2096 8.47415L17.7072 0.976562L19.8489 3.1183L12.3514 10.6159L19.8489 18.1135L17.7072 20.2552L10.2096 12.7576L2.71205 20.2552L0.570312 18.1135L8.0679 10.6159L0.570312 3.1183L2.71205 0.976562L10.2096 8.47415Z"/>
  </svg>
);

CloseIcon.propTypes = {
  className: PropTypes.string,
};

CloseIcon.defaultProps = {
  className: '',
}
