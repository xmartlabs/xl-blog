import { createContext, Dispatch, SetStateAction } from 'react';

const BannerType = {
  author: 'author',
  blog: 'blog',
  home: 'home',
};

const StateType = {
  type: BannerType,
};

const initialState = {
  type: BannerType.home,
};

const AppContext = createContext<{
  state: StateType,
  setState: Dispatch<SetStateAction>
}>({ state: initialState, setState: () => {} });

export { AppContext, initialState, BannerType, StateType };
