import React from "react"
import Footer from "../components/footer"
import NavBar from "../components/nav-bar"
import styled from "styled-components"
import { StyledContainerWrapper } from "../elements/containers"

export const StyledMain = styled.main`
  grid-column-start: 2;
  grid-column-end: span 12;
  grid-row-start: 2;
  grid-row-end: span 1;
`

function Layout({ children, pageContext }) {
      return (
          <StyledContainerWrapper>
            <NavBar />
            <StyledMain>
              {children}
            </StyledMain>
            <Footer />
          </StyledContainerWrapper>
      )
}

export default Layout
