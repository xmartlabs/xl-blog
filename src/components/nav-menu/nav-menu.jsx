import * as React from "react";
import { Link } from "gatsby";

import { classnames } from "../../helpers";

import * as styles from "./nav-menu.module.scss";

const NavMenu = ({ className, openMenu }) => {
  const menuElements = [
    {label: "Work", path:"/"},
    {label: "Services", path:"/" },
    {label: "Our Company", path:"/" },
    {label: "Community", path:"/" },
    {label: "Blog", path:"/"},
    {label: "Work with us", path:"/"},
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
          className={classnames(styles.linkTextContainer, className)}
        >
          <h5 className={classnames(styles.link, {["text__heading__two__separated__black"]: openMenu})}>{commonProps.key}</h5>
        </Link>
      )
    })
  );
}

export { NavMenu };
