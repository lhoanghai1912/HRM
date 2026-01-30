// src/store/slices/user/userSlice.ts
// User slice

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState, User } from './userTypes';
import {
  fetchProfileThunk,
  updateProfileThunk,
  changePasswordThunk,
  uploadAvatarThunk,
} from './userThunks';

// Initial state
const initialState: UserState = {
  profile: null,
  loadingState: 'idle',
  error: null,
};

// ============================================
// Slice
// ============================================

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Clear user error
    clearUserError: state => {
      state.error = null;
    },
    // Reset user state
    resetUserState: () => initialState,
    // Set profile directly
    setProfile: (state, action: PayloadAction<User>) => {
      state.profile = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch profile
      .addCase(fetchProfileThunk.pending, state => {
        state.loadingState = 'loading';
        state.error = null;
      })
      .addCase(fetchProfileThunk.fulfilled, (state, action) => {
        state.loadingState = 'succeeded';
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchProfileThunk.rejected, (state, action) => {
        state.loadingState = 'failed';
        state.error = action.payload || 'Lỗi không xác định';
      })
      // Update profile
      .addCase(updateProfileThunk.pending, state => {
        state.loadingState = 'loading';
        state.error = null;
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.loadingState = 'succeeded';
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.loadingState = 'failed';
        state.error = action.payload || 'Lỗi không xác định';
      })
      // Change password
      .addCase(changePasswordThunk.pending, state => {
        state.loadingState = 'loading';
        state.error = null;
      })
      .addCase(changePasswordThunk.fulfilled, state => {
        state.loadingState = 'succeeded';
        state.error = null;
      })
      .addCase(changePasswordThunk.rejected, (state, action) => {
        state.loadingState = 'failed';
        state.error = action.payload || 'Lỗi không xác định';
      })
      // Upload avatar
      .addCase(uploadAvatarThunk.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.avatar = action.payload.avatarUrl;
        }
      });
  },
});

export const { clearUserError, resetUserState, setProfile } = userSlice.actions;
export const userSliceReducer = userSlice.reducer;
