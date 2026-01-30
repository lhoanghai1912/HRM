// src/types/api.ts
// API related types

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedRequest {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
}

// Async thunk state helpers
export interface AsyncState<T = any> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';
