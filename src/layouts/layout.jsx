import React, { useEffect, useState } from 'react';

import Helmet from 'react-helmet';
import { withPrefix, Link} from 'gatsby';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { actualCategory, classnames } from '../helpers';

import { HeaderBanner } from '../components/header-banner/header-banner';
import { NavMenu } from '../components/nav-menu';
import { Footer } from '../components/footer';
import { MobileMenu } from '../components/mobile-menu';
import { SocialElement } from '../components/social-element';
import { StyledContainerHeader, StyledContainerNavBarXL } from '../elements';
import { AppContext, initialState } from '../config/context.js';
import { TwitterIcon, Facebook, Linkedin, InstagramIcon, LogoWhite, Logo} from '../components/icons';
import { useMediaQuery } from '../hooks';

import '../index.scss';

import * as styles from './layout.module.scss';


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
  font-weight: 900;
  letter-spacing: .5px;
  max-height: 17px;
`
export const StyledFooterText = styled.a`
  size: 17px;
  line-height: 40px;
  text-decoration: none;
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
  const isMobile = useMediaQuery("(max-width: 992px)");
  const [ category, setCategory ] = useState('all');

  useEffect(() => {
    setCategory(actualCategory(true, filters));
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

  const filterMobileDesktop = () => {
    if (contextState === 'home') {
      if (isMobile) {
        return (
          <div className={styles.filterMobileContainer}>
            {filterLinks()}
          </div>
        );
      } else {
        return filterLinks();
      }
    }
    return null;
  };
  
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
                    <Logo />
                  </Link>
                  {!isMobile && <NavMenu />}
                </div>
                {!isMobile && 
                <StyledGetStartedButton className={styles.getStarted} id="header-getintouch" href={process.env.GATSBY_CONTACT_FORM}>
                  <StyledGetStartedTextButton>GET STARTED</StyledGetStartedTextButton>
                </StyledGetStartedButton>
                }
              </StyledContainerHeader>
            </StyledContainerNavBarXL>
            {contextState === "home" && <HeaderBanner />}
        </div>
        {filterMobileDesktop()}
        {children}
      </AppContext.Provider>
      <Footer>
        <div className={styles.container}>
          <div className={styles.logo}>
            <Link
              to="/"
              id="logo-xl-white">
              <LogoWhite />
            </Link>
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
