import * as React from 'react';
import { Link } from 'gatsby';

import { classnames } from '../../helpers';

export const navMenuElements = [
  {label: 'Work', path:'https://xmartlabs.com/work'},
  {label: 'Services', path:'https://xmartlabs.com/services' },
  {label: 'Our Company', path:'https://xmartlabs.com/company' },
  {label: 'Community', path:'https://xmartlabs.com/community' },
];

export const NavMenuElements = ({ className, openMenu }) => {
  return (
    navMenuElements.map(({label, path}) => {
      const text = (
        <h5 className={classnames(
          "font-link font-bold text-blue-one text-[16px] leading-[20px] hover:text-gray-two transition-colors",
          { "text-heading-two-separated text-blue-one font-bold": openMenu }
        )}>
          {label}
        </h5>
      );
      
      const mergedClassName = classnames(
        "mt-[10px] mr-0 mb-[10px] ml-[50px] inline-block no-underline",
        className
      );

      if (path.charAt(0) === '/')
        // Local link, use <Link> component
        return <Link key={label} to={path} rel="noopener noreferrer" className={mergedClassName}>{text}</Link>;
      
      // External link, use <a> tag
      return <a key={label} href={path} className={mergedClassName}>{text}</a>;
    })
  );
}
