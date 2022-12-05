import React from "react";

import Footer from "../components/footer";
import NavBar from "../components/nav-bar";
import { StyledContainerWrapper } from "../elements/containers";

function Layout({ children }) {
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

export default Layout;
