import React from "react";

import Helmet from "react-helmet";
import { withPrefix, Link} from "gatsby";

import styled from "styled-components";
import { StaticImage } from "gatsby-plugin-image";

import NavMenu from "../components/nav-menu/nav-menu.js";
import Footer from "../components/footer/footer.tsx";
import { navMenu, navMenuItem, footerCol, desktopLogo } from '../layouts/layout.module.scss';
import { StyledContainerHeader, StyledContainerNavBarXL } from "../elements";

export const StyledMain = styled.main`
  grid-column-start: 2;
  grid-column-end: span 12;
  grid-row-start: 2;
  grid-row-end: span 1;
`

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

const menuElements = [
  {label: "Work", path:"/"},
  {label: "Services", path:"/" },
  {label: "Our Company", path:"/" },
  {label: "Community", path:"/" },
];

function Layout({children, pageContext}) {
  return (
    <>
      <StyledContainerNavBarXL>
        <StyledContainerHeader>
          <div className={navMenu}>
            <Link
              to="/"
              id="logo-xl">
              <StaticImage 
                src="../../static/images/logo.svg"
                alt=""
                width={40}
                height={40}
              />
            </Link>
            <NavMenu menuItems={menuElements} classNameItem={navMenuItem} />
          </div>
          <StyledGetStartedButton id="header-getintouch" 
            href="#/" 
          >
            <StyledGetStartedTextButton>GET STARTED</StyledGetStartedTextButton>
          </StyledGetStartedButton>
        </StyledContainerHeader>
      </StyledContainerNavBarXL>
      <StyledMain>
        {children}
      </StyledMain>
      <Footer>
        <StyledFooterWrapper>
          <div className={ desktopLogo}>
            <Link
              to="/"
              id="logo-xl-white">
              <StaticImage 
                src="../../static/images/logo-white.svg"
                alt=""
                width={90}
                height={150}
              />
            </Link>
          </div>
            
          <div className={ footerCol }>
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
            
          <div className={ footerCol }>
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

          <div className={ footerCol }>
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
