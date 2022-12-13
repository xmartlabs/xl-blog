import React from "react"

import { StarIcon } from "../star-icon/star-icon";
import { PolygonIcon } from "../polygon-icon/polygon-icon";

import * as styles from "./home-banner.module.scss";

const HomeBanner = () => (
  <div className={styles.containerTitleHome}>
    <h1>Xmartlabs Blog</h1>
    <div className={styles.textContainer}>
      <StarIcon />
      <h2>Design. Engineering. Lessons learned on our journey</h2>
      <div className={styles.iconContainer}>
        <PolygonIcon />
        <PolygonIcon />
      </div>
    </div>
  </div>
);

export { HomeBanner }; 
