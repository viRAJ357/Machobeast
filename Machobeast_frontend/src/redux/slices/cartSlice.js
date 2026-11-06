import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

// Helper to get user-specific storage key
const getCartStorageKey = () => {
  try {
    const user = JSON.parse(localStorage.getItem('machobeast_user') || 'null');
    return user?._id || user?.id ? `machobeast_cart_${user._id || user.id}` : 'machobeast_cart_guest';
  } catch {
    return 'machobeast_cart_guest';
  }
};

const calculateTotals = (items = []) => {
  let totalQuantity = 0;
  let totalAmount = 0;
  items.forEach((item) => {
    const qty = Number(item.quantity) || 1;
    const price = Number(item.price) || 0;
    totalQuantity += qty;
    totalAmount += price * qty;
  });
  return { totalQuantity, totalAmount };
};

const saveCartToStorage = (items) => {
  try {
    const key = getCartStorageKey();
    localStorage.setItem(key, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to persist cart locally:', e);
  }
};

const loadInitialCart = () => {
  try {
    const key = getCartStorageKey();
    const saved = localStorage.getItem(key);
    if (saved) {
      const items = JSON.parse(saved);
      if (Array.isArray(items)) {
        const { totalQuantity, totalAmount } = calculateTotals(items);
        return { items, totalQuantity, totalAmount };
      }
    }
  } catch (e) {
    console.error('Failed to load initial cart:', e);
  }
  return { items: [], totalQuantity: 0, totalAmount: 0 };
};

const initialCart = loadInitialCart();

const initialState = {
  items: initialCart.items,
  totalQuantity: initialCart.totalQuantity,
  totalAmount: initialCart.totalAmount,
  discount: 0,
  appliedCoupon: null,
  loading: false,
  error: null
};

// ─── Async Thunks ─────────────────────────────────────────────────────────────

// Fetch cart for the authenticated user from the MongoDB database
export const fetchUserCart = createAsyncThunk(
  'cart/fetchUserCart',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('machobeast_token');
      if (!token) return { items: [] };

      const response = await API.get('/cart');
      const cartData = response.data || response;
      const items = cartData.items || [];

      // Save to user-specific localStorage cache
      saveCartToStorage(items);

      return {
        items,
        totalQuantity: cartData.totalQuantity ?? calculateTotals(items).totalQuantity,
        totalAmount: cartData.totalAmount ?? calculateTotals(items).totalAmount
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Synchronize current local items with the user's cart in the database
export const syncCartWithServer = createAsyncThunk(
  'cart/syncCartWithServer',
  async (items, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('machobeast_token');
      if (!token) {
        saveCartToStorage(items);
        return { items };
      }

      const response = await API.post('/cart/sync', { items });
      const cartData = response.data || response;
      const syncedItems = cartData.items || items;

      saveCartToStorage(syncedItems);

      return {
        items: syncedItems,
        totalQuantity: cartData.totalQuantity ?? calculateTotals(syncedItems).totalQuantity,
        totalAmount: cartData.totalAmount ?? calculateTotals(syncedItems).totalAmount
      };
    } catch (error) {
      saveCartToStorage(items);
      return rejectWithValue(error.message);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      const items = Array.isArray(action.payload) ? action.payload : [];
      state.items = items;
      const { totalQuantity, totalAmount } = calculateTotals(items);
      state.totalQuantity = totalQuantity;
      state.totalAmount = totalAmount;
      saveCartToStorage(items);
    },
    addToCart: (state, action) => {
      const newItem = action.payload;
      const itemVariant = newItem.variant || '';

      const existingItem = state.items.find(
        (item) => String(item.id) === String(newItem.id) && (item.variant || '') === itemVariant
      );

      if (existingItem) {
        existingItem.quantity += Number(newItem.quantity) || 1;
      } else {
        state.items.push({
          id: String(newItem.id),
          name: newItem.name,
          brand: newItem.brand || '',
          variant: itemVariant,
          price: Number(newItem.price) || 0,
          mrp: Number(newItem.mrp) || Number(newItem.price) || 0,
          image: newItem.image || '',
          quantity: Math.max(1, Number(newItem.quantity) || 1),
          isVeg: newItem.isVeg !== false
        });
      }

      const { totalQuantity, totalAmount } = calculateTotals(state.items);
      state.totalQuantity = totalQuantity;
      state.totalAmount = totalAmount;

      saveCartToStorage(state.items);

      // Trigger background sync if logged in
      const token = localStorage.getItem('machobeast_token');
      if (token) {
        API.post('/cart/sync', { items: state.items }).catch((err) => {
          console.warn('Background cart sync failed:', err.message);
        });
      }
    },
    removeFromCart: (state, action) => {
      const { id, variant } = action.payload;
      const itemVariant = variant || '';

      state.items = state.items.filter(
        (item) => !(String(item.id) === String(id) && (item.variant || '') === itemVariant)
      );

      const { totalQuantity, totalAmount } = calculateTotals(state.items);
      state.totalQuantity = totalQuantity;
      state.totalAmount = totalAmount;

      saveCartToStorage(state.items);

      const token = localStorage.getItem('machobeast_token');
      if (token) {
        API.post('/cart/sync', { items: state.items }).catch((err) => {
          console.warn('Background cart sync failed:', err.message);
        });
      }
    },
    updateQuantity: (state, action) => {
      const { id, variant, quantity } = action.payload;
      const itemVariant = variant || '';
      const item = state.items.find(
        (i) => String(i.id) === String(id) && (i.variant || '') === itemVariant
      );

      const newQty = Number(quantity);
      if (item && newQty > 0) {
        item.quantity = newQty;
      } else if (item && newQty <= 0) {
        state.items = state.items.filter(
          (i) => !(String(i.id) === String(id) && (i.variant || '') === itemVariant)
        );
      }

      const { totalQuantity, totalAmount } = calculateTotals(state.items);
      state.totalQuantity = totalQuantity;
      state.totalAmount = totalAmount;

      saveCartToStorage(state.items);

      const token = localStorage.getItem('machobeast_token');
      if (token) {
        API.post('/cart/sync', { items: state.items }).catch((err) => {
          console.warn('Background cart sync failed:', err.message);
        });
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      state.discount = 0;
      state.appliedCoupon = null;

      try {
        const key = getCartStorageKey();
        localStorage.removeItem(key);
      } catch (e) {
        console.error('Failed to clear cart storage:', e);
      }

      const token = localStorage.getItem('machobeast_token');
      if (token) {
        API.delete('/cart').catch((err) => {
          console.warn('Background cart clear failed:', err.message);
        });
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user cart
      .addCase(fetchUserCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalQuantity = action.payload.totalQuantity;
        state.totalAmount = action.payload.totalAmount;
      })
      .addCase(fetchUserCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Sync cart
      .addCase(syncCartWithServer.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalQuantity = action.payload.totalQuantity;
        state.totalAmount = action.payload.totalAmount;
      });
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCartItems } = cartSlice.actions;
export default cartSlice.reducer;
