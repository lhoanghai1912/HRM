// src/constants/dimensions.ts
// Dimension constants for consistent spacing and sizing

import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (based on design specs)
const baseWidth = 375;
const baseHeight = 812;

/**
 * Scale width based on screen size
 */
export const scaleWidth = (size: number): number => {
  return (SCREEN_WIDTH / baseWidth) * size;
};

/**
 * Scale height based on screen size
 */
export const scaleHeight = (size: number): number => {
  return (SCREEN_HEIGHT / baseHeight) * size;
};

/**
 * Moderate scale - a mix between scaling and fixed sizes
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  return size + (scaleWidth(size) - size) * factor;
};

// Screen dimensions
export const dimensions = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  isSmallDevice: SCREEN_WIDTH < 375,
  isLargeDevice: SCREEN_WIDTH >= 414,
};

// Spacing scale
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

// Font sizes
export const fontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  h3: 24,
  h2: 28,
  h1: 32,
};

// Line heights
export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
};

// Icon sizes
export const iconSize = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Header heights
export const headerHeight = {
  default: Platform.OS === 'ios' ? 44 : 56,
  large: Platform.OS === 'ios' ? 96 : 100,
};

// Bottom tab height
export const tabBarHeight = Platform.OS === 'ios' ? 83 : 60;

// Status bar height
export const statusBarHeight = Platform.OS === 'ios' ? 44 : 24;

// Safe area padding
export const safeAreaPadding = {
  top: Platform.OS === 'ios' ? 44 : 24,
  bottom: Platform.OS === 'ios' ? 34 : 0,
};

// Button heights
export const buttonHeight = {
  sm: 32,
  md: 44,
  lg: 52,
};

// Input heights
export const inputHeight = {
  sm: 36,
  md: 44,
  lg: 52,
};

// Card dimensions
export const card = {
  padding: spacing.md,
  borderRadius: borderRadius.lg,
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
};
