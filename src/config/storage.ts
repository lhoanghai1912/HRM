// src/config/storage.ts
// AsyncStorage keys configuration

export const storageKeys = {
  // Authentication
  AUTH_TOKEN: '@hrm_auth_token',
  REFRESH_TOKEN: '@hrm_refresh_token',
  USER_DATA: '@hrm_user_data',

  // User preferences
  THEME: '@hrm_theme',
  LANGUAGE: '@hrm_language',

  // App state
  ONBOARDING_COMPLETED: '@hrm_onboarding_completed',
  LAST_SYNC: '@hrm_last_sync',

  // Cache
  CACHE_EMPLOYEES: '@hrm_cache_employees',
  CACHE_DEPARTMENTS: '@hrm_cache_departments',

  // Settings
  NOTIFICATION_ENABLED: '@hrm_notification_enabled',
  BIOMETRIC_ENABLED: '@hrm_biometric_enabled',
};

// Helper function to create dynamic keys
export const createStorageKey = (base: string, id: string): string => {
  return `${base}_${id}`;
};
