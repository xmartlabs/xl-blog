import React from "react"
import Footer from "../components/footer"
import NavBar from "../components/nav-bar"
import styled from "styled-components"
import Helmet from "react-helmet"
import { StyledContainerWrapper } from "../elements/containers"
import { withPrefix } from "gatsby"

export const StyledMain = styled.main`
  grid-column-start: 2;
  grid-column-end: span 12;
  grid-row-start: 2;
  grid-row-end: span 1;
`

function Layout({ children, pageContext }) {
      return (
        <>
          <StyledContainerWrapper>
            <NavBar />
            <StyledMain>
              {children}
            </StyledMain>
            <Footer />
          </StyledContainerWrapper>
          <Helmet>
            <script src={withPrefix('identity.js')} type="text/javascript"></script>
          </Helmet>
        </>
      )
}

export default Layout
