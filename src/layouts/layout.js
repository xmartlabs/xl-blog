import React from "react"
import Header from "../components/header"
import Logo from "../components/logo"
import NavMenu from "../components/nav-menu"
import Footer from "../components/footer"
import styled from "styled-components"
import Helmet from "react-helmet"
import { StyledContainerWrapper } from "../elements"
import { withPrefix} from "gatsby"

export const StyledMain = styled.main`
  grid-column-start: 2;
  grid-column-end: span 12;
  grid-row-start: 2;
  grid-row-end: span 1;
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
            <StyledContainerWrapper>
                <Header>
                    <Logo/>
                    <NavMenu menuItems={menuElements}/>
                </Header>
                <StyledMain>
                    {children}
                </StyledMain>
                <Footer>
                    <h1>Footer</h1>
                </Footer>
            </StyledContainerWrapper>
            <Helmet>
                <script src={withPrefix('identity.js')} type="text/javascript"></script>
            </Helmet>
        </>
    )
}

export default Layout
