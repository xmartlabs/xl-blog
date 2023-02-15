import React from "react";
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

const MobileMenu = ({ onClick, showMenu }) => {

  return (
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
                <a href="https://form.typeform.com/to/c7G2RUWm" target="_blank" rel="noopener noreferrer" className={styles.partnerButton}>Lets's talk</a>
              </div>
              <div className={styles.socialContainer}>
                <a href="https://www.linkedin.com/company/xmartlabs/mycompany/" target="_blank" rel="noopener noreferrer"><LinkedInIcon /></a>
                <a href="https://www.instagram.com/xmartlabs" target="_blank" rel="noopener noreferrer" className={styles.instagramSpace}><InstagramIcon /></a>
                <a href="https://twitter.com/xmartlabs" target="_blank" rel="noopener noreferrer"><TwitterIcon /></a>
                <a href="https://github.com/xmartlabs" target="_blank" rel="noopener noreferrer" className={styles.gitSpace}><GithubIcon /></a>
              </div>
            </div>
          </div>
        }
      </div>
    </>
  );
};

export { MobileMenu };

MobileMenu.propTypes = {
  onClick: PropTypes.func,
  showMenu: PropTypes.bool,
};

MobileMenu.defaultProps = {
  onClick: () => {},
  showMenu: false,
};
