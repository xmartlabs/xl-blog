import * as React from "react";

import { Link } from "gatsby";
import * as navBarStyles from "./nav-bar.module.scss";

const NavBar = () => {    
  return (
    <div className={navBarStyles.container}>
      <Nav>
        <Link to="/">Work</Link>
        <Link to="/">Services</Link>
        <Link to="/">Our Company</Link>
        <Link to="/">Community</Link>
        {` `}
        <a href="https://xmartlabs.com">XL Website</a>
        {` `}
      </Nav>
    </div>
  );
};

export default NavBar;
