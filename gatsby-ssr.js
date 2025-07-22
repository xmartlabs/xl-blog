import MainLayout from './src/layouts/main-layout';
import React from 'react';

export const wrapPageElement = ({ element, props }) => {
  return <MainLayout {...props}>{element}</MainLayout>;
};
