import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Get the localStorage key scoped to the currently stored user
const getCartStorageKey = () => {
  try {
    const user = JSON.parse(localStorage.getItem('machobeast_user') || 'null');
    const uid = user?._id || user?.id;
    return uid ? `machobeast_cart_${uid}` : 'machobeast_cart_guest';
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

// Save items array to user-scoped localStorage key
const saveCartToStorage = (items) => {
  try {
    localStorage.setItem(getCartStorageKey(), JSON.stringify(items));
  } catch (e) {
    console.error('Failed to persist cart locally:', e);
  }
};

// Remove user-scoped cart from localStorage (used on logout — does NOT touch DB)
const removeCartFromStorage = () => {
  try {
    localStorage.removeItem(getCartStorageKey());
  } catch (e) {
    console.error('Failed to remove cart from storage:', e);
  }
};

// Load from localStorage on app boot (before DB fetch arrives)
const loadInitialCart = () => {
  try {
    const saved = localStorage.getItem(getCartStorageKey());
    if (saved) {
      const items = JSON.parse(saved);
      if (Array.isArray(items) && items.length > 0) {
        return { items, ...calculateTotals(items) };
      }
    }
  } catch (e) {
    console.error('Failed to load initial cart from storage:', e);
  }
  return { items: [], totalQuantity: 0, totalAmount: 0 };
};

// ─── Async Thunks ─────────────────────────────────────────────────────────────

/**
 * Fetch the authenticated user's cart from MongoDB.
 * Called on login, OAuth callback, and on app mount when already authenticated.
 *
 * FIX: api.js response interceptor unwraps axios response.data already, so
 * the value returned from API.get('/cart') is the ApiResponse body:
 *   { statusCode, data: { items, totalQuantity, totalAmount }, message, success }
 * Therefore items live at response.data.items (NOT response.items).
 */
export const fetchUserCart = createAsyncThunk(
  'cart/fetchUserCart',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('machobeast_token');
      if (!token) return { items: [], totalQuantity: 0, totalAmount: 0 };

      // api.js interceptor: response.data is the ApiResponse body
      const apiResponse = await API.get('/cart');

      // ApiResponse shape: { statusCode, data: { items, totalQuantity, totalAmount }, ... }
      const cartData = apiResponse?.data || {};
      const items = Array.isArray(cartData.items) ? cartData.items : [];
      const totals = calculateTotals(items);

      // Persist fetched items into user-scoped localStorage
      saveCartToStorage(items);

      return {
        items,
        totalQuantity: cartData.totalQuantity ?? totals.totalQuantity,
        totalAmount: cartData.totalAmount ?? totals.totalAmount
      };
    } catch (error) {
      console.error('fetchUserCart error:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Push the full current cart array to the server (used for mutations when logged in).
 * We pass the plain JS items array — never Immer draft proxies.
 */
export const syncCartWithServer = createAsyncThunk(
  'cart/syncCartWithServer',
  async (items, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('machobeast_token');
      if (!token) {
        saveCartToStorage(items);
        return { items, ...calculateTotals(items) };
      }

      const apiResponse = await API.post('/cart/sync', { items });
      const cartData = apiResponse?.data || {};
      const syncedItems = Array.isArray(cartData.items) ? cartData.items : items;
      const totals = calculateTotals(syncedItems);

      saveCartToStorage(syncedItems);

      return {
        items: syncedItems,
        totalQuantity: cartData.totalQuantity ?? totals.totalQuantity,
        totalAmount: cartData.totalAmount ?? totals.totalAmount
      };
    } catch (error) {
      console.error('syncCartWithServer error:', error.message);
      // On sync failure keep the local items as-is so the user doesn't lose their cart
      saveCartToStorage(items);
      return rejectWithValue(error.message);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const { items: initItems, totalQuantity: initQty, totalAmount: initAmt } = loadInitialCart();

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: initItems,
    totalQuantity: initQty,
    totalAmount: initAmt,
    discount: 0,
    appliedCoupon: null,
    loading: false,
    error: null
  },
  reducers: {
    // Set cart items directly (used by order completion etc.)
    setCartItems: (state, action) => {
      const items = Array.isArray(action.payload) ? action.payload : [];
      state.items = items;
      const { totalQuantity, totalAmount } = calculateTotals(items);
      state.totalQuantity = totalQuantity;
      state.totalAmount = totalAmount;
      saveCartToStorage(items);
    },

    // Add or increment an item in the cart
    addToCart: (state, action) => {
      const newItem = action.payload;
      const itemVariant = newItem.variant || '';

      const existing = state.items.find(
        (item) => String(item.id) === String(newItem.id) && (item.variant || '') === itemVariant
      );

      if (existing) {
        existing.quantity += Number(newItem.quantity) || 1;
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

      // Persist locally immediately
      saveCartToStorage(state.items);
      // Note: background DB sync is dispatched from the component/thunk level
      // using syncCartWithServer to avoid Immer proxy serialisation issues.
    },

    // Remove an item from the cart
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
    },

    // Change quantity of an existing cart item
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
    },

    /**
     * clearCartLocal — clears Redux state + localStorage ONLY.
     * Used on LOGOUT so the DB cart is NOT deleted (it persists for next login).
     */
    clearCartLocal: (state) => {
      removeCartFromStorage();
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      state.discount = 0;
      state.appliedCoupon = null;
    },

    /**
     * clearCart — clears Redux state + localStorage + DB cart.
     * Used ONLY after a successful order placement.
     */
    clearCart: (state) => {
      removeCartFromStorage();
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      state.discount = 0;
      state.appliedCoupon = null;

      const token = localStorage.getItem('machobeast_token');
      if (token) {
        API.delete('/cart').catch((err) => {
          console.warn('Background cart clear (DB) failed:', err.message);
        });
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchUserCart
      .addCase(fetchUserCart.pending, (state) => {
        state.loading = true;
        state.error = null;
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
      // syncCartWithServer
      .addCase(syncCartWithServer.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalQuantity = action.payload.totalQuantity;
        state.totalAmount = action.payload.totalAmount;
      });
  }
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  clearCartLocal,
  setCartItems
} = cartSlice.actions;

export default cartSlice.reducer;
