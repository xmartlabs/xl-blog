import React from "react"

import { StarIcon } from "../star-icon/star-icon";
import { PolygonIcon } from "../polygon-icon/polygon-icon";

import * as styles from "./home-banner.module.scss";

const HomeBanner = () => (
  <div className={styles.containerTitleHome}>
    <h1 className="text__heading__one__big__black">Xmartlabs Blog</h1>
    <div className={styles.textContainer}>
      <h2 className="text__heading__two__big__black">
        <StarIcon />
        Design. Engineering. Lessons learned on our journey
      </h2>
      <div className={styles.polygonContainer}>
        <PolygonIcon className={styles.iconPolygonOne} />
        <PolygonIcon className={styles.iconPolygonTwo} />
      </div>
    </div>
  </div>
);

export { HomeBanner }; 
