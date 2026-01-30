// src/hooks/useColors.ts
// Hook to get theme-aware colors throughout the app

import { useTheme } from '../contexts/ThemeContext';
import tinycolor from 'tinycolor2';

/**
 * Hook to get current theme colors
 * Use this instead of importing colors from utils/color
 */
export const useColors = () => {
  const { colors } = useTheme();
  return colors;
};

/**
 * Utility functions for color manipulation
 */
export const darken = (color: string, amount: number = 20) => {
  return tinycolor(color).darken(amount).toHexString();
};

export const lighten = (color: string, amount: number = 20) => {
  return tinycolor(color).lighten(amount).toHexString();
};

export default useColors;
