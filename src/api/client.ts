// src/api/client.ts
// Centralized API client configuration with Axios

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { apiConfig } from '../config/api';
import { storageKeys } from '../config/storage';
import { ApiError } from '../types/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: apiConfig.headers,
});

// Request interceptor - attach auth token
apiClient.interceptors.request.use(
  async config => {
    try {
      // Get token from AsyncStorage (more reliable than Redux for interceptors)
      const token = await AsyncStorage.getItem(storageKeys.AUTH_TOKEN);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }

    // Log request in development
    if (__DEV__) {
      console.log(`🚀 [${config.method?.toUpperCase()}] ${config.url}`);
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  response => {
    // Log successful response in development
    if (__DEV__) {
      console.log(`✅ [${response.status}] ${response.config.url}`);
    }

    // Handle non-2xx status codes that somehow got through
    if (response.status > 299) {
      const error: ApiError = {
        message: response.data?.message || 'Có lỗi xảy ra',
        status: response.status,
      };
      return Promise.reject(error);
    }

    return response;
  },
  async (error: AxiosError<any>) => {
    // Log error in development
    if (__DEV__) {
      console.error('❌ API Error:', error.message);
      if (error.response) {
        console.error('📥 Response status:', error.response.status);
        console.error('📦 Response data:', error.response.data);
      }
    }

    // Handle different error scenarios
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      const message = data?.message || getDefaultErrorMessage(status);

      // Handle 401 Unauthorized - token expired
      if (status === 401) {
        // Clear auth data and redirect to login
        await AsyncStorage.multiRemove([
          storageKeys.AUTH_TOKEN,
          storageKeys.REFRESH_TOKEN,
          storageKeys.USER_DATA,
        ]);

        Toast.show({
          type: 'error',
          text1: 'Phiên đăng nhập hết hạn',
          text2: 'Vui lòng đăng nhập lại',
        });

        // Navigation to login should be handled by the auth state listener
      } else if (status === 403) {
        Toast.show({
          type: 'error',
          text1: 'Không có quyền truy cập',
          text2: message,
        });
      } else if (status >= 500) {
        Toast.show({
          type: 'error',
          text1: 'Lỗi máy chủ',
          text2: 'Vui lòng thử lại sau',
        });
      } else {
        // Show error toast for other errors
        Toast.show({
          type: 'error',
          text2: message,
        });
      }

      // Create standardized error object
      const apiError: ApiError = {
        message,
        status,
        code: data?.code,
        errors: data?.errors,
      };

      return Promise.reject(apiError);
    } else if (error.request) {
      // Network error - no response received
      Toast.show({
        type: 'error',
        text1: 'Lỗi kết nối',
        text2: 'Vui lòng kiểm tra kết nối mạng',
      });

      const networkError: ApiError = {
        message: 'Không thể kết nối đến máy chủ',
        status: 0,
        code: 'NETWORK_ERROR',
      };

      return Promise.reject(networkError);
    } else {
      // Something else happened
      const unknownError: ApiError = {
        message: error.message || 'Đã có lỗi xảy ra',
        status: 0,
        code: 'UNKNOWN_ERROR',
      };

      return Promise.reject(unknownError);
    }
  },
);

// Helper function to get default error messages
function getDefaultErrorMessage(status: number): string {
  const errorMessages: Record<number, string> = {
    400: 'Yêu cầu không hợp lệ',
    401: 'Phiên đăng nhập hết hạn',
    403: 'Không có quyền truy cập',
    404: 'Không tìm thấy dữ liệu',
    409: 'Dữ liệu đã tồn tại',
    422: 'Dữ liệu không hợp lệ',
    429: 'Quá nhiều yêu cầu, vui lòng thử lại sau',
    500: 'Lỗi máy chủ',
    502: 'Máy chủ không phản hồi',
    503: 'Dịch vụ tạm thời không khả dụng',
  };

  return errorMessages[status] || 'Đã có lỗi xảy ra';
}

// Export the client
export default apiClient;

// Export helper methods for common API patterns
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config).then(res => res.data),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, data, config).then(res => res.data),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.put<T>(url, data, config).then(res => res.data),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.patch<T>(url, data, config).then(res => res.data),

  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T>(url, config).then(res => res.data),
};
