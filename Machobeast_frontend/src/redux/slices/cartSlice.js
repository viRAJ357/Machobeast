import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [
    // Pre-loaded item for demo matching screenshot 1 cart count badge (1)
    {
      id: 'demo-1',
      name: 'MachoBeast Gold Pea Protein Isolate',
      variant: '1 kg (2.2 lb), Rich Chocolate',
      price: 1349,
      mrp: 1799,
      image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=300',
      quantity: 1,
      isVeg: true
    }
  ],
  totalQuantity: 1,
  totalAmount: 1349,
  discount: 0,
  appliedCoupon: null
};

const calculateTotals = (items) => {
  let totalQuantity = 0;
  let totalAmount = 0;
  items.forEach((item) => {
    totalQuantity += item.quantity;
    totalAmount += item.price * item.quantity;
  });
  return { totalQuantity, totalAmount };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id && item.variant === newItem.variant);

      if (existingItem) {
        existingItem.quantity += newItem.quantity || 1;
      } else {
        state.items.push({
          ...newItem,
          quantity: newItem.quantity || 1
        });
      }

      const { totalQuantity, totalAmount } = calculateTotals(state.items);
      state.totalQuantity = totalQuantity;
      state.totalAmount = totalAmount;
    },
    removeFromCart: (state, action) => {
      const { id, variant } = action.payload;
      state.items = state.items.filter((item) => !(item.id === id && item.variant === variant));

      const { totalQuantity, totalAmount } = calculateTotals(state.items);
      state.totalQuantity = totalQuantity;
      state.totalAmount = totalAmount;
    },
    updateQuantity: (state, action) => {
      const { id, variant, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id && i.variant === variant);
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
      const { totalQuantity, totalAmount } = calculateTotals(state.items);
      state.totalQuantity = totalQuantity;
      state.totalAmount = totalAmount;
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      state.discount = 0;
      state.appliedCoupon = null;
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
