import React from "react";
import PropTypes from "prop-types";

import { classnames } from "../../helpers";

import * as styles from "./tags.module.scss";

const Tags = ({ blogTags }) => (
  <div className={styles.tagsContainer}>
    {blogTags && blogTags.slice(0, 4).map((post) => 
      <a className={classnames(styles.tag, "text__paragraph__small__grayTwo")}>
        {post}
      </a>
    )}
  </div>
);

Tags.propTypes = {
  blogTags: PropTypes.array.isRequired,
};

Tags.defaultProps = {
  className: '',
}

export { Tags };
