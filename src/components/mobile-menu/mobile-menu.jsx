import React, { useState } from "react";

import { NavMenu } from "../nav-menu";

import { Button } from "../button";
import { MenuMobileIcon } from "../icons/menu-icon/menu-mobile-icon";

import * as styles from "./mobile-menu.module.scss";

const MobileMenu = ({ children }) => {
  const [ handleMenu, setHandleMenu ] = useState(false);

  const handleMenuButton = () => {
    setHandleMenu(!handleMenu);
  }

  return (
    <div className={styles.container}>
      <Button onClick={handleMenuButton} className={styles.buttonMenu} >
        <MenuMobileIcon />
      </Button>
      {handleMenu && 
      <nav className={styles.menuContainer}>
          <NavMenu className={styles.linkMenu} />
          {children}
      </nav>
      } 
    </div>
  );
};

export { MobileMenu };
