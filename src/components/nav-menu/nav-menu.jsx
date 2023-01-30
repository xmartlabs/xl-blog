import * as React from "react";
import { Link } from "gatsby";

import { classnames } from "../../helpers";

import * as navMenuStyles from "./nav-menu.module.scss";

const NavMenu = ({ className }) => {
  const menuElements = [
    {label: "Work", path:"/"},
    {label: "Services", path:"/" },
    {label: "Our Company", path:"/" },
    {label: "Community", path:"/" },
  ];
  return (
    menuElements.map(({label, path}) => {
      let commonProps = {
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
          className={classnames(navMenuStyles.linkTextContainer, className)}
        >
          <h5 className={navMenuStyles.link}>{commonProps.key}</h5>
        </Link>
      )
    })
  );
}

export { NavMenu };
