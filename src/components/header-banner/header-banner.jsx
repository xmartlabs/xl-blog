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
      <p>topic 1</p>
      <p>topic 2</p>
      <p>topic 3</p>
      <p>topic 4</p>
      <p>topic 5</p>
      <p>topic 6</p>
    </div>
  </div>
);

export { HeaderBanner };
