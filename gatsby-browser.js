import React from 'react';

import { createGlobalStyle, ThemeProvider } from 'styled-components';
import Theme from './src/themes/theme';
import { AppContextProviderComponent } from './src/context/context';
import MainLayout from '/src/layouts/main-layout';
import 'prismjs/themes/prism-okaidia.css';

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body, html {
    font-family: ${(prop) => prop.theme.fonts.main};
    height: 100%;
    background-color: ${(prop) => prop.theme.colors.main1};
  }

  .gatsby-highlight code {
    white-space: pre-wrap !important;
    word-wrap: break-word !important;
  }

  .language-text {
    background-color: transparent !important;
    color: ${(prop) => prop.theme.colors.dark1} !important;
  }

  ;

  form > h2 {
    text-align: center;
    display: block;
    font-size: 1.4em;
    font-weight: bold;
    padding: 0px 0px 0px 0px;
    line-height: 26px;
    letter-spacing: 0px;
    font-family: ${(prop) => prop.theme.fonts.title};
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
    font-family: ${(prop) => prop.theme.fonts.links};
  }

  .category {
    font-family: ${(prop) => prop.theme.fonts.links};
  }
`;

export const wrapRootElement = ({ element }) => {
  return (
    <ThemeProvider theme={Theme}>
      <GlobalStyles />
      <AppContextProviderComponent>
        <MainLayout>{element}</MainLayout>
      </AppContextProviderComponent>
    </ThemeProvider>
  );
};

export const wrapPageElement = ({ element, props }) => {
  return <MainLayout {...props}>{element}</MainLayout>;
};
