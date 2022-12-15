import * as PropTypes from "prop-types";
import React from "react";

const Input = ({ placeHolder, className, value, onChange}) => (
  <div>
    <input 
      value={value}
      placeholder = {placeHolder}
      className = {className}
      onChange={onChange}
    />
  </div>
);

Input.prototype = {
  placeHolder: PropTypes.string.isRequired, 
  className: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export { Input };
