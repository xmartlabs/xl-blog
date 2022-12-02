import * as React from "react";
import { Link } from "gatsby";

import PropTypes from "prop-types";

import * as navMenuStyled from "./nav-menu.module.scss";

const NavMenu = () => {
  const menuElements = [
    {label: "Work", path:"/"},
    {label: "Services", path:"/" },
    {label: "Our Company", path:"/" },
    {label: "Community", path:"/" },
  ];
  return (
    menuElements.map(({label, path}) => {
      let commonProps = {
        sx: { variant: "navlink" }, 
        key: label, 
        to: path
      }

      if (path.charAt(0) !== "/") {
        commonProps = {
          ...commonProps,
          target: "_blank",
          rel: "noopener noreferrer"
        }
      }
      return (
        <Link
          {...commonProps}
          className={navMenuStyled.linkTextContainer}
        >
          <h5 className={navMenuStyled.link}>{commonProps.key}</h5>
        </Link>
      )
    })
  );
}

NavMenu.propTypes = {
  menuItems: PropTypes.array,
}

export default NavMenu
