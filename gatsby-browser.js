import React from 'react';

import { AppContextProviderComponent } from './src/context/context';
import MainLayout from '/src/layouts/main-layout';
import 'prismjs/themes/prism-okaidia.css';
import './src/styles/global.css';

export const wrapRootElement = ({ element }) => {
  return (
    <AppContextProviderComponent>
      <MainLayout>{element}</MainLayout>
    </AppContextProviderComponent>
  );
};

// Track page views
export const onRouteUpdate = ({ location, prevLocation }) => {
  // Track page view with Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.GATSBY_GA_MEASUREMENT_ID, {
      page_location: window.location.href,
      page_path: location.pathname + location.search + location.hash,
    });
  }

  // Track with Google Tag Manager (for route changes)
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'route-change',
      page_location: window.location.href,
      page_path: location.pathname + location.search + location.hash,
    });
  }
};
