
import { CategoryProps, ContactProps, ProductProps } from '@asim-ui/interfaces';
import { Draft } from 'immer';
import store from './reducer';

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export interface UserPayloadObject {
    name: string
    email: string
}

export interface DarkModeState {
    isEnabled: boolean
}

export interface MenuState {
    data: Draft<CategoryProps>[];
    contacts?: ContactProps;
    selectedCategory?: Draft<CategoryProps> | null;
    selectedProduct?: Draft<ProductProps> | null;
}
  