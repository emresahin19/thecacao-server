import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CategoryProps, ContactProps, ExtraDataProps, ProductProps } from 'lib/interfaces';
import { MenuState } from './store.props';

const initialState: MenuState = {
  data: [],
  contacts: {
    email: '',
    phone: '',
    facebook: '',
    instagram: '',
    linkedin: ''
  },
  selectedCategory: null,
  selectedProduct: null,
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenuData(state, action: PayloadAction<MenuState>) {
      state.data = action.payload.data;
    },
    setContacts(state, action: PayloadAction<ContactProps>) {
      state.contacts =  action.payload;
    },
    selectCategory(state, action: PayloadAction<CategoryProps | null>) {
      state.selectedCategory = action.payload;
    },
    selectProduct(state, action: PayloadAction<ProductProps | null>) {
      state.selectedProduct = action.payload;
    },
    clearSelected(state) {
      state.selectedCategory = null;
      state.selectedProduct = null;
    }
  },
});

export const { setMenuData, selectCategory, setContacts, selectProduct, clearSelected } = menuSlice.actions;
export default menuSlice.reducer;