// src/contexts/index.tsx
// Export all contexts from a single entry point

export { ThemeProvider, useTheme, useThemedColors } from './ThemeContext';
export type { ThemeColors, ThemeMode } from './ThemeContext';

export { LanguageProvider, useLanguage } from './LanguageContext';
export type { LanguageCode } from './LanguageContext';
