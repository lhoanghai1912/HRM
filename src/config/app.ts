// src/config/app.ts
// Application configuration

export const appConfig = {
  // App name
  name: 'HRM',
  displayName: 'HRM System',
  version: '1.0.0',

  // Default language
  defaultLanguage: 'vi' as const,
  supportedLanguages: ['vi', 'en'] as const,

  // Default theme
  defaultTheme: 'system' as const,

  // Pagination defaults
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 50,
  },

  // Date formats
  dateFormats: {
    display: 'DD/MM/YYYY',
    displayTime: 'DD/MM/YYYY HH:mm',
    api: 'YYYY-MM-DD',
    apiTime: 'YYYY-MM-DDTHH:mm:ss',
  },

  // Toast configuration
  toast: {
    visibilityTime: 3000,
    autoHide: true,
    position: 'top' as const,
  },

  // Feature flags
  features: {
    biometricLogin: true,
    darkMode: true,
    notifications: true,
    offlineMode: false,
  },

  // Debug mode (should be false in production)
  debug: __DEV__,
};
