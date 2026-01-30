// src/store/slices/employee/employeeThunks.ts
// Employee async thunks

import { createAsyncThunk } from '@reduxjs/toolkit';
import { employeeServiceInstance } from '../../../services';
import { PaginatedResponse, PaginatedRequest } from '../../../types/api';
import { Employee } from './employeeTypes';

// Use singleton service instance
const employeeService = employeeServiceInstance;

/**
 * Fetch employees with pagination
 */
export const fetchEmployeesThunk = createAsyncThunk<
  PaginatedResponse<Employee>,
  PaginatedRequest,
  { rejectValue: string }
>('employee/fetchEmployees', async (params, { rejectWithValue }) => {
  try {
    const response = await employeeService.getEmployees(params);
    return response;
  } catch (error: any) {
    const message = error.message || 'Không thể tải danh sách nhân viên';
    return rejectWithValue(message);
  }
});

/**
 * Fetch single employee detail
 */
export const fetchEmployeeDetailThunk = createAsyncThunk<
  Employee,
  string,
  { rejectValue: string }
>('employee/fetchEmployeeDetail', async (id, { rejectWithValue }) => {
  try {
    const response = await employeeService.getEmployeeById(id);
    return response;
  } catch (error: any) {
    const message = error.message || 'Không thể tải thông tin nhân viên';
    return rejectWithValue(message);
  }
});

/**
 * Create new employee
 */
export const createEmployeeThunk = createAsyncThunk<
  Employee,
  Omit<Employee, 'id'>,
  { rejectValue: string }
>('employee/createEmployee', async (data, { rejectWithValue }) => {
  try {
    const response = await employeeService.createEmployee(data);
    return response;
  } catch (error: any) {
    const message = error.message || 'Thêm nhân viên thất bại';
    return rejectWithValue(message);
  }
});

/**
 * Update employee
 */
export const updateEmployeeThunk = createAsyncThunk<
  Employee,
  { id: string; data: Partial<Employee> },
  { rejectValue: string }
>('employee/updateEmployee', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await employeeService.updateEmployee(id, data);
    return response;
  } catch (error: any) {
    const message = error.message || 'Cập nhật nhân viên thất bại';
    return rejectWithValue(message);
  }
});

/**
 * Delete employee
 */
export const deleteEmployeeThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('employee/deleteEmployee', async (id, { rejectWithValue }) => {
  try {
    await employeeService.deleteEmployee(id);
    return id;
  } catch (error: any) {
    const message = error.message || 'Xóa nhân viên thất bại';
    return rejectWithValue(message);
  }
});
