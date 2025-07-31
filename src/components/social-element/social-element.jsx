import React from "react";

import PropTypes from "prop-types";

import { classnames } from "../../helpers/utils";

const SocialElement = ({ className, links }) => {

  return (
    <div className={classnames("flex flex-col items-center w-[14.8%] fixed top-64", className)}>
      {links.map((item) => 
        <a 
          key={item.id}
          href={item.path} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-6 h-6">
            {item.icon}
        </a>
      )}
    </div>
  );
};

export { SocialElement };

SocialElement.propTypes = {
  className: PropTypes.string, 
  links: PropTypes.arrayOf(PropTypes.objectOf({
    path: PropTypes.string.isRequired,
    icon: PropTypes.element.isRequired,
    id: PropTypes.string.isRequired,
  })).isRequired
}

SocialElement.defaultProps = {
  className: '',
};
