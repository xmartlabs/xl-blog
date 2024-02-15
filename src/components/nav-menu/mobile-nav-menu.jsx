import React, { useState } from "react";
import PropTypes from "prop-types";

import { NavMenuElements } from "./nav-menu-elements";
import { GithubIcon, TwitterIcon, InstagramIcon, LinkedInIcon, CloseIcon, MenuMobileIcon } from "../icons";

import { classnames } from "../../helpers";
import { SocialElement } from "../social-element";
import { TypeForm } from "../typeform/typeform";

import * as styles from "./mobile-nav-menu.module.scss";

const MobileNavMenu = () => {
  const [ showMenu, setShowMenu ] = useState(false);
  const [ showTypeForm, setShowTypeForm ] = useState(false);

  const mobileLinks = [
    {
      path: "https://www.linkedin.com/company/xmartlabs/mycompany/", 
      icon: <LinkedInIcon />,
      id: "socialMenuLinkedIn"
    },
    {
      path: "https://www.instagram.com/xmartlabs", 
      icon: <InstagramIcon />,
      id: "socialMenuInstagram"
    },
    {
      path: "https://twitter.com/xmartlabs", 
      icon: <TwitterIcon />,
      id: "socialMenuTwitter"
    },
    {
      path: "https://github.com/xmartlabs", 
      icon: <GithubIcon />,
      id: "socialMenuGithub"
    },
  ];

  return (
    <>
      <div className={classnames(styles.container, { [styles.openMenu]: showMenu })} >
        {showTypeForm && <TypeForm onClick={() => setShowTypeForm(false)}/>}
        <div className={classnames(styles.buttonIconPosition, { [styles.openButton]: showMenu })}>
          <button onClick={() => setShowMenu(!showMenu)} className={styles.buttonIconStyles} >
            <MenuMobileIcon />
          </button>
        </div>
        {showMenu && 
          <div>
            <div className={styles.buttonIconPosition}>
              <button onClick={() => setShowMenu(!showMenu)} className={classnames(styles.buttonIconPosition, styles.buttonIconStyles)} >
                <CloseIcon className={styles.closeIconMobile} />
              </button>
            </div>
            <div className={styles.menuContainer} >
              <NavMenuElements className={styles.menuOptions}  openMenu={showMenu}/>
              <div className={styles.partnerContainer}>
                <h4 className="text__label__bold__blueOne">Ready to partner?</h4>
                <button onClick={() => setShowTypeForm(true)} target="_blank" rel="noopener noreferrer" className={styles.partnerButton}>Let's talk</button>
              </div>
                <SocialElement links={mobileLinks} className={styles.socialContainer} />
            </div>
          </div>
        }
      </div>
    </>
  );
};

export { MobileNavMenu as MobileMenu };

MobileNavMenu.propTypes = {
  onClick: PropTypes.func,
  showMenu: PropTypes.bool,
};

MobileNavMenu.defaultProps = {
  onClick: () => {},
  showMenu: false,
};
