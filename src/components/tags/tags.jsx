import React from "react";

import { classnames } from "../../helpers";

import * as styles from "./tags.module.scss";

const Tags = ({ blogTags }) => {
  return (
    <div className={styles.tagsContainer}>
      {blogTags.slice(0, 4).map((post) => 
        <a 
          className={classnames(styles.tag, "text__paragraph__small__grayTwo")}
        >
          {post}
        </a>)}
    </div>
  );
};

export { Tags };
