import React from "react";

import PropTypes from "prop-types";

import { Twitter, Facebook, Linkedin } from "../icons";
import { classnames } from "../../helpers/utils";

import * as styles from "./social-blog.module.scss";

const SocialBlog = ({ className, socialAtRight }) => (
  <div className={classnames(styles.container, className)}>
    {socialAtRight && 
    <span className={classnames('text__paragraph__bold__grayTwo', styles.sharePosition)}>Share:</span>
    }
    <a href="https://twitter.com/xmartlabs"><Twitter className={styles.socialIcon} /></a>
    <a href="https://www.facebook.com/xmartlabs/" className={styles.facebookSpace}><Facebook className={styles.socialIcon} /></a>
    <a href="https://www.linkedin.com/company/xmartlabs/"><Linkedin className={styles.socialIcon} /></a>
  </div>
);

export { SocialBlog };

SocialBlog.propTypes = {
  className: PropTypes.string,
  socialAtRight: PropTypes.bool,
};

SocialBlog.defaultProps = {
  className: '',
  socialAtRight: false,
};
