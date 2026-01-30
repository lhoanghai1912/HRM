// src/hooks/index.ts
// Central export for all custom hooks

// Re-export existing hooks from components/hooks
export {
  useDatePicker,
  useMonthPicker,
  useFilePicker,
  useImagePicker,
} from '../components/hooks/useFieldHandlers';
export {
  useSelectPicker,
  useEmployeePicker,
  useLocationPicker,
  useOrgTreePicker,
  useProcedurePicker,
} from '../components/hooks/useSelectPicker';

// Export Redux hooks
export { useAppDispatch, useAppSelector } from '../store/hooks';

// Export context hooks
export { useTheme, useThemedColors } from '../contexts/ThemeContext';
export { useLanguage } from '../contexts/LanguageContext';

// Custom hooks
export { useDebounce } from './useDebounce';
export { useAsyncStorage } from './useAsyncStorage';
export { useKeyboard } from './useKeyboard';
export { useThemedStyles, useIconStyle } from './useThemedStyles';
