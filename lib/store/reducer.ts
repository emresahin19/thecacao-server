import { configureStore } from '@reduxjs/toolkit';
import menuReducer from './menu.slice';
import darkModeReducer from './dark-mode.slice';
import sidebarReducer from './sidebar.slice';
import userReducer from './user.slice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from './store.props';

const store = configureStore({
  reducer: {
    menu: menuReducer,
    darkMode: darkModeReducer,
    sidebar: sidebarReducer,
    user: userReducer,
  },
});

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store;