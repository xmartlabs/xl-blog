import React, { useState } from "react";

import Helmet from "react-helmet";
import { withPrefix, Link} from "gatsby";
import PropTypes from "prop-types";
import styled from "styled-components";
import { StaticImage } from "gatsby-plugin-image";

import { NavMenu } from "../components/nav-menu";
import { Footer } from "../components/footer";
import { MobileMenu } from "../components/mobile-menu";
import { StyledContainerHeader, StyledContainerNavBarXL } from "../elements";
import { HomeBanner } from "../components/home-banner";
import { AppContext, initialState, BannerType } from "../config/context.js";
import { SocialElement } from "../components/social-element";
import { TwitterIcon, Facebook, Linkedin, InstagramIcon, LinkedInIcon, GithubIcon } from "../components/icons";
import { classnames } from "../helpers";
import "../index.scss";

import { useMediaQuery } from "../hooks";

import * as styles from "./layout.module.scss";

export const StyledGetStartedButton = styled.a`
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
  font-weight: 700;
  letter-spacing: .5px;
  max-height: 17px;
`
export const StyledFooterWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 85%;
  justify-content: center;
  @media (max-width: 768px) {
  width: 100%;
  align-items: baseline;
  justify-content: space-evenly;
  padding-left: 1rem;
  }
`
export const StyledFooterTextTitle = styled.label`
  color: #959595;
  size: 17px;
  line-height: 38px;
`

export const StyledFooterText = styled.label`
  color: #fff;
  size: 17px;
  line-height: 38px;
`

function Layout({ children }) {  
  const [contextState, setContextState] = useState(initialState);
  const [ handleMenu, setHandleMenu ] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const footerSocial = [
    {path: "https://www.instagram.com/xmartlabs", icon: <InstagramIcon />, id: 'blog'},
    {path: "https://www.linkedin.com/company/xmartlabs/mycompany/", icon: <Linkedin />, id: 'blog'},
    {path: "https://es-la.facebook.com/xmartlabs/", icon: <Facebook />, id: 'blog'},
    {path: "https://twitter.com/xmartlabs", icon: <TwitterIcon />, id: 'blog'},
  ];

  const footerSocialMobile = [
    {path: "https://www.linkedin.com/company/xmartlabs/mycompany/", icon: <LinkedInIcon />, id: 'blog'},
    {path: "https://www.instagram.com/xmartlabs", icon: <InstagramIcon />, id: 'blog'},
    {path: "https://twitter.com/xmartlabs/", icon: <TwitterIcon />, id: 'blog'},
    {path: "https://github.com/xmartlabs", icon: <GithubIcon />, id: 'blog'},
  ];
  
  return (
    <>
      <AppContext.Provider value={{ state: contextState, setState: setContextState }}>
        <div className={styles[`${contextState}Banner`]}>
        {isMobile && <MobileMenu onClick={() => setHandleMenu(!handleMenu)} showMenu={handleMenu} />}
          <StyledContainerNavBarXL>
            <StyledContainerHeader>
              <div className={styles.navMenuContainer}>
                <Link
                  to="/"
                  id="logo-xl">
                  <StaticImage 
                    src="../../static/images/logo.svg"
                    alt=""
                    width={56}
                    height={56}
                  />
                </Link>
                {!isMobile && <NavMenu />}
              </div>
              {!isMobile && 
              <StyledGetStartedButton id="header-getintouch" href="#/" >
                <StyledGetStartedTextButton>GET STARTED</StyledGetStartedTextButton>
              </StyledGetStartedButton>
              }
            </StyledContainerHeader>
          </StyledContainerNavBarXL>
          {contextState === BannerType.home && <HomeBanner openMenu={handleMenu} />}
          {children}
        </div>
      </AppContext.Provider>
      <Footer>
        <StyledFooterWrapper>
          <div className={styles.desktopLogo}>
            <Link
              to="/"
              id="logo-xl-white">
              <StaticImage 
                src="../../static/images/logo-white.svg"
                alt="Xmartlabs"
                width={90}
                height={150}
              />
            </Link>
          </div>
            
          <div className={styles.footerCol}>
            <div>
              <StyledFooterTextTitle>Company</StyledFooterTextTitle>
            </div>
            <div>
              <StyledFooterText>Services</StyledFooterText>
            </div>
            <div>
              <StyledFooterText>Work</StyledFooterText>
            </div>                        
            <div>
              <StyledFooterText>Our Company</StyledFooterText>
            </div>
          </div>                        
            
          <div className={styles.footerCol}>
            <div>
              <StyledFooterTextTitle>Community</StyledFooterTextTitle>
            </div>
            <div>
              <StyledFooterText>Community</StyledFooterText>
            </div>
            <div>
              <StyledFooterText>Open Positions</StyledFooterText>
            </div>                        
            <div>
              <StyledFooterText>Blog</StyledFooterText>
            </div>
          </div>
          <SocialElement className={classnames(styles.socialBottom, {[styles.socialDisappear]: isMobile})} links={footerSocial}/>
          {isMobile && 
            <div className={styles.mobileIconContainer}>
              <a to="/" id="logo-xl-white-mobile">
                <img src="/images/logo-white-mobile.png" alt="Xmartlabs"/>
              </a>
              <SocialElement className={styles.socialBottom} links={footerSocialMobile}/>
            </div>}
        </StyledFooterWrapper>
      </Footer>
      <Helmet>
        <script src={withPrefix('identity.js')} type="text/javascript"></script>
      </Helmet>
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
