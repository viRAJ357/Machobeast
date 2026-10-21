import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { allProducts as initialProducts, brands as initialBrands, categories as initialCategories } from '../../data/products';
import API from '../../services/api';

const STORAGE_KEY = 'machobeast_custom_products';
const BRANDS_STORAGE_KEY = 'machobeast_custom_brands';
const CATEGORIES_STORAGE_KEY = 'machobeast_custom_categories';

// Load stored items from localStorage
const loadStoredProducts = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge saved products with initial products to avoid duplicates
        const savedIds = new Set(parsed.map((p) => p.id));
        const nonDuplicateInitial = initialProducts.filter((p) => !savedIds.has(p.id));
        return [...parsed, ...nonDuplicateInitial];
      }
    }
  } catch (err) {
    console.error('Failed to parse stored products:', err);
  }
  return initialProducts;
};

const loadStoredBrands = () => {
  try {
    const saved = localStorage.getItem(BRANDS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Failed to parse stored brands:', err);
  }
  return initialBrands;
};

const loadStoredCategories = () => {
  try {
    const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Failed to parse stored categories:', err);
  }
  return initialCategories;
};

// Async thunk to optionally fetch products from backend API
export const fetchProductsThunk = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/products');
      if (response && response.data && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk to save product to backend API
export const syncProductToBackendThunk = createAsyncThunk(
  'products/syncProduct',
  async (product, { rejectWithValue }) => {
    try {
      const response = await API.post('/products', product);
      return response.data;
    } catch (err) {
      // Backend may be offline, we still succeed locally
      return product;
    }
  }
);

const initialState = {
  items: loadStoredProducts(),
  brands: loadStoredBrands(),
  categories: loadStoredCategories(),
  loading: false,
  error: null,
  isDraggingProduct: null, // Tracks product currently dragged for MachoBeast drag & drop
};

const saveProductsToStorage = (products) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (err) {
    console.error('Could not save products to localStorage:', err);
  }
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Admin Add Product
    addProduct: (state, action) => {
      const newProduct = {
        ...action.payload,
        id: action.payload.id || `custom-${Date.now()}`,
        rating: action.payload.rating || 5.0,
        numReviews: action.payload.numReviews || 1,
        createdAt: new Date().toISOString()
      };
      // Prepend to catalog so it appears immediately at the top
      state.items.unshift(newProduct);
      saveProductsToStorage(state.items);
    },

    // Admin Update Product
    updateProduct: (state, action) => {
      const updated = action.payload;
      const index = state.items.findIndex((p) => p.id === updated.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...updated };
        saveProductsToStorage(state.items);
      }
    },

    // Admin Delete Product
    deleteProduct: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((p) => p.id !== id);
      saveProductsToStorage(state.items);
    },

    // Admin Reset to Factory Catalog
    resetToDefaultCatalog: (state) => {
      state.items = [...initialProducts];
      localStorage.removeItem(STORAGE_KEY);
    },

    // Add new Category dynamically
    addCategory: (state, action) => {
      const newCat = action.payload;
      if (!state.categories.find((c) => c.id === newCat.id)) {
        state.categories.push(newCat);
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(state.categories));
      }
    },

    // Add new Brand dynamically
    addBrand: (state, action) => {
      const newBrand = action.payload;
      if (!state.brands.find((b) => b.id === newBrand.id)) {
        state.brands.push(newBrand);
        localStorage.setItem(BRANDS_STORAGE_KEY, JSON.stringify(state.brands));
      }
    },

    // Drag and Drop state tracking for global drop indicators
    setDraggingProduct: (state, action) => {
      state.isDraggingProduct = action.payload;
    },
    clearDraggingProduct: (state) => {
      state.isDraggingProduct = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsThunk.fulfilled, (state, action) => {
        if (action.payload && action.payload.length > 0) {
          const formatted = action.payload.map((p) => ({
            ...p,
            id: p.id || p._id
          }));
          const remoteIds = new Set(formatted.map((p) => p.id));
          const localOnly = state.items.filter((p) => !remoteIds.has(p.id));
          state.items = [...formatted, ...localOnly];
          saveProductsToStorage(state.items);
        }
      });
  }
});

export const {
  addProduct,
  updateProduct,
  deleteProduct,
  resetToDefaultCatalog,
  addCategory,
  addBrand,
  setDraggingProduct,
  clearDraggingProduct
} = productSlice.actions;

export default productSlice.reducer;
