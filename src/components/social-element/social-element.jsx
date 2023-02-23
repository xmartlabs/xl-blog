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
          className={styles.socialIcon}>
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
    path: PropTypes.string,
    icon: PropTypes.element
  })).isRequired
}

SocialElement.defaultProps = {
  className: '',
};
