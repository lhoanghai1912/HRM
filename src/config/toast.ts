// src/config/toast.ts
// Toast configuration for react-native-toast-message

import { BaseToastProps } from 'react-native-toast-message';
import { StyleSheet, View, Text } from 'react-native';

// Toast timing configuration
export const toastConfig = {
  // Default visibility time in milliseconds
  visibilityTime: 4000,

  // Auto-hide toast
  autoHide: true,

  // Position
  position: 'top' as const,

  // Top offset (accounting for status bar)
  topOffset: 50,

  // Bottom offset
  bottomOffset: 40,
};

// Toast type colors
export const toastColors = {
  success: {
    background: '#D4EDDA',
    border: '#0E771E',
    text: '#155724',
    icon: '✓',
  },
  error: {
    background: '#F8D7DA',
    border: '#E4080A',
    text: '#721C24',
    icon: '✕',
  },
  info: {
    background: '#CCE5FF',
    border: '#095286',
    text: '#004085',
    icon: 'ℹ',
  },
  warning: {
    background: '#FFF3CD',
    border: '#FCA326',
    text: '#856404',
    icon: '⚠',
  },
};

// Custom toast styles
export const toastStyles = StyleSheet.create({
  container: {
    width: '90%',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  message: {
    fontSize: 13,
  },
});

/**
 * Show a success toast
 */
export const showSuccessToast = (message: string, title?: string) => {
  const Toast = require('react-native-toast-message').default;
  Toast.show({
    type: 'success',
    text1: title || 'Thành công',
    text2: message,
    ...toastConfig,
  });
};

/**
 * Show an error toast
 */
export const showErrorToast = (message: string, title?: string) => {
  const Toast = require('react-native-toast-message').default;
  Toast.show({
    type: 'error',
    text1: title || 'Lỗi',
    text2: message,
    ...toastConfig,
  });
};

/**
 * Show an info toast
 */
export const showInfoToast = (message: string, title?: string) => {
  const Toast = require('react-native-toast-message').default;
  Toast.show({
    type: 'info',
    text1: title || 'Thông báo',
    text2: message,
    ...toastConfig,
  });
};

/**
 * Show a warning toast
 */
export const showWarningToast = (message: string, title?: string) => {
  const Toast = require('react-native-toast-message').default;
  Toast.show({
    type: 'warning',
    text1: title || 'Cảnh báo',
    text2: message,
    ...toastConfig,
  });
};

/**
 * Hide current toast
 */
export const hideToast = () => {
  const Toast = require('react-native-toast-message').default;
  Toast.hide();
};
