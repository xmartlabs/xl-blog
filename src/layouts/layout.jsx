import React, { useState } from "react";

import Helmet from "react-helmet";
import { withPrefix, Link} from "gatsby";
import PropTypes from "prop-types";
import styled from "styled-components";
import { StaticImage } from "gatsby-plugin-image";

import { classnames } from "../helpers";

import { NavMenu } from "../components/nav-menu";
import { Footer } from "../components/footer";
import { MobileMenu } from "../components/mobile-menu";
import { StyledContainerHeader, StyledContainerNavBarXL } from "../elements";
import { AppContext, initialState } from "../config/context.js";
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
  justify-content: flex-end;
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
const filters = [
  {name: "all", displayName: "All"},
  {name: "development", displayName: "Development"},
  {name: "product-design", displayName: "Design"},
  {name: "machine-learning", displayName: "Machine Learning"},
  {name: "blockchain", displayName: "Blockchain"},
  {name: "people-events", displayName: "People"},
];

const getPath = () => {
  if (typeof window !== 'undefined') {
    if (window.location.href === 'http://localhost:8000/') {
      return 'all';
    }
  }
  return filters.find(({ name }) => window.location.href.includes(name))?.name;
}

function Layout({ children }) {  
  const [contextState, setContextState] = useState(initialState);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [ category, setCategory ] = useState(getPath());

  const filterLinks = () => (
    <div className={styles.filterContainer} >
        {filters.map((filter) =>
          <Link 
            onClick={() => {setCategory(filter.name)}} 
            className={classnames(styles.filterElement, "text__filter__grayFive", filter.name === category && styles.selectedLink)} 
            to={filter.name === 'all' ? '/' : `/categories/${filter.name}/`}>
            {filter.displayName}
          </Link>
        )}
    </div>
  );
  
  return (
    <>
      <AppContext.Provider value={{ state: contextState, setState: setContextState }}>
        <div className={styles[`${contextState}Banner`]}>
            <StyledContainerNavBarXL>
            {isMobile && <MobileMenu />}
              <StyledContainerHeader>
                <div className={styles.navMenuContainer}>
                  <Link
                    to="/"
                    id="logo-xl">
                    <StaticImage 
                      src="../../static/images/logo.png"
                      alt=""
                      width={56}
                      height={56}
                    />
                  </Link>
                  {!isMobile && <NavMenu />}
                </div>
                {!isMobile && 
                <StyledGetStartedButton id="header-getintouch" href={process.env.GATSBY_CONTACT_FORM}>
                  <StyledGetStartedTextButton>GET STARTED</StyledGetStartedTextButton>
                </StyledGetStartedButton>
                }
              </StyledContainerHeader>
            </StyledContainerNavBarXL>
        </div>
        {contextState === "home" && filterLinks()}
        {children}
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

Layout.propTypes = {
  children: PropTypes.object, 
}

Layout.defaultProps = {
  children: {},
};

export default Layout;
