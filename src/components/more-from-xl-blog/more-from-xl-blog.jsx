import React from "react";

import { Link } from "gatsby";
import PropTypes from "prop-types";

import { classnames } from "../../helpers";

import { Card } from "../../components/card";

import * as styles from './more-from-xl-blog.module.scss';

const MoreFromXlBlog = ({ data, refMoreFrom }) => {
  const { edges } = data.allMdx;
  return (
    <div className={styles.moreFromXlContainer} ref={refMoreFrom} >
      <div className={styles.titleContainer}>
        <Link to="/" className={classnames("text__heading__three__blueTwo", styles.titleStyle)}>More From Xmartlabs Blog →</Link>
      </div>
      <div className={styles.blogsContainer}>
        {edges.map(({node}) => <Card data={node} className={styles.cardStyles}/>)}
      </div>
    </div>
  );
}

export { MoreFromXlBlog };

MoreFromXlBlog.propTypes = {
  refMoreFrom: PropTypes.object,
  data: PropTypes.object,
};
