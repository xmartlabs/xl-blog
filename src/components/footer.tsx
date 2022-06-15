import * as React from "react"
import styled from 'styled-components';   

export const StyledFooter = styled.div`
  width: 100%;
  justify-content: center;
  display: flex;
  position: relative;
  overflow: hidden;
  height: 40vh;
  background-color: #161616;

`

const Footer = ({children}) => {
  return (<StyledFooter>
            {children}
          </StyledFooter>)
}

export default Footer
