import React from 'react';

import PropTypes from 'prop-types';

import { Seo } from '../components/seo/seo.jsx';
import { NavMenu } from '../components/nav-menu/index.js';
import { Footer } from '../components/footer/index.js';
import { Youtube } from '../components/youtube';
import { MDXProvider } from '@mdx-js/react';

function MainLayout({ children }) {
  return (
    <>
      <Seo/>
      <NavMenu/>
      <MDXProvider components={{ Youtube: Youtube }}>
        {children}
      </MDXProvider>
      <Footer/>
    </>
  );
}

MainLayout.propTypes = {
  children: PropTypes.object,
}

MainLayout.defaultProps = {
  children: {},
};

export default MainLayout;
