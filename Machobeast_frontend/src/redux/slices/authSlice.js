import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

const storedUser = JSON.parse(localStorage.getItem('machobeast_user') || 'null');
const storedToken = localStorage.getItem('machobeast_token') || null;

export const loginUserThunk = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await API.post('/auth/login', credentials);
      if (response.success) {
        localStorage.setItem('machobeast_token', response.data.token);
        localStorage.setItem('machobeast_user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUserThunk = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await API.post('/auth/register', userData);
      if (response.success) {
        localStorage.setItem('machobeast_token', response.data.token);
        localStorage.setItem('machobeast_user', JSON.stringify(response.data.user));
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
      dispatch(clearAuth());
    }
  }
);

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

export const { clearAuth, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
