// src/store/slices/loadingSlice.ts
// Global loading state slice

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoadingState {
  isLoading: boolean;
  loadingMessage: string | null;
  loadingCount: number; // Track multiple loading states
}

const initialState: LoadingState = {
  isLoading: false,
  loadingMessage: null,
  loadingCount: 0,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    startLoading: (state, action: PayloadAction<string | undefined>) => {
      state.loadingCount += 1;
      state.isLoading = true;
      if (action.payload) {
        state.loadingMessage = action.payload;
      }
    },
    stopLoading: state => {
      state.loadingCount = Math.max(0, state.loadingCount - 1);
      if (state.loadingCount === 0) {
        state.isLoading = false;
        state.loadingMessage = null;
      }
    },
    resetLoading: state => {
      state.isLoading = false;
      state.loadingMessage = null;
      state.loadingCount = 0;
    },
    setLoadingMessage: (state, action: PayloadAction<string | null>) => {
      state.loadingMessage = action.payload;
    },
  },
});

export const { startLoading, stopLoading, resetLoading, setLoadingMessage } =
  loadingSlice.actions;
export const loadingReducer = loadingSlice.reducer;
