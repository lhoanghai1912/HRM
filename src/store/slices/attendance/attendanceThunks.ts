// src/store/slices/attendance/attendanceThunks.ts
// Attendance async thunks

import { createAsyncThunk } from '@reduxjs/toolkit';
import { attendanceServiceInstance } from '../../../services';
import { PaginatedRequest, PaginatedResponse } from '../../../types/api';
import {
  Application,
  ApplicationType,
  ApplicationStatus,
  TimesheetEntry,
} from './attendanceTypes';

// Use singleton service instance
const attendanceService = attendanceServiceInstance;

/**
 * Fetch applications with pagination
 */
export const fetchApplicationsThunk = createAsyncThunk<
  PaginatedResponse<Application>,
  PaginatedRequest & { type?: ApplicationType; status?: ApplicationStatus },
  { rejectValue: string }
>('attendance/fetchApplications', async (params, { rejectWithValue }) => {
  try {
    const response = await attendanceService.getApplications(params);
    return response;
  } catch (error: any) {
    const message = error.message || 'Không thể tải danh sách đơn từ';
    return rejectWithValue(message);
  }
});

/**
 * Create application
 */
export const createApplicationThunk = createAsyncThunk<
  Application,
  Omit<Application, 'id' | 'createdAt' | 'updatedAt' | 'status'>,
  { rejectValue: string }
>('attendance/createApplication', async (data, { rejectWithValue }) => {
  try {
    const response = await attendanceService.createApplication(data);
    return response;
  } catch (error: any) {
    const message = error.message || 'Tạo đơn thất bại';
    return rejectWithValue(message);
  }
});

/**
 * Approve application
 */
export const approveApplicationThunk = createAsyncThunk<
  Application,
  { id: string; note?: string },
  { rejectValue: string }
>(
  'attendance/approveApplication',
  async ({ id, note }, { rejectWithValue }) => {
    try {
      const response = await attendanceService.approveApplication(id, note);
      return response;
    } catch (error: any) {
      const message = error.message || 'Duyệt đơn thất bại';
      return rejectWithValue(message);
    }
  },
);

/**
 * Reject application
 */
export const rejectApplicationThunk = createAsyncThunk<
  Application,
  { id: string; reason: string },
  { rejectValue: string }
>(
  'attendance/rejectApplication',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await attendanceService.rejectApplication(id, reason);
      return response;
    } catch (error: any) {
      const message = error.message || 'Từ chối đơn thất bại';
      return rejectWithValue(message);
    }
  },
);

/**
 * Fetch timesheet
 */
export const fetchTimesheetThunk = createAsyncThunk<
  TimesheetEntry[],
  { month: number; year: number; employeeId?: string },
  { rejectValue: string }
>('attendance/fetchTimesheet', async (params, { rejectWithValue }) => {
  try {
    const response = await attendanceService.getTimesheet(params);
    return response;
  } catch (error: any) {
    const message = error.message || 'Không thể tải bảng chấm công';
    return rejectWithValue(message);
  }
});
