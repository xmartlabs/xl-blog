import React from "react";

import PropTypes from "prop-types";

const Button = ({ className, onClick, disabled, children, text }) => {

  return (
    <button disabled={disabled} className={className} onClick={onClick} >
      {children}
      {text}
    </button>
  )
};

export { Button };

Button.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  text: PropTypes.string,
};

Button.defaultProps = {
  className: '',
  onClick: () => {},
  disabled: false,
  text: '',
}
