import * as React from "react";
import { Link } from "gatsby";

import { classnames } from "../../helpers";

import * as styles from "./nav-menu.module.scss";

const NavMenu = ({ className, openMenu }) => {
  const menuElements = [
    {label: "Work", path:"/work"},
    {label: "Services", path:"/services" },
    {label: "Our Company", path:"/company" },
    {label: "Community", path:"/community" },
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
          <h5 className={classnames(styles.link, {["text__heading__two__separated__blueThree"]: openMenu})}>{commonProps.key}</h5>
        </Link>
      )
    })
  );
}

export { NavMenu };
