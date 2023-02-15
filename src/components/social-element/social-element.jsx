import React from "react";

import PropTypes from "prop-types";

import { classnames } from "../../helpers/utils";

import * as styles from "./social-element.module.scss";

const SocialElement = ({ className, links }) => {

  const {twitter, facebook, linkedIn, instagram, github} = links;

  return (
    <div className={classnames(styles.container, className)}>
      {[twitter, facebook, linkedIn].map((item) => <a href={item?.path} target="_blank" rel="noopener noreferrer">{item?.icon}</a>,)}
      {github && [linkedIn, instagram, twitter, github].map((item) => <a href={item?.path} target="_blank" rel="noopener noreferrer">{item?.icon}</a>)}
    </div>
  );
};

export { SocialElement };

SocialElement.propTypes = {
  className: PropTypes.string, 
}

SocialElement.defaultProps = {
  className: '',
};
