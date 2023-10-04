import React from "react";

import { TopPostHome } from "../top-post-home/top-post-home";

import * as styles from "./top-three-posts.module.scss";
import { classnames } from "../../helpers";

const TopThreePosts = ({ edges }) => {

  return (
    <div className={styles.container}>
      <p className={classnames("text__filter__defaultGray", styles.title)}>Top Posts</p>
      {edges.slice(0, 3).map(({node}) => <TopPostHome data={node} key={node.id}/>)}
    </div>
  );
};

export { TopThreePosts };
