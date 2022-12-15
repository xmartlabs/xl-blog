import React from "react";

import * as PropTypes from "prop-types";

const Input = ({ placeHolder, className, value, onChange}) => (
  <input 
    value={value}
    placeHolder = {placeHolder}
    className = {className}
    onChange={onChange}
  />
);

Input.propType = {
  placeHolder: PropTypes.string.isRequired, 
  className: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export { Input };
