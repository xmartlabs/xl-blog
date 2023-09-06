import React from "react";

import { HeaderCircleIcon } from "../icons";

import * as styles from "./header-banner.module.scss";

const reuseCat = () => (
  <>
    <span>Development</span>
    <span>•</span>
    <span>Design</span>
    <span>•</span>
    <span>Machine Learning</span>
    <span>•</span>
    <span>Blockchain</span>
    <span>•</span>
    <span>People</span>
    <span>•</span>
  </>
);

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
        <div className={styles.bottomText}>
          {reuseCat()}
        </div>
        <div className={styles.dupContent}>
          {reuseCat()}
          {reuseCat()}
        </div>
      </div>
    </div>
  </div>
);

export { HeaderBanner };
