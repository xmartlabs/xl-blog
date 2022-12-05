import { useRef } from "react";

import PropTypes from "prop-types";

import * as headerStyles from "./header.module.scss";

const Header = props => {
  const headerRef = useRef(null);
  const {
    sticky = true,
    stickyMobile = false,
    maxWidth,
    backgroundColor,
    boxShadow,
    justify,
    border,
    ...rest
  } = props;

  return (
  <header
    ref={headerRef}
  >
    <div id="header-content" className={headerStyles.container}>
      {...rest}
    </div>
  </header>
  );
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
};

export default Header;
