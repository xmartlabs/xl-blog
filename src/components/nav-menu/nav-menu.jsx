import * as React from "react";
import { Link } from "gatsby";

import { classnames } from "../../helpers";

import * as styles from "./nav-menu.module.scss";

const NavMenu = ({ className, openMenu }) => {
  const menuElements = [
    {label: "Work", path:"https://xmartlabs.com/work"},
    {label: "Services", path:"https://xmartlabs.com/services" },
    {label: "Our Company", path:"https://xmartlabs.com/company" },
    {label: "Community", path:"https://xmartlabs.com/community" },
    {label: "Blog", path:"/"},
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
