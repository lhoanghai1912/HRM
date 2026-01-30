// src/services/BaseService.ts
// Base service class with common functionality

import { api } from '../api/client';
import { ApiResponse, PaginatedRequest, PaginatedResponse } from '../types/api';

/**
 * Base service class providing common HTTP methods
 * All other services should extend this class
 */
export abstract class BaseService {
  protected basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  /**
   * Build URL with path
   */
  protected buildUrl(path: string = ''): string {
    return `${this.basePath}${path}`;
  }

  /**
   * GET request
   */
  protected async get<T>(path: string = '', params?: object): Promise<T> {
    return api.get<T>(this.buildUrl(path), { params });
  }

  /**
   * POST request
   */
  protected async post<T>(path: string = '', data?: object): Promise<T> {
    return api.post<T>(this.buildUrl(path), data);
  }

  /**
   * PUT request
   */
  protected async put<T>(path: string = '', data?: object): Promise<T> {
    return api.put<T>(this.buildUrl(path), data);
  }

  /**
   * PATCH request
   */
  protected async patch<T>(path: string = '', data?: object): Promise<T> {
    return api.patch<T>(this.buildUrl(path), data);
  }

  /**
   * DELETE request
   */
  protected async delete<T>(path: string = ''): Promise<T> {
    return api.delete<T>(this.buildUrl(path));
  }

  /**
   * Get paginated list
   */
  protected async getPaginated<T>(
    path: string = '',
    params: PaginatedRequest,
  ): Promise<PaginatedResponse<T>> {
    return this.get<PaginatedResponse<T>>(path, params);
  }
}
