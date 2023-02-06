import React from "react";

import { Link } from "gatsby";
import PropTypes from "prop-types";

import { classnames } from "../../helpers";

import { Card } from "../card";

import * as styles from './more-from-blogs.module.scss';

const MoreFromBlogs = ({ data, refMoreFrom, moreFromAuthor }) => {
  const { edges } = data.allMdx;
  return (
    <div className={styles.moreFromXlContainer} ref={refMoreFrom} >
      <div className={styles.titleContainer}>
        <Link to="/" className={classnames("text__heading__three__blueTwo", styles.titleStyle)}>{`${moreFromAuthor} →`}</Link>
      </div>
      <div className={styles.blogsContainer}>
        {edges.map(({node}) => <Card data={node} className={styles.cardStyles}/>)}
      </div>
    </div>
  );
}

export { MoreFromBlogs };

MoreFromBlogs.propTypes = {
  refMoreFrom: PropTypes.object,
  data: PropTypes.object,
};
