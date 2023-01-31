import React from "react";

import PropTypes from "prop-types";

const Button = ({ className, text, onClick }) => {
  return (
    <button className={className} onClick={onClick} >
      {text}
    </button>
  )
  
};

export { Button };

Button.propTypes = {
  className: PropTypes.string,
  textr: PropTypes.string,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  className: '',
  text: '',
  onClick: () => {},
}
