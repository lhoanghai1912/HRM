// src/store/slices/index.ts
// Export all slices

// Auth slice - modular structure
export * from './auth';

// Loading slice
export {
  loadingReducer,
  startLoading,
  stopLoading,
  resetLoading,
  setLoadingMessage,
} from './loadingSlice';

// User slice - modular structure
export * from './user';

// Employee slice - modular structure
export * from './employee';

// Attendance slice - modular structure
export * from './attendance';
