import { createSlice } from '@reduxjs/toolkit';

// Load saved orders from localStorage if any
const getInitialOrders = () => {
  try {
    const saved = localStorage.getItem('machobeast_orders');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load orders from localStorage', e);
  }
  return [
    // Sample pre-loaded order for demonstration
    {
      orderId: 'MB-2026-94812',
      date: '18 Oct 2026',
      totalAmount: 2799,
      status: 'Shipped',
      trackingStep: 2, // 0: Placed, 1: Packed, 2: Shipped, 3: Delivered
      estimatedDelivery: '22 Oct 2026',
      shippingAddress: {
        fullName: 'Nikhil Kumar',
        phone: '+91 98765 43210',
        address: 'Flat 402, Royal Residency, Sector 18',
        city: 'Noida',
        state: 'Uttar Pradesh',
        pincode: '201301',
      },
      paymentMethod: 'UPI (Google Pay)',
      items: [
        {
          id: 'dn-icon-isolate',
          name: 'Divine Nutrition Icon Isolate 100% Whey Protein Isolate',
          variant: '1 kg (2.2 lb), Rich Chocolate',
          price: 2799,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1622484211148-69e7a52df06e?w=600',
        }
      ]
    }
  ];
};

const initialState = {
  orders: getInitialOrders(),
  lastPlacedOrder: null
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    placeOrder: (state, action) => {
      const newOrder = {
        ...action.payload,
        orderId: `MB-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: 'Confirmed',
        trackingStep: 1,
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      };
      state.orders.unshift(newOrder);
      state.lastPlacedOrder = newOrder;

      try {
        localStorage.setItem('machobeast_orders', JSON.stringify(state.orders));
      } catch (e) {
        console.error('Failed to save orders to localStorage', e);
      }
    },
    cancelOrder: (state, action) => {
      const orderId = action.payload;
      const order = state.orders.find(o => o.orderId === orderId);
      if (order) {
        order.status = 'Cancelled';
        order.trackingStep = 0;
        try {
          localStorage.setItem('machobeast_orders', JSON.stringify(state.orders));
        } catch (e) {
          console.error(e);
        }
      }
    },
    clearLastPlacedOrder: (state) => {
      state.lastPlacedOrder = null;
    }
  }
});

export const { placeOrder, cancelOrder, clearLastPlacedOrder } = orderSlice.actions;
export default orderSlice.reducer;
