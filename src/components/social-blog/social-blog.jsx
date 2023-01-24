import React from "react";

import { Twitter, Facebook, Linkedin } from "../icons";
import { classnames } from "../../helpers/utils";

import * as styles from "./social-blog.module.scss";

const SocialBlog = ({ className }) => (
  <div className={classnames(styles.container, className)}>
    <a href="https://twitter.com/xmartlabs"><Twitter className={styles.socialIcon} /></a>
    <a href="https://www.facebook.com/xmartlabs/" className={styles.facebookSpace}><Facebook className={styles.socialIcon} /></a>
    <a href="https://www.linkedin.com/company/xmartlabs/"><Linkedin className={styles.socialIcon} /></a>
  </div>
);

export { SocialBlog };
