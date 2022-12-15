import React, { createContext } from "react";

const BannerType = {
  author: 'author',
  blog: 'blog',
  home: 'home',
};

const initialState = BannerType.home;

const AppContext = createContext({ state: initialState, setState: () => {} });

export { AppContext, BannerType, initialState };
