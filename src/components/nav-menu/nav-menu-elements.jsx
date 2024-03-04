import * as React from 'react';
import { Link } from 'gatsby';

import { classnames } from '../../helpers';

import * as styles from './nav-menu-elements.module.scss';

export const NavMenuElements = ({ className, openMenu }) => {
  const menuElements = [
    {label: 'Work', path:'https://xmartlabs.com/work'},
    {label: 'Services', path:'https://xmartlabs.com/services' },
    {label: 'Our Company', path:'https://xmartlabs.com/company' },
    {label: 'Community', path:'https://xmartlabs.com/community' },
  ];
  
  return (
    menuElements.map(({label, path}) => {
      const text = <h5 className={classnames(styles.link, {text__heading__two__separated__blueOne: openMenu})}>{label}</h5>;
      const mergedClassName = classnames(styles.linkTextContainer, className);

      if (path.charAt(0) === '/')
        // Local link, use <Link> component
        return <Link key={label} to={path} rel="noopener noreferrer" className={mergedClassName}>{text}</Link>;
      
      // External link, use <a> tag
      return <a key={label} href={path} className={mergedClassName}>{text}</a>;
    })
  );
}
