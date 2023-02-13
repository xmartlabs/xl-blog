import React from "react";

import PropTypes from "prop-types";

export const MenuMobileIcon = ({ className }) => (
  <svg width="29" height="12" viewBox="0 0 29 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="0.90625" y="0.445068" width="28" height="3" fill="black"/>
    <rect x="11.9062" y="8.44507" width="17" height="3" fill="black"/>
  </svg>
);

MenuMobileIcon.propTypes = {
  className: PropTypes.string,
};

MenuMobileIcon.defaultProps = {
  className: '',
};
