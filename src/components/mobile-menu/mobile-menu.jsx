import React, { useState } from "react";

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

const MobileMenu = () => {
  const [ handleMenu, setHandleMenu ] = useState(false);

  const handleMenuButton = () => {
    setHandleMenu(!handleMenu);
  }

  console.log(handleMenu)

  return (
    <>
      <div className={classnames(styles.container, { [styles.menuOpen]: handleMenu })} >
        <div className={classnames(styles.buttonIconPosition, { [styles.openButton]: handleMenu })}>
          <Button onClick={handleMenuButton} className={styles.buttonIconStyles} >
            <MenuMobileIcon />
          </Button>
        </div>
        {handleMenu && 
          <div>
            <div className={styles.buttonIconPosition}>
              <Button onClick={handleMenuButton} className={classnames(styles.buttonIconPosition, styles.buttonIconStyles)} >
                <CloseIcon />
              </Button>
            </div>
            <NavMenu className={styles.menuOptions} />
            <h4>Ready to partner?</h4>
            <Button>Lets's talk</Button>
            <div>
              <LinkedInIcon />
              <InstagramIcon />
              <TwitterIcon />
              <GithubIcon />
            </div>
          </div>
        }
        </div>
    </>
  );
};

export { MobileMenu };
