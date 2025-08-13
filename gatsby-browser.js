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
