import * as React from "react"
import { Link } from "gatsby"
import PropTypes from "prop-types"
import styled from "styled-components"

export const StyledH5 = styled.h5`
    margin-top: 10px;
    margin-bottom: 10px;
    color: #333;
    font-size: 16px;
    line-height: 20px;
    font-weight: 700;
`

const NavMenu = ({
                     width,
                     justify,
                     flex,
                     className= "",
                     classNameItem= "",
                     menuItems = [],
                     children,
                     ...props
                 }) => {

    return (
            children ? (
                children
            ) : (
                menuItems.map(({ label, path }) => (
                path.charAt(0) === "/" ? (
                    <Link to={path} 
                        sx={{ variant: "navlink" }} 
                        className={ classNameItem }
                        key={label}>
                        <StyledH5>{label}</StyledH5>
                    </Link>
                ) : (
                    <Link
                        to={path}
                        target="_blank"
                        className={ classNameItem }
                        rel="noopener noreferrer"
                        sx={{ variant: "navlink" }}
                        key={label}>
                        <StyledH5>{label}</StyledH5>
                    </Link>
                )
                ))
            ) 
    )
}

NavMenu.propTypes = {
    flex: PropTypes.bool,
    justify: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    width: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.array,
    ]),
    menuItems: PropTypes.array,
    children: PropTypes.node,
}

export default NavMenu
