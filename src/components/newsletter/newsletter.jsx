import React from "react";

import { CloseIcon } from "../close-icon";
import { Input } from "../input";

import * as styles from "./newsletter.module.scss";

const NewsLetter = () => (
  <div className={styles.container}>
    <CloseIcon />
    <div>
      <div>
        <img src="" />
      </div>
      <div>
        <h3>Xmartlabs´ Newsletter</h3>
        <p>Subscribe to our newsletter and get updates on AI, Computer Vision as well as mobile and web development.</p>
        <div>
          <Input placeholder="Type your email here" />
        </div>
      </div>
    </div>
  </div>
);

export { NewsLetter }; 
