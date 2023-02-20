import React from "react";

import PropTypes from "prop-types";

import { classnames } from "../../helpers/utils";

import * as styles from "./social-element.module.scss";

const SocialElement = ({ className, links }) => {

  return (
    <div className={classnames(styles.container, className)}>
      {links.map((item) => 
        <a 
          key={item.path}
          href={item.path} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={classnames(styles.socialIcon, {[styles.blogIcons]: item.id === 'blog'})}>
            {item.icon}
        </a>
      )}
    </div>
  );
};

export { SocialElement };

SocialElement.propTypes = {
  className: PropTypes.string, 
  links: PropTypes.array.isRequired,
}

SocialElement.defaultProps = {
  className: '',
};
