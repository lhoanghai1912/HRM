// src/services/AttendanceService.ts
// Attendance service class

import { BaseService } from './BaseService';
import { PaginatedRequest, PaginatedResponse } from '../types/api';
import {
  Application,
  ApplicationType,
  ApplicationStatus,
  TimesheetEntry,
} from '../store/slices/attendance';

/**
 * Attendance Service
 * Handles all attendance-related operations
 */
export class AttendanceService extends BaseService {
  constructor() {
    super('Attendance');
  }

  /**
   * Get applications with pagination
   */
  async getApplications(
    params: PaginatedRequest & {
      type?: ApplicationType;
      status?: ApplicationStatus;
    },
  ): Promise<PaginatedResponse<Application>> {
    return this.getPaginated<Application>('/applications', params);
  }

  /**
   * Get application by ID
   */
  async getApplicationById(id: string): Promise<Application> {
    return this.get<Application>(`/application/${id}`);
  }

  /**
   * Create new application
   */
  async createApplication(
    data: Omit<Application, 'id' | 'createdAt' | 'updatedAt' | 'status'>,
  ): Promise<Application> {
    return this.post<Application>('/application/create', data);
  }

  /**
   * Update application
   */
  async updateApplication(
    id: string,
    data: Partial<Application>,
  ): Promise<Application> {
    return this.put<Application>(`/application/update/${id}`, data);
  }

  /**
   * Cancel application
   */
  async cancelApplication(id: string): Promise<Application> {
    return this.post<Application>(`/application/cancel/${id}`);
  }

  /**
   * Approve application
   */
  async approveApplication(id: string, note?: string): Promise<Application> {
    return this.post<Application>(`/application/approve/${id}`, { note });
  }

  /**
   * Reject application
   */
  async rejectApplication(id: string, reason: string): Promise<Application> {
    return this.post<Application>(`/application/reject/${id}`, { reason });
  }

  /**
   * Get timesheet for a month
   */
  async getTimesheet(params: {
    month: number;
    year: number;
    employeeId?: string;
  }): Promise<TimesheetEntry[]> {
    return this.get<TimesheetEntry[]>('/timesheet', params);
  }

  /**
   * Check in
   */
  async checkIn(data: {
    location?: { lat: number; lng: number };
    note?: string;
  }): Promise<TimesheetEntry> {
    return this.post<TimesheetEntry>('/check-in', data);
  }

  /**
   * Check out
   */
  async checkOut(data: {
    location?: { lat: number; lng: number };
    note?: string;
  }): Promise<TimesheetEntry> {
    return this.post<TimesheetEntry>('/check-out', data);
  }

  /**
   * Get today's attendance status
   */
  async getTodayStatus(): Promise<{
    hasCheckedIn: boolean;
    hasCheckedOut: boolean;
    checkInTime?: string;
    checkOutTime?: string;
  }> {
    return this.get('/today-status');
  }

  /**
   * Get attendance summary for a period
   */
  async getAttendanceSummary(params: {
    startDate: string;
    endDate: string;
    employeeId?: string;
  }): Promise<{
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    leaveDays: number;
    overtimeHours: number;
  }> {
    return this.get('/summary', params);
  }

  /**
   * Export timesheet to Excel
   */
  async exportTimesheet(params: {
    month: number;
    year: number;
  }): Promise<Blob> {
    return this.post('/timesheet/export', params);
  }
}

// Export singleton instance
export const attendanceServiceInstance = new AttendanceService();
