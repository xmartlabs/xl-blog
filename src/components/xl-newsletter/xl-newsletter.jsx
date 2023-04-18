import React from "react";
import { StaticImage } from "gatsby-plugin-image";
import { Link } from "gatsby";

import { CloseIcon } from "../icons"

import { classnames } from "../../helpers";

import * as styles from "./xl-newsletter.module.scss";

const XlNewsletter = () => (
    <div className={styles.container} >
      <div className={styles.logoContainer}>
        <Link to="/" className={styles.linkLogoXl}>
          <StaticImage    
            src="../../../static/images/newsletter-xl/logo-xl.png"
            alt="Xmartlabs logo"
            layout="fixed"
            width={100}
            height={100}
          />
        </Link>
      </div>
    <div className={styles.informationContainer}>
      <h2 className="text__heading__two__neutral100">Xmartlabs´ Newsletter</h2>
      <p className={classnames("text__paragraph__two__defaultGray", styles.textNewsletter)}>Subscribe to our newsletter and get updates on AI, Computer Vision as well as mobile and web development.</p>
      <div className={styles.subscribeContainer}>
          <input 
            placeholder="Type your email..." 
            className={classnames(styles.inputNewsletter, "text__placeholder__grayThree")} 
            label="Email"
            type="email"
            name="email"
            autoComplete="email" 
          />
          <button 
            className={classnames(styles.buttonNewsletter, "text__paragraph__small__neutral100")} 
            label="Submit"
            type="submit"
          >
            SUBSCRIBE
          </button>
      </div>
    </div>
    <CloseIcon className={styles.close} />
  </div>
);

export { XlNewsletter };
