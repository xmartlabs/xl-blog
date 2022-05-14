import * as React from "react"
import { Link } from "gatsby"
import PropTypes from "prop-types"

const NavMenu = ({
                     width,
                     justify,
                     flex,
                     menuItems = [],
                     children,
                     ...props
                 }) => {

    return (
        <nav
            id="nav-primary"
            aria-label="Primary Navigation Menu"
            className=""
            >
            {children ? (
                children
            ) : (
                <ul
                    {...props}
                    id="menu-primary"
                    role="menu"
                    >
                    {menuItems.map(({ label, path }) => (
                        <li key={label}>
                            {path.charAt(0) === "/" ? (
                                <Link to={path} sx={{ variant: "navlink" }}>
                                    {label}
                                </Link>
                            ) : (
                                <Link
                                    to={path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ variant: "navlink" }}>
                                    {label}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </nav>
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
