import React from "react";

import Helmet from "react-helmet";
import { withPrefix, Link} from "gatsby";

import styled from "styled-components";
import { StaticImage } from "gatsby-plugin-image";

import { NavMenu } from "../components/nav-menu";
import { Footer } from "../components/footer";
import { StyledContainerHeader, StyledContainerNavBarXL } from "../elements";
import "../index.scss";
import { classnames } from "../helpers/utils";

import * as styles from "./layout.module.scss";
import { useState } from "react";

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
  justify-content: flex-end;
  margin-left: 3em;
  width: 100%;
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
function Layout({ children, path }) {

  console.log(path)
  return (
    <>
      <div className={classnames(styles.bannerBlogContainer, styles.bannerHomeContainer)}>
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
              <NavMenu />
            </div>
            <StyledGetStartedButton id="header-getintouch" 
              href="#/" 
            >
            <StyledGetStartedTextButton>GET STARTED</StyledGetStartedTextButton>
            </StyledGetStartedButton>
          </StyledContainerHeader>
        </StyledContainerNavBarXL>
        {children}
      </div>
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

          <div className={styles.footerCol}>
            <div>
              <StyledFooterTextTitle>Media</StyledFooterTextTitle>
            </div>
            <div>
              <StyledFooterText>Linkedin</StyledFooterText>
            </div>
            <div>
              <StyledFooterText>Instagram</StyledFooterText>
            </div>                        
            <div>
              <StyledFooterText>Github</StyledFooterText>
            </div>
          </div>
        </StyledFooterWrapper>
      </Footer>
      <Helmet>
        <script src={withPrefix('identity.js')} type="text/javascript"></script>
      </Helmet>
    </>
  );
}

export default Layout;
