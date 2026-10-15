import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCartApi, addToCartApi, updateQuantityApi, removeFromCartApi } from '../../services/api';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await fetchCartApi();
    return response.data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch cart');
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async (productId, { rejectWithValue }) => {
  try {
    const response = await addToCartApi(productId);
    return response.data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add to cart');
  }
});

export const updateQuantity = createAsyncThunk('cart/updateQuantity', async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const response = await updateQuantityApi(productId, quantity);
    return response.data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update quantity');
  }
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (productId, { rejectWithValue }) => {
  try {
    const response = await removeFromCartApi(productId);
    return response.data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to remove item');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
    loading: false,
    error: null,
    pendingIds: [],
  },
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
      state.loading = false;
      state.error = null;
      state.pendingIds = [];
    },
    resetCart: (state) => {
      state.cartItems = [];
      state.loading = false;
      state.error = null;
      state.pendingIds = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // addToCart
      .addCase(addToCart.pending, (state, action) => {
        if (!state.pendingIds.includes(action.meta.arg)) {
          state.pendingIds.push(action.meta.arg);
        }
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cartItems = action.payload;
        state.pendingIds = state.pendingIds.filter((id) => id !== action.meta.arg);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.pendingIds = state.pendingIds.filter((id) => id !== action.meta.arg);
      })
      // updateQuantity
      .addCase(updateQuantity.pending, (state, action) => {
        if (!state.pendingIds.includes(action.meta.arg.productId)) {
          state.pendingIds.push(action.meta.arg.productId);
        }
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.cartItems = action.payload;
        state.pendingIds = state.pendingIds.filter((id) => id !== action.meta.arg.productId);
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.pendingIds = state.pendingIds.filter((id) => id !== action.meta.arg.productId);
      })
      // removeFromCart
      .addCase(removeFromCart.pending, (state, action) => {
        if (!state.pendingIds.includes(action.meta.arg)) {
          state.pendingIds.push(action.meta.arg);
        }
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cartItems = action.payload;
        state.pendingIds = state.pendingIds.filter((id) => id !== action.meta.arg);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.pendingIds = state.pendingIds.filter((id) => id !== action.meta.arg);
      });
  },
});

export const { clearCart, resetCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.cartItems;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
export const selectPendingIds = (state) => state.cart.pendingIds;

export const selectTotalUnits = (state) =>
  state.cart.cartItems.reduce((sum, item) => sum + item.quantity, 0);

export const selectSubtotal = (state) =>
  state.cart.cartItems.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

export const selectLineTotal = (item) =>
  (item?.product?.price || 0) * (item?.quantity || 0);

export default cartSlice.reducer;
