import React from "react";
import PropTypes from "prop-types";

import { classnames } from "../../helpers";

import * as styles from "./tags.module.scss";

const Tags = ({ blogTags, className }) => (
  <div className={classnames(styles.tagsContainer, className)}>
    {blogTags && blogTags.slice(0, 4).map((post) => 
      <a className={classnames(styles.tag, "text__paragraph__small__grayTwo")}>
        {post}
      </a>
    )}
  </div>
);

Tags.propTypes = {
  blogTags: PropTypes.arrayOf(PropTypes.string).isRequired,
  className: PropTypes.string,
};

Tags.defaultProps = {
  className: '',
}

export { Tags };
