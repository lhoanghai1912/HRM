// src/services/EmployeeService.ts
// Employee service class

import { BaseService } from './BaseService';
import { PaginatedRequest, PaginatedResponse } from '../types/api';
import { Employee } from '../store/slices/employee';

/**
 * Employee Service
 * Handles all employee-related operations
 */
export class EmployeeService extends BaseService {
  constructor() {
    super('Employee');
  }

  /**
   * Get employees with pagination
   */
  async getEmployees(
    params: PaginatedRequest,
  ): Promise<PaginatedResponse<Employee>> {
    return this.getPaginated<Employee>('/list', params);
  }

  /**
   * Get employee by ID
   */
  async getEmployeeById(id: string): Promise<Employee> {
    return this.get<Employee>(`/detail/${id}`);
  }

  /**
   * Create new employee
   */
  async createEmployee(data: Omit<Employee, 'id'>): Promise<Employee> {
    return this.post<Employee>('/create', data);
  }

  /**
   * Update employee
   */
  async updateEmployee(id: string, data: Partial<Employee>): Promise<Employee> {
    return this.put<Employee>(`/update/${id}`, data);
  }

  /**
   * Delete employee
   */
  async deleteEmployee(id: string): Promise<void> {
    return this.delete(`/delete/${id}`);
  }

  /**
   * Search employees
   */
  async searchEmployees(
    query: string,
    params?: PaginatedRequest,
  ): Promise<PaginatedResponse<Employee>> {
    return this.getPaginated<Employee>('/search', { ...params, search: query });
  }

  /**
   * Get employees by department
   */
  async getEmployeesByDepartment(
    departmentId: string,
    params?: PaginatedRequest,
  ): Promise<PaginatedResponse<Employee>> {
    return this.getPaginated<Employee>(
      `/department/${departmentId}`,
      params || {},
    );
  }

  /**
   * Export employees to Excel
   */
  async exportToExcel(filters?: Record<string, any>): Promise<Blob> {
    return this.post('/export', filters);
  }

  /**
   * Import employees from Excel
   */
  async importFromExcel(
    file: FormData,
  ): Promise<{ success: number; failed: number }> {
    const { api } = require('../api/client');
    return api.post('/Employee/import', file, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
}

// Export singleton instance
export const employeeServiceInstance = new EmployeeService();
