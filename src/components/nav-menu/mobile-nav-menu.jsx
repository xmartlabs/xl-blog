import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { NavMenuElements } from './nav-menu-elements';
import {
  GithubIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedInIcon,
  CloseIcon,
  MenuMobileIcon,
} from '../icons';

import { classnames } from '../../helpers';
import { SocialElement } from '../social-element';
import { TypeForm } from '../typeform/typeform';

const MobileNavMenu = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showTypeForm, setShowTypeForm] = useState(false);

  const mobileLinks = [
    {
      path: 'https://www.linkedin.com/company/xmartlabs/mycompany/',
      icon: <LinkedInIcon />,
      id: 'socialMenuLinkedIn',
    },
    {
      path: 'https://www.instagram.com/xmartlabs',
      icon: <InstagramIcon />,
      id: 'socialMenuInstagram',
    },
    {
      path: 'https://twitter.com/xmartlabs',
      icon: <TwitterIcon />,
      id: 'socialMenuTwitter',
    },
    {
      path: 'https://github.com/xmartlabs',
      icon: <GithubIcon />,
      id: 'socialMenuGithub',
    },
  ];

  return (
    <>
      <div
        className={classnames('w-[100%] absolute', {
          'h-[60rem] bg-neutral-100': showMenu,
        })}
      >
        {showTypeForm && <TypeForm onClick={() => setShowTypeForm(false)} />}
        <div
          className={classnames('flex flex-row justify-end', {
            hidden: showMenu,
          })}
        >
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="bg-transparent border-transparent mt-10 m-[2.5rem_5%_0_0]"
          >
            <MenuMobileIcon />
          </button>
        </div>
        {showMenu && (
          <div>
            <div className="flex flex-row justify-end">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className={classnames(
                  'flex flex-row justify-end',
                  'bg-transparent border-transparent mt-10 m-[2.5rem_5%_0_0]'
                )}
              >
                <CloseIcon className="fill-blue-one w-6" />
              </button>
            </div>
            <div className="m-[10%_0_0_5%]">
              <NavMenuElements
                className="flex flex-col ml-0 mb-6"
                openMenu={showMenu}
              />
              <div className="mt-[3rem] font-primary font-bold">
                <h4 className="text-label-bold text-blue-one">
                  Ready to partner?
                </h4>
                <button
                  onClick={() => setShowTypeForm(true)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    w-56 h-[2.8rem] flex justify-center items-center bg-xl-pink text-neutral-100 m-[1.5rem_0_4rem]
                    no-underline font-primary font-black border-none
                  "
                >
                  Let's talk
                </button>
              </div>
              <SocialElement
                links={mobileLinks}
                className="flex items-center flex-row static [&>a:nth-child(2n+0)]:mx-8"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export { MobileNavMenu as MobileMenu };

MobileNavMenu.propTypes = {
  onClick: PropTypes.func,
  showMenu: PropTypes.bool,
};

MobileNavMenu.defaultProps = {
  onClick: () => {},
  showMenu: false,
};
