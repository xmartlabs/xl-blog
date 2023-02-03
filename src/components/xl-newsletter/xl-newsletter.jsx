import React from "react";
import { StaticImage } from "gatsby-plugin-image";
import { Link } from "gatsby";
import PropTypes from "prop-types";

import { Input } from "../input";
import { Button } from "../button";
import { Close } from "../icons"

import { classnames } from "../../helpers";

import * as styles from "./xl-newsletter.module.scss";

const XlNewsletter = ({ onClick, showBanner }) => {
  return (
    <>
    {showBanner && 
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
          <Input placeholder="Type your email..." className={classnames(styles.inputNewsletter, "text__placeholder__grayThree")} />
          <Button text="SUBSCRIBE" className={classnames(styles.buttonNewsletter, "text__paragraph__small__neutral100")} onClick={onClick} />
        </div>
      </div>
      <div className={styles.close}>
        <Close />
      </div>
    </div>
  }
  </>
  )
};

export { XlNewsletter };

XlNewsletter.propTypes = {
  onClick: PropTypes.func,
};

XlNewsletter.defaultProps = {
  onClick: () => {},
}
