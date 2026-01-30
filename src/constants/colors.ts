// src/constants/colors.ts
// Color palette constants

// Re-export from utils/color for backward compatibility
export { colors, darken, lighten } from '../utils/color';

// Additional semantic color mappings
export const semanticColors = {
  // Status colors
  success: '#0E771E',
  warning: '#FCA326',
  error: '#E4080A',
  info: '#095286',

  // Text colors
  textPrimary: '#000000',
  textSecondary: '#777983',
  textDisabled: '#bababa',
  textInverse: '#FFFFFF',

  // Background colors
  backgroundPrimary: '#F2F2F7',
  backgroundSecondary: '#FFFFFF',
  backgroundDisabled: '#F0EFF4',

  // Border colors
  borderLight: '#DFDFDF',
  borderMedium: '#bababa',
  borderDark: '#777983',

  // Interactive colors
  interactive: '#095286',
  interactiveHover: '#064d7a',
  interactivePressed: '#043a5c',
  interactiveDisabled: '#F0EFF4',
};

// Status badge colors
export const statusColors = {
  pending: { bg: '#FFF3CD', text: '#856404' },
  approved: { bg: '#D4EDDA', text: '#155724' },
  rejected: { bg: '#F8D7DA', text: '#721C24' },
  draft: { bg: '#E2E3E5', text: '#383D41' },
  processing: { bg: '#CCE5FF', text: '#004085' },
};
