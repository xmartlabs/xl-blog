import React from "react";

import PropTypes from "prop-types";

const Input = ({ className, placeholder, onChange }) => {
 return (
  <input type="text" className={className} placeholder={placeholder} onChange={onChange} />
 ); 
};

export { Input };

Input.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
};

Input.defaultProps = {
  className: '',
  placeholder: '',
  onChange: () => {},
}
