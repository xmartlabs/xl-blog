import React from "react";

import PropTypes from "prop-types";

export const PolygonIcon = ({ className }) => (
  <svg width="38" height="44" viewBox="0 0 38 44" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M37.7734 21.864L0.30686 43.4561L0.306862 0.271946L37.7734 21.864Z"/>
  </svg>
);

PolygonIcon.propTypes = {
  className: PropTypes.string,
};

PolygonIcon.defaultProps = {
  className: '',
}
