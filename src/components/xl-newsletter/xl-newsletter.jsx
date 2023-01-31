import React from "react";
import { StaticImage } from "gatsby-plugin-image";

import { Input } from "../input";
import { Button } from "../button";

import * as styles from "./xl-newsletter.module.scss";

const XlNewsletter = () => {
  return (
    <div className={styles.container} >
      <div>
        <StaticImage    
          src="../../../static/images/logo.svg"
          alt="Xmartlabs logo"
          layout="fixed"
          width={70}
          height={70}
        />
        <h2>Xmartlabs´ Newsletter</h2>
        <p>Subscribe to our newsletter and get updates on AI, Computer Vision as well as mobile and web development.</p>
        <div>
          <Input placeholder="Type your email" />
          <Button>Suscribe</Button>
        </div>
      </div>
    </div>
  )
};

export { XlNewsletter };
