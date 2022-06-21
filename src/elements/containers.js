import styled from 'styled-components';   

export const StyledContainerWrapper = styled.div`
    height: 100%;
    display: grid;
    grid-template-columns: 1fr repeat(12, 1fr) 1fr;
    grid-template-rows: 6rem auto 6rem;
    gap: 0 2rem;


    @media ${props => props.theme.breakpoints.tablet} {
        grid-template-columns: 2fr repeat(6, 1fr) 2fr;
        grid-gap: 0 1rem;
    }

    @media ${props => props.theme.breakpoints.mobile} {
        grid-template-columns: 1fr repeat(6, 1fr) 1fr;
    }
`

export const StyledFormWrapper = styled.div`
    
    max-width: 450px;
    margin: 0px auto;

    @media ${props => props.theme.breakpoints.tablet} {
    
    }

    @media ${props => props.theme.breakpoints.mobile} {
    
    }
`

export const StyledContainerCentered = styled.div`
    text-align: center;
`

export const StyledContainerHeader = styled.div`
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    display: flex;
    position: static;
    width: 85%;
    max-width: 1300px;
    
    @media ${props => props.theme.breakpoints.tablet} {
    }

    @media ${props => props.theme.breakpoints.mobile} {
    }
`

export const StyledContainerNavBarXL = styled.div`
    /*position: fixed;*/
    display: flex;
    width: 100%;
    height: 95px;
    justify-content: center;
    align-items: stretch;
    background-color: #fff;
    object-fit: fill;
    
    @media ${props => props.theme.breakpoints.tablet} {
    }

    @media ${props => props.theme.breakpoints.mobile} {
    }
`
