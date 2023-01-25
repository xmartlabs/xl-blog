import React from "react";

import { Link } from "gatsby";

import * as styles from './more-from-xl-blog.module.scss';

const MoreFromXlBlog = () => {

  return (
    <div className={styles.moreFromXlContainer}>
      <Link to="" className="text__heading__four__blueTwo">More From Xmartlabs Blog</Link>
    </div>
  );
};

export { MoreFromXlBlog };
