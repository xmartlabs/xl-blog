import React from "react";

import PropTypes from "prop-types";

import { TwitterIcon, Facebook, Linkedin } from "../icons";
import { classnames } from "../../helpers/utils";

import * as styles from "./social-blog.module.scss";

const SocialBlog = ({ className, links: {twitter, facebook, linkedIn} }) => {

  return (
    <div className={classnames(styles.container, className)}>
      <a href={twitter}><TwitterIcon className={styles.socialIcon} /></a>
      <a href={facebook} className={styles.facebookSpace}><Facebook className={styles.socialIcon} /></a>
      <a href={linkedIn}><Linkedin className={styles.socialIcon} /></a>
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
