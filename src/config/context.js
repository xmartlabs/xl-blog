import React, { createContext } from "react";

const BannerType = {
  author: 'author',
  blog: 'blog',
  home: 'home',
};

const initialState = {
  type: BannerType.home,
};

const StateType = {
  type: BannerType,
};

const AppContext = createContext({ state: initialState, setState: () => {} });

export { AppContext, BannerType, initialState, StateType };
