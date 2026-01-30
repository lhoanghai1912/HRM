// src/types/common.ts
// Common/shared types

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface FormField {
  name: string;
  label: string;
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'date'
    | 'select'
    | 'textarea';
  placeholder?: string;
  required?: boolean;
  options?: SelectOption[];
  validation?: FieldValidation;
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  message?: string;
}

export interface Toast {
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  duration?: number;
}

export interface MenuItem {
  id: string;
  title: string;
  icon?: string;
  route?: string;
  children?: MenuItem[];
}

export interface TabItem {
  key: string;
  title: string;
  icon?: string;
  component: React.ComponentType<any>;
}

// Date range type
export interface DateRange {
  startDate: Date | string;
  endDate: Date | string;
}

// Generic callback types
export type VoidCallback = () => void;
export type ValueCallback<T> = (value: T) => void;
export type AsyncCallback<T = void> = () => Promise<T>;
