import React, { useState } from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';

import { classnames } from '../helpers';
import { useMediaQuery } from '../hooks';

import { HeaderBanner } from '../components/header-banner/header-banner';
import { NavMenu } from '../components/nav-menu';
import { Footer } from '../components/footer';
import { MobileMenu } from '../components/mobile-menu';
import { SocialElement } from '../components/social-element';
import { StyledContainerHeader, StyledContainerNavBarXL } from '../elements';
import { AppContext, initialState } from '../config/context.js';
import { TwitterIcon, Facebook, Linkedin, InstagramIcon, LogoWhite, Logo} from '../components/icons';
import { TypeForm } from '../components/typeform/typeform';

import "../index.scss";
import * as styles from './layout.module.scss';
import { Seo } from '../components/seo/seo.jsx';


export const StyledGetStartedButton = styled.button`
  width: 147px;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ee1a64;
  color: #fff;
  text-decoration: none;
`

export const StyledGetStartedTextButton = styled.div`
  line-height: 22px;
  font-size: 14px;
  font-weight: 900;
  letter-spacing: .5px;
  max-height: 17px;
`
export const StyledFooterText = styled.a`
  size: 17px;
  line-height: 40px;
  text-decoration: none;
`

function Layout({ children }) {  
  const [contextState, setContextState] = useState(initialState);
  const isMobile = useMediaQuery("(max-width: 992px)");
  const [ showTypeForm, setShowTypeForm ] = useState(false);

  const shareXlProfileLinks = [
    {
      path: 'https://www.instagram.com/xmartlabs', 
      icon: <InstagramIcon />,
      id: 'socialMenuInstagram'
    },
    {
      path: 'https://www.linkedin.com/company/xmartlabs/mycompany/', 
      icon: <Linkedin />,
      id: 'socialProfileLinkedIn'
    },
    {
      path: 'https://twitter.com/xmartlabs', 
      icon: <TwitterIcon />,
      id: 'socialProfileTwitter'
    },
    {
      path: 'https://es-la.facebook.com/xmartlabs/', 
      icon: <Facebook />,
      id: 'socialProfileFacebook'
    },
  ];

  return (
    <>
      <Seo />
      <AppContext.Provider value={{ state: contextState, setState: setContextState }}>
        {showTypeForm && <TypeForm onClick={() => setShowTypeForm(false)}/>}
        <div className={styles[`${contextState}Banner`]}>
          <StyledContainerNavBarXL>
            {isMobile && <MobileMenu />}
            <StyledContainerHeader>
              <div className={styles.navMenuContainer}>
                <a
                  href="https://xmartlabs.com/"
                  id="logo-xl">
                  <Logo />
                </a>
                {!isMobile && <NavMenu />}
              </div>
              {!isMobile && 
                <StyledGetStartedButton className={styles.getStarted} id="header-getintouch" onClick={() => setShowTypeForm(true)}>
                  <StyledGetStartedTextButton>Let's Talk</StyledGetStartedTextButton>
                </StyledGetStartedButton>
              }
            </StyledContainerHeader>
          </StyledContainerNavBarXL>
          {contextState === "home" && <HeaderBanner />}
        </div>
        {children}
      </AppContext.Provider>
      <Footer>
        <div className={styles.container}>
          <div className={styles.logo}>
            <a
              href="https://xmartlabs.com/"
              id="logo-xl-white">
              <LogoWhite />
            </a>
          </div>
          <div className={styles.linkContainer}>
            <div className={styles.optionContainer}>
              <StyledFooterText>Work</StyledFooterText>
              <StyledFooterText>Services</StyledFooterText>
              <StyledFooterText>Our Company</StyledFooterText>
              <StyledFooterText>Community</StyledFooterText>
              <StyledFooterText>Blog</StyledFooterText>
            </div>
            <SocialElement className={classnames(styles.socialBottom, styles.blogIcons)} links={shareXlProfileLinks} />
          </div>
        </div>
      </Footer>
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.object, 
}

Layout.defaultProps = {
  children: {},
};

export default Layout;
