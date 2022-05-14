import * as React from "react"
import PropTypes from "prop-types"
import {useRef, useLayoutEffect} from "react"
import styled from "styled-components"

const StyledHeader = styled.div`
      display: flex;
      justify-content: space-between;
`

const Header = props => {
    const headerRef = useRef(null)
    const {
        sticky = true,
        stickyMobile = false,
        maxWidth,
        backgroundColor,
        boxShadow,
        justify,
        border,
        ...rest
    } = props

    // Component Lifecycle

    useLayoutEffect(() => {
    }, [])

    // Partials

    const stickyPartial = sticky
        ? {
            position: stickyMobile ? "sticky" : ["initial", "sticky"],
            top: 0,
        }
        : null

    const borderPartial = border
        ? {borderBottom: border}
        : {borderBottom: "1px solid", borderColor: "border"}

    return (
        <header
            ref={headerRef}
        >
            <StyledHeader
                id="header-content"
                {...rest}
            />
        </header>
    )
}

Header.propTypes = {
    backgroundColor: PropTypes.string,
    sticky: PropTypes.bool,
    justify: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    boxShadow: PropTypes.string,
    maxWidth: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.array,
    ]),
    children: PropTypes.node.isRequired,
}

export default Header
