import React, { useEffect, useState } from "react";

import Helmet from "react-helmet";
import { withPrefix, Link} from "gatsby";
import PropTypes from "prop-types";
import styled from "styled-components";
import { StaticImage } from "gatsby-plugin-image";

import { actualCategory, classnames } from "../helpers";

import { NavMenu } from "../components/nav-menu";
import { Footer } from "../components/footer";
import { MobileMenu } from "../components/mobile-menu";
import { SocialElement } from "../components/social-element";
import { StyledContainerHeader, StyledContainerNavBarXL } from "../elements";
import { AppContext, initialState } from "../config/context.js";
import { TwitterIcon, Facebook, Linkedin, InstagramIcon, XlFooter} from "../components/icons";

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
export const StyledFooterTextTitle = styled.label`
  color: #959595;
  size: 17px;
  line-height: 30px;
`

export const StyledFooterText = styled.label`
  color: #fff;
  size: 17px;
  line-height: 50px;    
`

const filters = [
  {name: "all", displayName: "All"},
  {name: "development", displayName: "Development"},
  {name: "product-design", displayName: "Design"},
  {name: "machine-learning", displayName: "Machine Learning"},
  {name: "blockchain", displayName: "Blockchain"},
  {name: "people-events", displayName: "People"},
];

function Layout({ children }) {  
  const [contextState, setContextState] = useState(initialState);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [ category, setCategory ] = useState('all');

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 1);
    setCategory(actualCategory(true));
  }, [category]);

  const filterLinks = () => (
    <div className={styles.filterContainer} >
        {filters.map((filter) =>
          <Link
            onClick={() => setCategory(filter.name)}
            className={classnames(styles.filterElement, "text__filter__grayFive", filter.name === category && styles.selectedLink)} 
            to={filter.name === 'all' ? '/' : `/categories/${filter.name}/`}>
            {filter.displayName}
          </Link>
        )}
    </div>
  );

  const shareXlProfileLinks = [
    {
      path: "https://www.instagram.com/xmartlabs", 
      icon: <InstagramIcon />,
      id: "socialMenuInstagram"
    },
    {
      path: "https://www.linkedin.com/company/xmartlabs/mycompany/", 
      icon: <Linkedin />,
      id: "socialProfileLinkedIn"
    },
    {
      path: "https://twitter.com/xmartlabs", 
      icon: <TwitterIcon />,
      id: "socialProfileTwitter"
    },
    {
      path: "https://es-la.facebook.com/xmartlabs/", 
      icon: <Facebook />,
      id: "socialProfileFacebook"
    },
  ];
  
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
          <div className={isMobile && styles.logoMobile}>
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
          <div className={styles.columnSocialContainer}>
            <div className={styles.columnContainer}>
              <div className={classnames(styles.columnFooter, styles.socialFirst)}>
                <StyledFooterTextTitle>Company</StyledFooterTextTitle>
                <StyledFooterText>Services</StyledFooterText>
                <StyledFooterText>Work</StyledFooterText>
                <StyledFooterText>Our Company</StyledFooterText>
              </div>                        
            
              <div className={styles.columnFooter}>
                <StyledFooterTextTitle>Community</StyledFooterTextTitle>
                <StyledFooterText>Community</StyledFooterText>
                <StyledFooterText>Open Positions</StyledFooterText>
                <StyledFooterText>Blog</StyledFooterText>
              </div>
            </div>
            <div className={styles.socialElementContainer}>
            {isMobile && <XlFooter className={styles.footerMobileLogo}/>}
            <SocialElement className={classnames(styles.socialBottom, styles.blogIcons)} links={shareXlProfileLinks} />
            </div>
          </div>
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
