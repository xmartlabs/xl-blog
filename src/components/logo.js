import * as React from "react"
import { Link } from "gatsby"
import PropTypes from "prop-types"
import { GatsbyImage, getImage } from "gatsby-plugin-image"


const Logo = ({                
                path = "/",  
                image,
                  ...props
              }) => {
    const img = getImage(image)
    return (
        <Link
            {...props}
            to={path}
            id="logo"
            >
            <GatsbyImage 
                image= {img}
                alt=""
                width={40}
                height={40}
            />
        </Link>
    )
}

Logo.propTypes = {
    path: PropTypes.string,
    colorOptions: PropTypes.object,
    height: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.array,
    ]),
    children: PropTypes.node,
}

export default Logo
