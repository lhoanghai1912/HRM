// src/store/slices/employee/employeeSlice.ts
// Employee slice

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EmployeeState } from './employeeTypes';
import {
  fetchEmployeesThunk,
  fetchEmployeeDetailThunk,
  createEmployeeThunk,
  updateEmployeeThunk,
  deleteEmployeeThunk,
} from './employeeThunks';

// Initial state
const initialState: EmployeeState = {
  employees: [],
  selectedEmployee: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
  },
  loadingState: 'idle',
  error: null,
  searchQuery: '',
};

// ============================================
// Slice
// ============================================

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    // Clear employee error
    clearEmployeeError: state => {
      state.error = null;
    },
    // Reset employee state
    resetEmployeeState: () => initialState,
    // Set search query
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    // Clear selected employee
    clearSelectedEmployee: state => {
      state.selectedEmployee = null;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch employees
      .addCase(fetchEmployeesThunk.pending, state => {
        state.loadingState = 'loading';
        state.error = null;
      })
      .addCase(fetchEmployeesThunk.fulfilled, (state, action) => {
        state.loadingState = 'succeeded';
        state.employees = action.payload.items;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.totalItems,
          hasNextPage: action.payload.hasNextPage,
        };
        state.error = null;
      })
      .addCase(fetchEmployeesThunk.rejected, (state, action) => {
        state.loadingState = 'failed';
        state.error = action.payload || 'Lỗi không xác định';
      })
      // Fetch employee detail
      .addCase(fetchEmployeeDetailThunk.pending, state => {
        state.loadingState = 'loading';
        state.error = null;
      })
      .addCase(fetchEmployeeDetailThunk.fulfilled, (state, action) => {
        state.loadingState = 'succeeded';
        state.selectedEmployee = action.payload;
        state.error = null;
      })
      .addCase(fetchEmployeeDetailThunk.rejected, (state, action) => {
        state.loadingState = 'failed';
        state.error = action.payload || 'Lỗi không xác định';
      })
      // Create employee
      .addCase(createEmployeeThunk.fulfilled, (state, action) => {
        state.employees.unshift(action.payload);
        state.pagination.totalItems += 1;
      })
      // Update employee
      .addCase(updateEmployeeThunk.fulfilled, (state, action) => {
        const index = state.employees.findIndex(
          e => e.id === action.payload.id,
        );
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
        if (state.selectedEmployee?.id === action.payload.id) {
          state.selectedEmployee = action.payload;
        }
      })
      // Delete employee
      .addCase(deleteEmployeeThunk.fulfilled, (state, action) => {
        state.employees = state.employees.filter(e => e.id !== action.payload);
        state.pagination.totalItems -= 1;
        if (state.selectedEmployee?.id === action.payload) {
          state.selectedEmployee = null;
        }
      });
  },
});

export const {
  clearEmployeeError,
  resetEmployeeState,
  setSearchQuery,
  clearSelectedEmployee,
} = employeeSlice.actions;

export const employeeReducer = employeeSlice.reducer;
