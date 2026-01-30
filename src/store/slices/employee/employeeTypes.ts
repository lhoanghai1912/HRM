// src/store/slices/employee/employeeTypes.ts
// Employee types

import { LoadingState } from '../../../types/api';

// Employee interface
export interface Employee {
  id: string;
  code: string;
  fullName: string;
  email?: string;
  phone?: string;
  department?: string;
  position?: string;
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  joinDate?: string;
}

// Employee state interface
export interface EmployeeState {
  employees: Employee[];
  selectedEmployee: Employee | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
  };
  loadingState: LoadingState;
  error: string | null;
  searchQuery: string;
}
