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
  
  if (children) {
    return children;
  };

  let commonProps = {
    to: menuItems.map(({path})),
    sx: {variant: "navlink"},
    className: classNameItem,
    key: menuItems.map(({label})), 
  }

  if (path.charAt(0) !== "/") {
    commonProps = { ...commonProps, target: "_blank", rel: "noopener noreferrer"};
  }

  return (    
    <Link
      {...commonProps}
    >
      <p className={styledNavMenu.linkMenu}>{label}</p>
    </Link>
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
