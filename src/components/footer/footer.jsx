import * as React from "react";
import PropTypes from "prop-types";

import * as styles from "./footer.module.scss";  

const Footer = ({ children }) => (
  <div className={styles.container}>
    {children}
  </div>
);

Footer.propTypes = {
  children: PropTypes.object.isRequired,
};

export { Footer };
