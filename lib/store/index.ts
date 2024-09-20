import store , { useAppDispatch, useAppSelector, wrapper } from './reducer';
export * from './menu.slice';
export * from './dark-mode.slice';
export * from './sidebar.slice';
export * from './user.slice';

export {
    store,
    wrapper,
    useAppDispatch, 
    useAppSelector,
}

export type {
    AppDispatch,
    RootState,
} from './store.props';