// src/contexts/ThemeContext.tsx
// Theme context providing light/dark mode support

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Theme color definitions
export const lightColors = {
  // Brand colors
  primary: '#095286', // Main brand blue
  secondary: '#598CD2', // Secondary blue
  accent: '#FCA326', // Orange accent

  // Background colors
  background: '#F5F5F5', // Light gray background
  surface: '#FFFFFF', // White cards/surfaces
  card: '#FFFFFF', // Card background

  // Text colors
  text: '#1A1A1A', // Primary text (almost black)
  textSecondary: '#666666', // Secondary text
  textTertiary: '#999999', // Tertiary text
  textInverse: '#FFFFFF', // Text on dark backgrounds

  // Semantic colors
  success: '#10B981', // Green for success
  error: '#EF4444', // Red for errors
  warning: '#F59E0B', // Yellow/Orange for warnings
  info: '#3B82F6', // Blue for info

  // Border & Divider
  border: '#E5E5E5', // Light border
  divider: '#F0F0F0', // Divider lines
  underline: '#D1D5DB',

  // Interactive elements
  button: '#095286', // Primary button
  buttonHover: '#073D63', // Button hover state
  buttonDisabled: '#D1D5DB', // Disabled button
  buttonText: '#FFFFFF', // Button text
  link: '#2563EB', // Link color

  // Shades of gray
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // Legacy compatibility
  gray: '#9CA3AF',
  lightGray: '#E5E7EB',
  darkGray: '#4B5563',
  blue: '#095286',
  red: '#EF4444',
  green: '#10B981',
  orange: '#FCA326',
  white: '#FFFFFF',
  black: '#000000',
};

export const darkColors = {
  // Brand colors
  primary: '#3B82F6', // Lighter blue for dark mode
  secondary: '#60A5FA', // Lighter secondary
  accent: '#FBBF24', // Lighter orange accent

  // Background colors
  background: '#0F0F0F', // Very dark background
  surface: '#1A1A1A', // Dark surface
  card: '#1F1F1F', // Card background

  // Text colors
  text: '#F5F5F5', // Light text
  textSecondary: '#A3A3A3', // Secondary text
  textTertiary: '#737373', // Tertiary text
  textInverse: '#1A1A1A', // Text on light backgrounds

  // Semantic colors
  success: '#34D399', // Lighter green
  error: '#F87171', // Lighter red
  warning: '#FBBF24', // Lighter yellow
  info: '#60A5FA', // Lighter blue

  // Border & Divider
  border: '#2A2A2A', // Dark border
  divider: '#262626', // Dark divider
  underline: '#404040',

  // Interactive elements
  button: '#3B82F6', // Primary button
  buttonHover: '#2563EB', // Button hover
  buttonDisabled: '#404040', // Disabled button
  buttonText: '#FFFFFF', // Button text
  link: '#60A5FA', // Link color

  // Shades of gray (inverted for dark mode)
  gray50: '#1A1A1A',
  gray100: '#262626',
  gray200: '#333333',
  gray300: '#404040',
  gray400: '#525252',
  gray500: '#737373',
  gray600: '#A3A3A3',
  gray700: '#D4D4D4',
  gray800: '#E5E5E5',
  gray900: '#F5F5F5',

  // Legacy compatibility
  gray: '#737373',
  lightGray: '#404040',
  darkGray: '#A3A3A3',
  blue: '#3B82F6',
  red: '#F87171',
  green: '#34D399',
  orange: '#FBBF24',
  white: '#FFFFFF',
  black: '#000000',
};

export type ThemeColors = typeof lightColors;
export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@app_theme';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>('system');

  // Load saved theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setThemeState(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };
    loadTheme();
  }, []);

  // Determine if we should use dark mode
  const isDark =
    theme === 'dark' || (theme === 'system' && systemColorScheme === 'dark');

  // Get the appropriate color palette
  const colors = isDark ? darkColors : lightColors;

  // Save theme preference
  const setTheme = async (newTheme: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  // Toggle between light and dark (ignoring system)
  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const value: ThemeContextType = {
    theme,
    isDark,
    colors,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

/**
 * Hook to access theme context
 * Must be used within a ThemeProvider
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * Hook to get theme-aware colors
 * Convenience hook that only returns the colors object
 */
export const useThemedColors = (): ThemeColors => {
  const { colors } = useTheme();
  return colors;
};

export default ThemeContext;
