import React, { useState } from 'react';

import styled from 'styled-components';

import { NavMenuElements } from './nav-menu-elements';
import { MobileMenu } from './mobile-nav-menu';

import * as styles from './nav-menu.module.scss';
import { useMediaQuery } from '../../hooks';
import { Logo } from '../icons';
import { TypeForm } from '../typeform/typeform';


const StyledGetStartedButton = styled.button`
  width: 147px;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ee1a64;
  color: #fff;
  text-decoration: none;
`

const StyledGetStartedTextButton = styled.div`
  line-height: 22px;
  font-size: 14px;
  font-weight: 900;
  letter-spacing: .5px;
  max-height: 17px;
`

const StyledContainerNavBarXL = styled.div`
  display: flex;
  width: 100%;
  height: 95px;
  justify-content: center;
  background-color: white;
  position: fixed;
  z-index: 1;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.14); 
`

const StyledContainerHeader = styled.div`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  display: flex;
  position: static;
  width: 90%;
  max-width: 1300px;
`


export const NavMenu = () => {  
  const isMobile = useMediaQuery("(max-width: 992px)");
  const [ showTypeForm, setShowTypeForm ] = useState(false);
  return (
      <>
        {showTypeForm && <TypeForm onClick={() => setShowTypeForm(false)}/>}
        <StyledContainerNavBarXL>
          {isMobile && <MobileMenu />}
          <StyledContainerHeader>
            <div className={styles.navMenuContainer}>
              <a
                href="https://xmartlabs.com/"
                id="logo-xl">
                <Logo />
              </a>
              {!isMobile && <NavMenuElements />}
            </div>
            {!isMobile && 
              <StyledGetStartedButton className={styles.getStarted} id="header-getintouch" onClick={() => setShowTypeForm(true)}>
                <StyledGetStartedTextButton>Let's Talk</StyledGetStartedTextButton>
              </StyledGetStartedButton>
            }
          </StyledContainerHeader>
        </StyledContainerNavBarXL>
      </>
  );
}
