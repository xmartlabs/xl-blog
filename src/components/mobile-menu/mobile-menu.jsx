import React, { useState } from "react";

import { NavMenu } from "../nav-menu";

import { Button } from "../button";
import { MenuMobileIcon } from "../icons/menu-icon/menu-mobile-icon";

import * as styles from "./mobile-menu.module.scss";

const MobileMenu = () => {
  const [ handleMenu, setHandleMenu ] = useState(false);

  const handleMenuButton = () => {
    setHandleMenu(true);
    if (handleMenu) {
      setHandleMenu(false);
    }
  }

  return (
    <div className={styles.container}>
      <Button onClick={handleMenuButton} className={styles.buttonMenu} >
        <MenuMobileIcon />
      </Button>
      {handleMenu && <nav>
        <div className={styles.menuOptions} >
          <NavMenu />
        </div>
      </nav>
      } 
    </div>
  );
};

export { MobileMenu };
