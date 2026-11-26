import React from 'react';

import { SocialElement } from './social-element';
import { Facebook, InstagramIcon, Linkedin, TwitterIcon } from '../icons';

const shareXlProfileLinks = [
  {
    path: 'https://www.instagram.com/xmartlabs',
    icon: <InstagramIcon />,
    id: 'socialMenuInstagram',
    label: 'Xmartlabs on Instagram',
  },
  {
    path: 'https://www.linkedin.com/company/xmartlabs/mycompany/',
    icon: <Linkedin />,
    id: 'socialProfileLinkedIn',
    label: 'Xmartlabs on LinkedIn',
  },
  {
    path: 'https://twitter.com/xmartlabs',
    icon: <TwitterIcon />,
    id: 'socialProfileTwitter',
    label: 'Xmartlabs on X (Twitter)',
  },
  {
    path: 'https://es-la.facebook.com/xmartlabs/',
    icon: <Facebook />,
    id: 'socialProfileFacebook',
    label: 'Xmartlabs on Facebook',
  },
];

// Xmartlabs profile links shown at the bottom of every post.
export const XlProfileLinks = ({ className = '' }) => (
  <SocialElement className={className} links={shareXlProfileLinks} />
);
