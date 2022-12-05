import React from "react";
import PropTypes from "prop-types";

import Footer from "../components/footer";
import NavBar from "../components/nav-bar";
import { StyledContainerWrapper } from "../elements/containers";

const Layout = ({ children }) => {
  return (
    <StyledContainerWrapper>
      <NavBar />
        <main>
          {children}
        </main>
      <Footer />
    </StyledContainerWrapper>
  )
}

Layout.propTypes = {
  children: PropTypes.object.isRequired,
};

export default Layout;
