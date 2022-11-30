import * as React from "react";

// import styled from 'styled-components'; 
import * as styledFooter from "./footer.module.scss";  

const Footer = ({children}) => (
  <div className={styledFooter.container}>
    {children}
  </div>
);

export default Footer;
