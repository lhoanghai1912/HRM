// src/validation/formValidation.ts
// Generic form validation utilities

import { ValidationResult } from './authValidation';

/**
 * Validation rule type
 */
export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message?: string;
  validator?: (value: any) => boolean;
}

/**
 * Field validation configuration
 */
export interface FieldConfig {
  name: string;
  label: string;
  rules: ValidationRule[];
}

/**
 * Validate a single value against multiple rules
 */
export const validateField = (
  value: any,
  rules: ValidationRule[],
  label: string = 'Trường này',
): ValidationResult => {
  for (const rule of rules) {
    switch (rule.type) {
      case 'required':
        if (
          value === null ||
          value === undefined ||
          (typeof value === 'string' && value.trim() === '')
        ) {
          return {
            isValid: false,
            error: rule.message || `${label} không được để trống`,
          };
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          return {
            isValid: false,
            error: rule.message || 'Email không hợp lệ',
          };
        }
        break;

      case 'minLength':
        if (value && value.length < rule.value) {
          return {
            isValid: false,
            error:
              rule.message || `${label} phải có ít nhất ${rule.value} ký tự`,
          };
        }
        break;

      case 'maxLength':
        if (value && value.length > rule.value) {
          return {
            isValid: false,
            error:
              rule.message || `${label} không được quá ${rule.value} ký tự`,
          };
        }
        break;

      case 'pattern':
        if (value && !rule.value.test(value)) {
          return {
            isValid: false,
            error: rule.message || `${label} không đúng định dạng`,
          };
        }
        break;

      case 'custom':
        if (rule.validator && !rule.validator(value)) {
          return {
            isValid: false,
            error: rule.message || `${label} không hợp lệ`,
          };
        }
        break;
    }
  }

  return { isValid: true, error: null };
};

/**
 * Validate an entire form
 */
export const validateForm = <T extends Record<string, any>>(
  values: T,
  config: FieldConfig[],
): { isValid: boolean; errors: Record<keyof T, string | null> } => {
  const errors: Record<string, string | null> = {};
  let isValid = true;

  for (const field of config) {
    const value = values[field.name];
    const result = validateField(value, field.rules, field.label);

    if (!result.isValid) {
      isValid = false;
      errors[field.name] = result.error;
    } else {
      errors[field.name] = null;
    }
  }

  return { isValid, errors: errors as Record<keyof T, string | null> };
};

/**
 * Create a form validator function
 */
export const createFormValidator = <T extends Record<string, any>>(
  config: FieldConfig[],
) => {
  return (values: T) => validateForm(values, config);
};

/**
 * Example usage:
 *
 * const loginFormConfig: FieldConfig[] = [
 *   {
 *     name: 'username',
 *     label: 'Tên đăng nhập',
 *     rules: [
 *       { type: 'required' },
 *       { type: 'minLength', value: 3 },
 *     ],
 *   },
 *   {
 *     name: 'password',
 *     label: 'Mật khẩu',
 *     rules: [
 *       { type: 'required' },
 *       { type: 'minLength', value: 6 },
 *     ],
 *   },
 * ];
 *
 * const validateLogin = createFormValidator(loginFormConfig);
 * const { isValid, errors } = validateLogin({ username: 'test', password: '123' });
 */
