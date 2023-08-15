import React from "react";

import * as styles from "./header-banner.module.scss";

const HeaderBanner = () => (
  <div className={styles.container}>
    <div className={styles.contentContainer}>
      <div className={styles.textContainer}>
        <h1>Expertise at your fingertips</h1>
        <p>Access our Insights on Technology, Product, Design, & more</p>
      </div>
      <div className={styles.circleIcon}>
      </div>
    </div>
    <div className={styles.bottomTextContainer}>
      <p>Development</p>
      <p>Design</p>
      <p>Machine Learning</p>
      <p>Blockchain</p>
      <p>People</p>
    </div>
  </div>
);

export { HeaderBanner };
