import React, { useState } from 'react';

import { NavMenuElements } from './nav-menu-elements';
import { MobileMenu } from './mobile-nav-menu';

import { useMediaQuery } from '../../hooks';
import { XmartlabsLogo } from '../icons';
import { TypeForm } from '../typeform/typeform';

export const NavMenu = () => {
  const isMobile = useMediaQuery('(max-width: 992px)');
  const [showTypeForm, setShowTypeForm] = useState(false);
  return (
    <>
      {showTypeForm && <TypeForm onClick={() => setShowTypeForm(false)} />}
      <div className="flex w-[100%] h-[95px] justify-center bg-white fixed z-[1] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.14)]">
        {isMobile && <MobileMenu />}
        <div className="flex items-center flex-row justify-between static w-[90%] max-w-[1300px]">
          <div className="flex flex-row items-center">
            <a href="/" id="logo-xl" aria-label="Blog Home">
              <XmartlabsLogo />
            </a>
            {!isMobile && <NavMenuElements />}
          </div>
          {!isMobile && (
            <button
              className="
                  w-[147px] h-[44px] flex justify-center items-center bg-[#ee1a64] text-white 
                  no-underline relative top-0 transition-[top] ease duration-200 border-none 
                  cursor-pointer font-primary hover:top-[-4px]
                "
              id="header-getintouch"
              onClick={() => setShowTypeForm(true)}
            >
              <div className="leading-[22px] text-[14px] font-black tracking-[0.5px] max-h-[17px]">
                Let's Talk
              </div>
            </button>
          )}
        </div>
      </div>
    </>
  );
};
