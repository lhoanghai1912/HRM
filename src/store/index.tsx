// src/store/index.ts
// Redux store configuration

import { configureStore } from '@reduxjs/toolkit';
import {
  authReducer,
  loadingReducer,
  userSliceReducer,
  employeeReducer,
  attendanceReducer,
} from './slices';
import Reactotron from '../../ReactotronConfig';

const store = configureStore({
  reducer: {
    // Modern slice-based reducers
    auth: authReducer,
    loading: loadingReducer,
    userProfile: userSliceReducer,
    employee: employeeReducer,
    attendance: attendanceReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializable check
        ignoredActions: ['auth/login/fulfilled'],
      },
    }),
  devTools: __DEV__,
  // @ts-ignore
  enhancers: getDefaultEnhancers =>
    __DEV__
      ? getDefaultEnhancers().concat(Reactotron.createEnhancer())
      : getDefaultEnhancers(),
});

// Export types for typed hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export hooks
export { useAppDispatch, useAppSelector } from './hooks';

// Re-export commonly used thunks and actions
export * from './slices';

export default store;
