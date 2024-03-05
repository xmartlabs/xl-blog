import React, { useState } from 'react';

import PropTypes from 'prop-types';

import { Seo } from '../components/seo/seo.jsx';
import { NavMenu } from '../components/nav-menu/index.js';
import { Footer } from '../components/footer/index.js';



function MainLayout({ children }) {
  return (
    <>
      <Seo />
      <NavMenu />
      {children}
      <Footer />
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
