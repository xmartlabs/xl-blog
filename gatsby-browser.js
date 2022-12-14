import React from "react";

import { ThemeProvider, createGlobalStyle } from "styled-components";
import Theme from "./src/themes/theme";
import { AppContextProviderComponent } from "./src/context/context";
import Layout from "./src/layouts/layout";
import { AppContext } from "./src/config/context";

// Logs when the client route changes
export const onRouteUpdate = ({ location, prevLocation }) => {
  console.log("new pathname", location.pathname)
  console.log("old pathname", prevLocation ? prevLocation.pathname : null)
}

const GlobalStyles = createGlobalStyle`    
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }
    body, html {
        font-family: ${prop => prop.theme.fonts.main};
        height: 100%;
        background-color: ${prop => prop.theme.colors.main1};
    }

    form > h2 {
      text-align: center;
      display: block;
      font-size: 1.4em;
      font-weight: bold;
      padding: 0px 0px 0px 0px;
      line-height: 26px;
      letter-spacing: 0px;
      font-family: ${prop => prop.theme.fonts.title};
    }

    form label {
      display: block;
    }

    form input {
      display: block;
    }

    h2 {
      margin-top: 3rem;
      margin-bottom: 1rem;
    }

    .category, a {
      font-family: ${prop => prop.theme.fonts.links};
    }

    .category {
      font-family: ${prop => prop.theme.fonts.links};
    }
`

export const wrapRootElement = ({element}) => {
  return (<ThemeProvider theme={Theme}>
    <GlobalStyles />
    <AppContextProviderComponent>
      <AppContext.Provider value={{ state: contextState, setState: setContextState }}>
        <Layout>
          {element}
        </Layout>
      </AppContext.Provider>
    </AppContextProviderComponent>
  </ThemeProvider>)
}
