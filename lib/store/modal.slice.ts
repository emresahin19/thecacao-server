// store/modalSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { ModalState } from './store.props';
import { PayloadAction } from '@reduxjs/toolkit';

const initialState: ModalState = {
    show: false,
    component: null,
    data: null,
    backRoute: null,
    className: '',
};

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openModal: (state, action: PayloadAction<ModalState>) => {
            state.show = true;
            state.component = action.payload.component;
            state.data = action.payload.data;
            state.backRoute = action.payload.backRoute;
            state.className = action.payload.className;
        },
        closeModal: (state) => {
            state.show = false;
            state.component = null;
            state.data = null;
            state.backRoute = null;
            state.className = '';
        },
    },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;