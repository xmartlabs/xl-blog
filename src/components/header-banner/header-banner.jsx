import React from "react";

import { HeaderCircleIcon } from "../icons";

import * as styles from "./header-banner.module.scss";

const HeaderBanner = () => (
  <div className={styles.container}>
    <div className={styles.contentContainer}>
      <div className={styles.textContainer}>
        <h1>Expertise at your fingertips</h1>
        <p>Access our Insights on Technology, Product, Design, & more</p>
      </div>
      <div className={styles.pinkCircle}>
        <HeaderCircleIcon/>
      </div>
    </div>
    <div className={styles.bottomTextContainer}>    
      <div className={styles.bottomTextSubContainer}>
        <p>Development</p>
        <p>•</p>
        <p>Design</p>
        <p>•</p>
        <p>Machine Learning</p>
        <p>•</p>
        <p>Blockchain</p>
        <p>•</p>
        <p>People</p>
      </div>
    </div>
  </div>
);

export { HeaderBanner };
