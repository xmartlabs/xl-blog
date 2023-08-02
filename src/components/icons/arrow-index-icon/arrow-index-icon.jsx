import React from "react";

import PropTypes from "prop-types";

export const ArrowIndexIcon = ({ className }) => (
  <svg width="31" height="35" viewBox="0 0 31 35" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M16.9884 1.58359C16.2074 0.80254 14.9411 0.80254 14.16 1.58359L1.43208 14.3115C0.651033 15.0926 0.651033 16.3589 1.43208 17.1399C2.21313 17.921 3.47946 17.921 4.26051 17.1399L15.5742 5.82623L26.8879 17.1399C27.669 17.921 28.9353 17.921 29.7164 17.1399C30.4974 16.3589 30.4974 15.0926 29.7164 14.3115L16.9884 1.58359ZM17.5742 34.9648L17.5742 2.9978L13.5742 2.9978L13.5742 34.9648L17.5742 34.9648Z" fill="#EE1A64"/>
  </svg>
);

ArrowIndexIcon.propTypes = {
  className: PropTypes.string,
};

ArrowIndexIcon.defaultProps = {
  className: '',
};
