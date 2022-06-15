import React from "react"
import Logo from "../components/logo"
import NavMenu from "../components/nav-menu"
import Footer from "../components/footer"
import styled from "styled-components"
import Helmet from "react-helmet"
import { StyledContainerWrapper, StyledContainerHeader, StyledContainerNavBarXL } from "../elements"
import { withPrefix} from "gatsby"
import { navMenu, navMenuItem, col20 } from '../components/layout.module.css'

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
`
export const StyledFooterTextTitle = styled.h4`
    color: #959595;
    size: 17px;
    line-height: 38px;
`

export const StyledFooterText = styled.h4`
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
            {/* <StyledContainerWrapper> */}
                <StyledContainerNavBarXL>
                    <StyledContainerHeader>
                        <div className={navMenu}>
                            <Logo/>
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
                        <div className={ col20 }>
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
                        
                        <div className={ col20 }>
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
                        
                        <div className={ col20 }>
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

                        <div className={ col20 }>
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
 
                        <div className={ col20 }>
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
            {/* </StyledContainerWrapper> */}
            <Helmet>
                <script src={withPrefix('identity.js')} type="text/javascript"></script>
            </Helmet>
        </>
    )
}

export default Layout
