import * as React from 'react';

import { SocialElement } from '/src/components/social-element';
import {
  TwitterIcon,
  Facebook,
  Linkedin,
  InstagramIcon,
  XmartlabsTextLogoWhite,
} from '/src/components/icons';

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
    <div
      className="
        flex flex-col items-start justify-center bg-blue-one p-[5rem_0_4rem_15.5%]
        max-xxl:pl-[4%] max-sm:h-full max-sm:p-[4rem_0_3rem_1.3rem]
      "
    >
      <div className="ml-[0.9rem] max-xs:ml-[0.5rem]">
        <a
          href="https://xmartlabs.com/"
          id="logo-xl-white"
          aria-label="Xmartlabs Homepage"
        >
          <XmartlabsTextLogoWhite />
        </a>
      </div>
      <div className="mt-[2rem] flex flex-col text-default-gray">
        {navMenuElements.map(({ label, path }) => (
          <a
            key={label}
            href={path}
            className="text-[17px] my-[0.5rem] mx-[0.9rem] text-default-gray no-underline hover:text-neutral-100"
          >
            {label}
          </a>
        ))}
        <SocialElement
          className="
            flex flex-row static items-center w-full z-0 justify-end mt-[1rem]
            [&_a]:max-xs:m-[0.4rem] [&_a]:flex [&_a]:items-center [&_a]:m-[0.9rem] [&_a:hover]:brightness-150
            [&_svg]:max-xs:w-[1.1rem]
          "
          links={shareXlProfileLinks}
        />
      </div>
    </div>
  );
};
