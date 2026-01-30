// src/validation/commonValidation.ts
// Common validation utilities

import { ValidationResult } from './authValidation';

/**
 * Validate required field
 */
export const validateRequired = (
  value: any,
  fieldName: string = 'Trường này',
): ValidationResult => {
  if (value === null || value === undefined) {
    return { isValid: false, error: `${fieldName} không được để trống` };
  }

  if (typeof value === 'string' && value.trim().length === 0) {
    return { isValid: false, error: `${fieldName} không được để trống` };
  }

  if (Array.isArray(value) && value.length === 0) {
    return { isValid: false, error: `${fieldName} không được để trống` };
  }

  return { isValid: true, error: null };
};

/**
 * Validate minimum length
 */
export const validateMinLength = (
  value: string,
  minLength: number,
  fieldName: string = 'Trường này',
): ValidationResult => {
  if (!value || value.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} phải có ít nhất ${minLength} ký tự`,
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate maximum length
 */
export const validateMaxLength = (
  value: string,
  maxLength: number,
  fieldName: string = 'Trường này',
): ValidationResult => {
  if (value && value.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} không được quá ${maxLength} ký tự`,
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate phone number (Vietnamese format)
 */
export const validatePhoneNumber = (phone: string): ValidationResult => {
  if (!phone || phone.trim().length === 0) {
    return { isValid: false, error: 'Số điện thoại không được để trống' };
  }

  // Vietnamese phone number format
  const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return { isValid: false, error: 'Số điện thoại không hợp lệ' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate date format (DD/MM/YYYY)
 */
export const validateDate = (dateString: string): ValidationResult => {
  if (!dateString || dateString.trim().length === 0) {
    return { isValid: false, error: 'Ngày không được để trống' };
  }

  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateString.match(dateRegex);

  if (!match) {
    return {
      isValid: false,
      error: 'Định dạng ngày không hợp lệ (DD/MM/YYYY)',
    };
  }

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);

  // Check valid ranges
  if (month < 1 || month > 12) {
    return { isValid: false, error: 'Tháng không hợp lệ' };
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) {
    return { isValid: false, error: 'Ngày không hợp lệ' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate number range
 */
export const validateNumberRange = (
  value: number,
  min: number,
  max: number,
  fieldName: string = 'Giá trị',
): ValidationResult => {
  if (isNaN(value)) {
    return { isValid: false, error: `${fieldName} phải là số` };
  }

  if (value < min) {
    return {
      isValid: false,
      error: `${fieldName} phải lớn hơn hoặc bằng ${min}`,
    };
  }

  if (value > max) {
    return {
      isValid: false,
      error: `${fieldName} phải nhỏ hơn hoặc bằng ${max}`,
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate URL format
 */
export const validateUrl = (url: string): ValidationResult => {
  if (!url || url.trim().length === 0) {
    return { isValid: true, error: null }; // URL is optional
  }

  try {
    new URL(url);
    return { isValid: true, error: null };
  } catch {
    return { isValid: false, error: 'URL không hợp lệ' };
  }
};

/**
 * Validate ID card number (CMND/CCCD - Vietnamese format)
 */
export const validateIdCard = (idCard: string): ValidationResult => {
  if (!idCard || idCard.trim().length === 0) {
    return { isValid: false, error: 'Số CMND/CCCD không được để trống' };
  }

  // CMND: 9 or 12 digits, CCCD: 12 digits
  const idCardRegex = /^(\d{9}|\d{12})$/;
  if (!idCardRegex.test(idCard)) {
    return { isValid: false, error: 'Số CMND/CCCD không hợp lệ' };
  }

  return { isValid: true, error: null };
};
