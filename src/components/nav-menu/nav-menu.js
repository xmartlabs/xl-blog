import * as React from "react";

import { Link } from "gatsby";
import PropTypes from "prop-types";

import * as styledNavMenu from "./nav-menu.module.scss";

const NavMenu = ({
  width,
  justify,
  flex,
  className= "",
  classNameItem= "",
  menuItems = [],
  children,
  ...props
}) => {

  return (
    children ? (
    children
    ) : (
      menuItems.map(({ label, path }) => (
        path.charAt(0) === "/" ? (
          <Link to={path} 
            sx={{ variant: "navlink" }} 
            className={ classNameItem }
            key={label}>
            <p className={styledNavMenu.linkMenu}>{label}</p>
          </Link>
    ) : (
      <Link
        to={path}
        target="_blank"
        className={ classNameItem }
        rel="noopener noreferrer"
        sx={{ variant: "navlink" }}
        key={label}>
        <p className={styledNavMenu.linkMenu}>{label}</p>
      </Link>
      )
    ))
   ) 
  );
};

NavMenu.propTypes = {
  flex: PropTypes.bool,
  justify: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  width: PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
  PropTypes.array,
  ]),
  menuItems: PropTypes.array,
  children: PropTypes.node,
}

export default NavMenu;
