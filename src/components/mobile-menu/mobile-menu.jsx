import React, { useState } from "react";
import PropTypes from "prop-types";

import { NavMenu } from "../nav-menu";
import { GithubIcon, TwitterIcon, InstagramIcon, LinkedInIcon, CloseIconMobile, MenuMobileIcon } from "../icons";

import { classnames } from "../../helpers";
import { SocialElement } from "../social-element";

import * as styles from "./mobile-menu.module.scss";

const MobileMenu = () => {
  const [ showMenu, setShowMenu ] = useState(false);

  const mobileLinks = [
    {path: "https://www.linkedin.com/company/xmartlabs/mycompany/", icon: <LinkedInIcon />},
    {path: "https://www.instagram.com/xmartlabs", icon: <InstagramIcon />},
    {path: "https://twitter.com/xmartlabs", icon: <TwitterIcon />},
    {path: "https://github.com/xmartlabs", icon: <GithubIcon />},
  ];

  return (
    <>
      <div className={classnames(styles.container, { [styles.openMenu]: showMenu })} >
        <div className={classnames(styles.buttonIconPosition, { [styles.openButton]: showMenu })}>
          <button onClick={() => setShowMenu(!showMenu)} className={styles.buttonIconStyles} >
            <MenuMobileIcon />
          </button>
        </div>
        {showMenu && 
          <div>
            <div className={styles.buttonIconPosition}>
              <button onClick={() => setShowMenu(!showMenu)} className={classnames(styles.buttonIconPosition, styles.buttonIconStyles)} >
                <CloseIconMobile />
              </button>
            </div>
            <div className={styles.menuContainer} >
              <NavMenu className={styles.menuOptions}  openMenu={showMenu}/>
              <div className={styles.partnerContainer}>
                <h4 className="text__label__bold__black">Ready to partner?</h4>
                <a href="https://form.typeform.com/to/c7G2RUWm" target="_blank" rel="noopener noreferrer" className={styles.partnerButton}>Lets's talk</a>
              </div>
                <SocialElement links={mobileLinks} className={styles.socialContainer} />
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
