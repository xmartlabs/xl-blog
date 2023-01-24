import React from "react";

import { Twitter, Facebook, Linkedin } from "../icons";
import { classnames } from "../../helpers/utils";

import * as styles from "./social-blog.module.scss";

const SocialBlog = ({ onScroll }) => (
  <div className={styles.container}
  onScroll={onScroll}
  >
    <Twitter className={styles.socialIcon} />
    <Facebook className={classnames(styles.socialIcon, styles.facebookSpace)} />
    <Linkedin className={styles.socialIcon} />
  </div>
);

export { SocialBlog };
