import styled from 'styled-components';   

export const StyledFormButton = styled.button`
  font-family: ${prop => prop.theme.fonts.titles};
  color: #fff;
  background-color: ${props => props.theme.colors.dark1 };
  padding: 1rem 2rem 1rem 2rem;
  font-size: 0.8rem;
  line-height: 1;
  border-radius: 5px;
  transition-property: background-color,border-color,color,box-shadow,filter;
  transition-duration: .3s;
  border-width: 0;
  letter-spacing: 2px;
  min-width: 160px;
  text-transform: uppercase;
  white-space: normal;
  cursor: pointer;

  @media ${props => props.theme.breakpoints.tablet} {
  
  }

  @media ${props => props.theme.breakpoints.mobile} {
  
  }
`

export const StyledButton = styled(StyledFormButton)`
  border-radius: 5px;
  position: relative;
  top: 0;
  &:hover {
    box-shadow: ${props => props.theme.shadows.shadow1 };
    top: -2px;
  }
  transition: ${props => props.theme.animations.button };
`
