import React, { useState } from "react";
import { Link } from "gatsby";

import { NavMenu } from "../nav-menu";
import { Button } from "../button";
import { MenuMobileIcon } from "../icons/menu-icon";
import { CloseIcon } from "../icons/close-icon";
import { LinkedInIcon } from "../icons/linked-in/";
import { InstagramIcon } from "../icons/instagram";
import { TwitterIcon } from "../icons/twitter";
import { GithubIcon } from "../icons/github";
import { classnames } from "../../helpers";

import * as styles from "./mobile-menu.module.scss";

const MobileMenu = ({ onClick, status }) => (
  <>
    <div className={classnames(styles.container, { [styles.menuOpen]: status })} >
      <div className={classnames(styles.buttonIconPosition, { [styles.openButton]: status })}>
        <Button onClick={onClick} className={styles.buttonIconStyles} >
        <MenuMobileIcon />
        </Button>
      </div>
      {status && 
        <div>
          <div className={styles.buttonIconPosition}>
            <Button onClick={onClick} className={classnames(styles.buttonIconPosition, styles.buttonIconStyles)} >
              <CloseIcon />
            </Button>
          </div>
          <div className={styles.menuContainer} >
            <div className={styles.menuOptions}>
              <NavMenu className={styles.menuOptions}  menuOpen={status}/>
            </div>
            <div className={styles.partnerContainer}>
              <h4 className="text__label__bold__black">Ready to partner?</h4>
              <Link to="/" className={styles.partnerButton}>Lets's talk</Link>
            </div>
            <div className={styles.socialContainer}>
              <Link to="/"><LinkedInIcon /></Link>
              <Link to="/" className={styles.instagramSpace}><InstagramIcon /></Link>
              <Link to="/"><TwitterIcon /></Link>
              <Link to="/" className={styles.gitSpace}><GithubIcon /></Link>
            </div>
          </div>
        </div>
      }
    </div>
  </>
);

export { MobileMenu };