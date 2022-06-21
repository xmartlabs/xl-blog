import * as React from "react"
import { Link, navigate,  } from "gatsby"
import styled from "styled-components"


const StyledNavBar = styled.div`
  grid-column-start: 2;
  grid-column-end: span 11;
  grid-row-start: 1;
  grid-row-end: span 1;
`

const Nav = styled.nav`
`


const NavBar = () => {
    
  return (
    <StyledNavBar>
      <Nav>
        <Link to="/">Work</Link>
        <Link to="/">Services</Link>
        <Link to="/">Our Company</Link>
        <Link to="/">Community</Link>
        {` `}
        <a href="https://xmartlabs.com">XL Website</a>
        {` `}
      </Nav>
    </StyledNavBar>
  )
}

export default NavBar
