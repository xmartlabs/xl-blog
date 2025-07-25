import React from 'react';

import PropTypes from 'prop-types';

import { Seo } from '../components/seo/seo.jsx';
import { NavMenu } from '../components/nav-menu/index.js';
import { Footer } from '../components/footer/index.js';
import { MDXProvider } from '@mdx-js/react';
import { Youtube } from '../components/youtube';

/* These are the React Components that we use in the MDX template */
const shortCodes = { Youtube };

function MainLayout({ children }) {
  return (
    <MDXProvider components={shortCodes}>
      <Seo />
      <NavMenu />
      {children}
      <Footer />
    </MDXProvider>
  );
}

MainLayout.propTypes = {
  children: PropTypes.object,
};

MainLayout.defaultProps = {
  children: {},
};

export default MainLayout;
