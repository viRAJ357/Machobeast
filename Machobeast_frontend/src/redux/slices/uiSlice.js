import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isMobileMenuOpen: false,
  activeCategoryTab: 'Proteins',
  searchQuery: '',
  quickViewProduct: null
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    setActiveCategoryTab: (state, action) => {
      state.activeCategoryTab = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setQuickViewProduct: (state, action) => {
      state.quickViewProduct = action.payload;
    }
  }
});

export const { toggleMobileMenu, setActiveCategoryTab, setSearchQuery, setQuickViewProduct } = uiSlice.actions;
export default uiSlice.reducer;
