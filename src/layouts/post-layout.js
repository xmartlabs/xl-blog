import React from "react";

import Footer from "../components/footer";
import NavBar from "../components/nav-bar";
import { StyledContainerWrapper } from "../elements/containers";

import * as styledPostLayout from "./post-layout.module.scss";

function Layout({ children, pageContext }) {
      return (
          <StyledContainerWrapper>
            <NavBar />
            <main className={styledPostLayout.main}>
              {children}
            </main>
            <Footer />
          </StyledContainerWrapper>
      )
}

export default Layout
