import * as React from 'react';

import { SocialElement } from '/src/components/social-element';
import {
  TwitterIcon,
  Facebook,
  Linkedin,
  InstagramIcon,
  XmartlabsTextLogoWhite,
} from '/src/components/icons';

import * as styles from './footer.module.scss';
import { navMenuElements } from '../nav-menu';

export const Footer = () => {
  const shareXlProfileLinks = [
    {
      path: 'https://www.instagram.com/xmartlabs',
      icon: <InstagramIcon />,
      id: 'socialMenuInstagram',
    },
    {
      path: 'https://www.linkedin.com/company/xmartlabs/mycompany/',
      icon: <Linkedin />,
      id: 'socialProfileLinkedIn',
    },
    {
      path: 'https://twitter.com/xmartlabs',
      icon: <TwitterIcon />,
      id: 'socialProfileTwitter',
    },
    {
      path: 'https://es-la.facebook.com/xmartlabs/',
      icon: <Facebook />,
      id: 'socialProfileFacebook',
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <a
          href="https://xmartlabs.com/"
          id="logo-xl-white"
          aria-label="Xmartlabs Homepage"
        >
          <XmartlabsTextLogoWhite />
        </a>
      </div>
      <div className={styles.linkContainer}>
        {navMenuElements.map(({ label, path }) => (
          <a key={label} href={path} className={styles.footerLink}>
            {label}
          </a>
        ))}
        <SocialElement
          className={styles.blogIcons}
          links={shareXlProfileLinks}
        />
      </div>
    </div>
  );
};
