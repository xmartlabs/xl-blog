import React from "react";
import { Link } from "gatsby";
import PropTypes from "prop-types";

import { NavMenu } from "../nav-menu";
import { MenuMobileIcon } from "../icons/menu-icon";
import { CloseIcon } from "../icons/close-icon";
import { LinkedInIcon } from "../icons/linked-in";
import { InstagramIcon } from "../icons/instagram";
import { TwitterIcon } from "../icons/twitter";
import { GithubIcon } from "../icons/github";

import { classnames } from "../../helpers";

import * as styles from "./mobile-menu.module.scss";

const MobileMenu = ({ onClick, showMenu }) => (
  <>
    <div className={classnames(styles.container, { [styles.openMenu]: showMenu })} >
      <div className={classnames(styles.buttonIconPosition, { [styles.openButton]: showMenu })}>
        <button onClick={onClick} className={styles.buttonIconStyles} >
          <MenuMobileIcon />
        </button>
      </div>
      {showMenu && 
        <div>
          <div className={styles.buttonIconPosition}>
            <button onClick={onClick} className={classnames(styles.buttonIconPosition, styles.buttonIconStyles)} >
              <CloseIcon />
            </button>
          </div>
          <div className={styles.menuContainer} >
            <NavMenu className={styles.menuOptions}  openMenu={showMenu}/>
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

MobileMenu.propTypes = {
  onClick: PropTypes.func,
  showMenu: PropTypes.bool,
};

MobileMenu.defaultProps = {
  onClick: () => {},
  showMenu: false,
};
