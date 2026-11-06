import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

const getOrdersStorageKey = () => {
  try {
    const user = JSON.parse(localStorage.getItem('machobeast_user') || 'null');
    return user?._id || user?.id ? `machobeast_orders_${user._id || user.id}` : 'machobeast_orders_guest';
  } catch {
    return 'machobeast_orders_guest';
  }
};

const getInitialOrders = () => {
  try {
    const key = getOrdersStorageKey();
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load orders from localStorage', e);
  }
  return [];
};

// Async Thunk: Fetch logged-in user's orders from the database
export const fetchMyOrdersThunk = createAsyncThunk(
  'order/fetchMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('machobeast_token');
      if (!token) return [];

      const response = await API.get('/orders/my-orders');
      const orders = response.data || response || [];

      // Normalize orders for frontend display
      const formatted = orders.map((o) => ({
        _id: o._id,
        orderId: o.orderId,
        date: new Date(o.createdAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
        totalAmount: o.totalAmount,
        status: o.orderStatus || 'Confirmed',
        trackingStep:
          o.orderStatus === 'Delivered'
            ? 3
            : o.orderStatus === 'Shipped'
            ? 2
            : o.orderStatus === 'Processing'
            ? 1
            : 0,
        estimatedDelivery: o.deliveredAt
          ? new Date(o.deliveredAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
          : new Date(new Date(o.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        shippingAddress: o.shippingAddress,
        paymentMethod: o.paymentMethod,
        items: (o.orderItems || []).map((it) => ({
          id: it.product || it._id,
          name: it.name,
          variant: `${it.variant?.weight || ''}${it.variant?.flavor ? ', ' + it.variant.flavor : ''}`,
          price: it.price,
          quantity: it.quantity,
          image: it.image
        }))
      }));

      const key = getOrdersStorageKey();
      localStorage.setItem(key, JSON.stringify(formatted));

      return formatted;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  orders: getInitialOrders(),
  lastPlacedOrder: null,
  loading: false,
  error: null
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    placeOrder: (state, action) => {
      const payload = action.payload || {};
      const newOrder = {
        _id: payload._id,
        orderId: payload.orderId || `MB-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
        date: payload.createdAt
          ? new Date(payload.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
          : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: payload.orderStatus || 'Confirmed',
        trackingStep: 1,
        totalAmount: payload.totalAmount || 0,
        shippingAddress: payload.shippingAddress || {},
        paymentMethod: payload.paymentMethod || 'Razorpay',
        items: payload.items || payload.orderItems || [],
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      };

      state.orders.unshift(newOrder);
      state.lastPlacedOrder = newOrder;

      try {
        const key = getOrdersStorageKey();
        localStorage.setItem(key, JSON.stringify(state.orders));
      } catch (e) {
        console.error('Failed to save orders to localStorage', e);
      }
    },
    cancelOrder: (state, action) => {
      const orderId = action.payload;
      const order = state.orders.find((o) => o.orderId === orderId);
      if (order) {
        order.status = 'Cancelled';
        order.trackingStep = 0;
        try {
          const key = getOrdersStorageKey();
          localStorage.setItem(key, JSON.stringify(state.orders));
        } catch (e) {
          console.error(e);
        }
      }
    },
    clearLastPlacedOrder: (state) => {
      state.lastPlacedOrder = null;
    },
    clearOrders: (state) => {
      state.orders = [];
      state.lastPlacedOrder = null;
      try {
        const key = getOrdersStorageKey();
        localStorage.removeItem(key);
      } catch (e) {
        console.error(e);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrdersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchMyOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { placeOrder, cancelOrder, clearLastPlacedOrder, clearOrders } = orderSlice.actions;
export default orderSlice.reducer;
