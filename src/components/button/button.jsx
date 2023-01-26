import React from "react";

import PropTypes from "prop-types";

const Button = ({ className, onClick, disabled, children }) => {

  return (
    <button disabled={disabled} className={className} onClick={onClick} >
      {children}
    </button>
  )
};

export { Button };

Button.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  className: '',
  onClick: () => {},
  disabled: false,
}
