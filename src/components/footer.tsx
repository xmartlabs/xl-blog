import * as React from "react"
import styled from 'styled-components';   

export const StyledFooter = styled.div`
  width: 100%;
  justify-content: center;
  display: flex;
  position: relative;
  overflow: hidden;
  height: 25vh;
  background-color: #161616;
  flex-direction: column;
  align-items: center;
`

const Footer = ({children}) => {
  return (<StyledFooter>
            {children}
          </StyledFooter>)
}

export default Footer
