import * as React from "react";
import PropTypes from "prop-types";

import * as footerStyles from "./footer.module.scss";  

const Footer = ({ children }) => (
  <div className={footerStyles.container}>
    {children}
  </div>
);

Footer.propTypes = {
  children: PropTypes.object.isRequired,
};

export default Footer;
