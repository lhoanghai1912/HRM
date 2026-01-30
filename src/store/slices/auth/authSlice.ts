// src/store/slices/auth/authSlice.ts
// Authentication Redux slice

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, UserData } from './authTypes';
import {
  loginThunk,
  registerThunk,
  logoutThunk,
  restoreAuthThunk,
  sendOtpThunk,
  forgotPasswordThunk,
} from './authThunks';

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  token: null,
  refreshToken: null,
  user: null,
  error: null,
};

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear error
    clearError: state => {
      state.error = null;
    },
    // Set token directly (useful for token refresh)
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    // Update user data
    updateUser: (state, action: PayloadAction<Partial<UserData>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: builder => {
    builder
      // Login
      .addCase(loginThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Đăng nhập thất bại';
      })
      // Register
      .addCase(registerThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, state => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Đăng ký thất bại';
      })
      // Logout
      .addCase(logoutThunk.fulfilled, state => {
        state.isAuthenticated = false;
        state.token = null;
        state.refreshToken = null;
        state.user = null;
        state.error = null;
      })
      // Restore auth
      .addCase(restoreAuthThunk.pending, state => {
        state.isLoading = true;
      })
      .addCase(restoreAuthThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.isAuthenticated = true;
          state.token = action.payload.token;
          state.user = action.payload.user;
        }
      })
      .addCase(restoreAuthThunk.rejected, state => {
        state.isLoading = false;
      })
      // Send OTP
      .addCase(sendOtpThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendOtpThunk.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(sendOtpThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Gửi OTP thất bại';
      })
      // Forgot password
      .addCase(forgotPasswordThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Thao tác thất bại';
      });
  },
});

export const { clearError, setToken, updateUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
