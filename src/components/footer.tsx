import React from "react"
import styled from 'styled-components';   

export const StyledFooter = styled.div`
  grid-column-start: 2;
  grid-column-end: span 12;
  grid-row-start: 3;
  grid-row-end: span 1;

`

const Footer = () => {
  return (<StyledFooter>
            <h1>Footer</h1>
          </StyledFooter>)
}

export default Footer