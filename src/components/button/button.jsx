import React from "react";

import * as PropTypes from "prop-types";

const Button = ({ className, onClick, label }) => (
  <button 
    onClick={onClick}
    className = {className}
  >
    {label}
  </button>
);

Button.propType = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string,
};

export { Button };
