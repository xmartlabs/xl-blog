import React from "react";

import { CloseIcon } from "../close-icon";
import { Input } from "../input";
import { classnames } from "../../helpers/utils";
import { Button } from "../button/button";

import * as styles from "./newsletter.module.scss";

const NewsLetter = () => {
  return (
    <div className={styles.container}>
      <Button onClick={handleClick}><CloseIcon className={styles.closeIcon} onClick={handleClick} /></Button>
      <div className={styles.fillContainer}>
        <div className={styles.imageContainer}>
          <img src="../../../images/static/logo.svg" className={styles.logoImage} />
        </div>
        <div className={styles.textContainer}>
          <h3 className="text__heading__two__white" >Xmartlabs´ Newsletter</h3>
          <p className={classnames("text__paragraph__defaultGray", styles.paragraph)}>Subscribe to our newsletter and get updates on AI, Computer Vision as well as mobile and web development.</p>
          <div className={styles.suscribeContainer}>
            <Input placeHolder="Type your email..." className={classnames(styles.input, "text__label__neutral__grayTwo")} />
            <Button onClick={() => {}} label="SUBSCRIBE" className={classnames(styles.button, "text__label__neutral__white")} />
          </div>
        </div>
      </div>
    </div>
  );
};

export { NewsLetter }; 
