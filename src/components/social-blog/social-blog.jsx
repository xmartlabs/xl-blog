import React from "react";

import PropTypes from "prop-types";

import { TwitterIcon, Facebook, Linkedin } from "../icons";
import { classnames } from "../../helpers/utils";

import * as styles from "./social-blog.module.scss";

const SocialBlog = ({ className, links}) => {

  const {twitter, facebook, linkedIn} = links;

  return (
    <div className={classnames(styles.container, className)}>
      <a href={twitter} target="_blank" rel="noopener noreferrer"><TwitterIcon className={styles.socialIcon} /></a>
      <a href={facebook} target="_blank" rel="noopener noreferrer" className={styles.facebookSpace}><Facebook className={styles.socialIcon} /></a>
      <a href={linkedIn} target="_blank" rel="noopener noreferrer"><Linkedin className={styles.socialIcon} /></a>
    </div>
  );
};

export { SocialBlog };

SocialBlog.propTypes = {
  className: PropTypes.string, 
}

SocialBlog.defaultProps = {
  className: '',
};
