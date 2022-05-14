import * as React from "react"
import styled from 'styled-components';   

export const StyledFooter = styled.div`
  grid-column-start: 2;
  grid-column-end: span 12;
  grid-row-start: 3;
  grid-row-end: span 1;

`

const Footer = ({children}) => {
  return (<StyledFooter>
            {children}
          </StyledFooter>)
}

export default Footer
