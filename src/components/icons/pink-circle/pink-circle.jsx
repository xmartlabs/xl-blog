import React from "react";
import PropTypes from "prop-types";

export const PinkCircle = () => (
  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="4.54288" cy="4.8837" r="4.0585" fill="#EE1A64"/>
  </svg>

);

PinkCircle.propTypes = {
  className: PropTypes.string,
};

PinkCircle.defaultProps = {
  className: '',
}
