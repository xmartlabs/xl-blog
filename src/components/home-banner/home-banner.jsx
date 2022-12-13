import React from "react"

import star from "../../../static/images/icons/star.svg";
import { ReactComponent } from "../../../static/images/icons/polygon.svg";

import * as styles from "./home-banner.module.scss";

const HomeBanner = () => (
  <div>
    <div className={styles.containerTitleHome}>
      <h1>Xmartlabs Blog</h1>
      <div>
        {star}
        <p>Design. Engineering. Lessons learned on our journey</p>
        {/* <Polygon /> */}
        {/* <Polygon /> */}
      </div>
    </div>
  </div>
);

export { HomeBanner }; 
