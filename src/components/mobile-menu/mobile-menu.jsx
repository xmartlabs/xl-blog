import React from "react";

import { NavMenu } from "../nav-menu";

import { Button } from "../button";

import * as styles from "./mobile-menu.module.scss";

const MobileMenu = () => {
  
  return (
    <Button>
      <div className={styles.container} >
        <NavMenu />
      </div>
    </Button>
  );
};

export { MobileMenu };
