import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';
import { fetchUserCart, clearCart } from './cartSlice';
import { clearOrders } from './orderSlice';

const storedUser = JSON.parse(localStorage.getItem('machobeast_user') || 'null');
const storedToken = localStorage.getItem('machobeast_token') || null;

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const loginUserThunk = createAsyncThunk(
  'auth/login',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await API.post('/auth/login', credentials);
      if (response.success) {
        localStorage.setItem('machobeast_token', response.data.token);
        localStorage.setItem('machobeast_user', JSON.stringify(response.data.user));
        dispatch(fetchUserCart());
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUserThunk = createAsyncThunk(
  'auth/register',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const response = await API.post('/auth/register', userData);
      if (response.success) {
        localStorage.setItem('machobeast_token', response.data.token);
        localStorage.setItem('machobeast_user', JSON.stringify(response.data.user));
        dispatch(fetchUserCart());
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUserThunk = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      await API.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('machobeast_token');
      localStorage.removeItem('machobeast_user');
      dispatch(clearCart());
      dispatch(clearOrders());
      dispatch(clearAuth());
    }
  }
);

// Used by OAuthCallbackPage after redirect from backend
export const setOAuthUser = (user, token) => (dispatch) => {
  localStorage.setItem('machobeast_token', token);
  localStorage.setItem('machobeast_user', JSON.stringify(user));
  dispatch(authSlice.actions.setUser({ user, token }));
  dispatch(fetchUserCart());
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  user: storedUser,
  token: storedToken,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearAuth, clearAuthError, setUser } = authSlice.actions;
export default authSlice.reducer;
