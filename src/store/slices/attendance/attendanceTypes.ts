// src/store/slices/attendance/attendanceTypes.ts
// Attendance types

import { LoadingState } from '../../../types/api';

// Application type
export type ApplicationType =
  | 'leave'
  | 'late_early'
  | 'overtime'
  | 'remote'
  | 'business_trip'
  | 'attendance_update'
  | 'shift_update'
  | 'timekeeping';

// Application status
export type ApplicationStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'cancelled';

// Application interface
export interface Application {
  id: string;
  type: ApplicationType;
  status: ApplicationStatus;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  employeeId: string;
  employeeName: string;
  approverId?: string;
  approverName?: string;
}

// Timesheet interface
export interface TimesheetEntry {
  id: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  workHours?: number;
  overtimeHours?: number;
  status: 'present' | 'absent' | 'late' | 'early' | 'leave';
  note?: string;
}

// Attendance state interface
export interface AttendanceState {
  applications: Application[];
  selectedApplication: Application | null;
  timesheet: TimesheetEntry[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
  };
  loadingState: LoadingState;
  error: string | null;
  filters: {
    type?: ApplicationType;
    status?: ApplicationStatus;
    dateRange?: { start: string; end: string };
  };
}
