// src/store/slices/attendance/attendanceSlice.ts
// Attendance slice

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AttendanceState, Application } from './attendanceTypes';
import {
  fetchApplicationsThunk,
  createApplicationThunk,
  approveApplicationThunk,
  rejectApplicationThunk,
  fetchTimesheetThunk,
} from './attendanceThunks';

// Initial state
const initialState: AttendanceState = {
  applications: [],
  selectedApplication: null,
  timesheet: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
  },
  loadingState: 'idle',
  error: null,
  filters: {},
};

// ============================================
// Slice
// ============================================

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    // Clear error
    clearAttendanceError: state => {
      state.error = null;
    },
    // Reset state
    resetAttendanceState: () => initialState,
    // Set filters
    setFilters: (state, action: PayloadAction<AttendanceState['filters']>) => {
      state.filters = action.payload;
    },
    // Clear selected application
    clearSelectedApplication: state => {
      state.selectedApplication = null;
    },
    // Set selected application
    setSelectedApplication: (state, action: PayloadAction<Application>) => {
      state.selectedApplication = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch applications
      .addCase(fetchApplicationsThunk.pending, state => {
        state.loadingState = 'loading';
        state.error = null;
      })
      .addCase(fetchApplicationsThunk.fulfilled, (state, action) => {
        state.loadingState = 'succeeded';
        state.applications = action.payload.items;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.totalItems,
          hasNextPage: action.payload.hasNextPage,
        };
        state.error = null;
      })
      .addCase(fetchApplicationsThunk.rejected, (state, action) => {
        state.loadingState = 'failed';
        state.error = action.payload || 'Lỗi không xác định';
      })
      // Create application
      .addCase(createApplicationThunk.fulfilled, (state, action) => {
        state.applications.unshift(action.payload);
        state.pagination.totalItems += 1;
      })
      // Approve application
      .addCase(approveApplicationThunk.fulfilled, (state, action) => {
        const index = state.applications.findIndex(
          a => a.id === action.payload.id,
        );
        if (index !== -1) {
          state.applications[index] = action.payload;
        }
      })
      // Reject application
      .addCase(rejectApplicationThunk.fulfilled, (state, action) => {
        const index = state.applications.findIndex(
          a => a.id === action.payload.id,
        );
        if (index !== -1) {
          state.applications[index] = action.payload;
        }
      })
      // Fetch timesheet
      .addCase(fetchTimesheetThunk.pending, state => {
        state.loadingState = 'loading';
        state.error = null;
      })
      .addCase(fetchTimesheetThunk.fulfilled, (state, action) => {
        state.loadingState = 'succeeded';
        state.timesheet = action.payload;
        state.error = null;
      })
      .addCase(fetchTimesheetThunk.rejected, (state, action) => {
        state.loadingState = 'failed';
        state.error = action.payload || 'Lỗi không xác định';
      });
  },
});

export const {
  clearAttendanceError,
  resetAttendanceState,
  setFilters,
  clearSelectedApplication,
  setSelectedApplication,
} = attendanceSlice.actions;

export const attendanceReducer = attendanceSlice.reducer;
