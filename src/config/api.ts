// src/config/api.ts
// API configuration

export const apiConfig = {
  // Base URL for API requests
  baseURL: 'https://pos.foxai.com.vn:184/api/',

  // Request timeout in milliseconds
  timeout: 10000,

  // Default headers
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },

  // Retry configuration
  retry: {
    maxRetries: 3,
    retryDelay: 1000,
  },

  // Endpoints
  endpoints: {
    auth: {
      login: 'Auth/login',
      register: 'Auth/register',
      sendOtp: 'Auth/send-otp-to-email',
      verifyOtp: 'Auth/verify-otp',
      refreshToken: 'Auth/refresh-token',
      logout: 'Auth/logout',
    },
    user: {
      profile: 'User/get-me',
      updateProfile: 'User/update-profile',
      changePassword: 'User/change-password',
    },
    employee: {
      list: 'Employee/list',
      detail: 'Employee/detail',
      create: 'Employee/create',
      update: 'Employee/update',
      delete: 'Employee/delete',
    },
    attendance: {
      list: 'Attendance/list',
      checkIn: 'Attendance/check-in',
      checkOut: 'Attendance/check-out',
      timesheet: 'Attendance/timesheet',
    },
    application: {
      list: 'Application/list',
      create: 'Application/create',
      approve: 'Application/approve',
      reject: 'Application/reject',
    },
  },
};
