
import { CategoryProps, ContactProps, ProductProps } from 'lib/interfaces';
import { Draft } from 'immer';
import store from './reducer';

export type RootState = ReturnType<ReturnType<typeof store>['getState']>;
export type AppDispatch = ReturnType<typeof store>['dispatch'];

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

export interface ModalState {
    show?: boolean;
    component?: string | null;
    backRoute?: string | null;
    data?: any;
}
