import * as React from 'react';
import { Link } from 'gatsby';

import { classnames } from '../../helpers';

import * as styles from './nav-menu.module.scss';

const NavMenu = ({ className, openMenu }) => {
  const menuElements = [
    {label: 'Work', path:'https://xmartlabs.com/work'},
    {label: 'Services', path:'https://xmartlabs.com/services' },
    {label: 'Our Company', path:'https://xmartlabs.com/company' },
    {label: 'Community', path:'https://xmartlabs.com/community' },
    {label: 'Blog', path:'/'},
    {label: 'Work with us', path:'https://xmartlabs.com/careers'},
  ];
  
  return (
    menuElements.map(({label, path}) => {
      if (path.charAt(0) === '/')
        // Local link, use <Link> component
        return (
          <Link className={classnames(styles.linkTextContainer, className)} key={label} to={path} rel="noopener noreferrer">
            <h5 className={classnames(styles.link, {text__heading__two__separated__blueOne: openMenu})}>{label}</h5>
          </Link>
        );
      
      return (
        // External link, use <a> tag
        <a
          key={label}
          href={path}
          className={classnames(styles.linkTextContainer, className)}
        >
          <h5 className={classnames(styles.link, {text__heading__two__separated__blueOne: openMenu})}>{label}</h5>
        </a>
      );
    })
  );
}

export { NavMenu };
