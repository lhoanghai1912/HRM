// src/hooks/useThemedStyles.ts
// Hook providing themed styles for common UI elements

import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useColors } from './useColors';
import { border, fonts, weight } from '../utils/fontSize';
import { ms, spacing } from '../utils/spacing';

/**
 * Hook that returns commonly used styles with dynamic theme colors
 * Use this instead of static AppStyles when you need themed colors
 */
export const useThemedStyles = () => {
  const colors = useColors();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        // Icon with theme tintColor
        icon: {
          width: ms(25),
          height: ms(25),
          tintColor: colors.text,
        },

        // Text styles
        title: {
          fontSize: fonts.xlarge,
          color: colors.text,
          textAlign: 'left',
          fontWeight: weight.bold,
          marginBottom: spacing.small,
        },
        label: {
          fontSize: fonts.large,
          color: colors.textSecondary,
        },
        text: {
          fontSize: fonts.normal,
          color: colors.text,
        },
        textSecondary: {
          fontSize: fonts.normal,
          color: colors.textSecondary,
        },
        textInverse: {
          fontSize: fonts.normal,
          color: colors.textInverse,
        },

        // Input styles
        input: {
          height: 50,
          backgroundColor: colors.surface,
          borderRadius: border.radiusMedium,
          paddingHorizontal: spacing.medium,
          verticalAlign: 'middle',
          fontSize: fonts.normal,
          borderWidth: 1,
          borderColor: colors.border,
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 6,
          elevation: 2,
          marginBottom: spacing.medium,
          color: colors.text,
        },

        // Line/Divider
        line: {
          marginVertical: spacing.small,
          borderColor: colors.border,
          borderWidth: 0.7,
          width: '100%',
        },

        // Dropdown
        dropdown: {
          position: 'absolute',
          top: 90,
          left: 0,
          right: 0,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: border.radiusSmall,
          zIndex: 100,
        },
        dropdownItem: {
          padding: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.divider,
        },

        // Link
        linkText: {
          color: colors.link,
          fontSize: fonts.normal,
          textDecorationLine: 'underline',
          textDecorationColor: colors.link,
        },
      }),
    [colors],
  );

  return styles;
};

/**
 * Returns just the icon style with theme tintColor
 * Convenient for quick icon styling
 */
export const useIconStyle = () => {
  const colors = useColors();
  return useMemo(
    () => ({
      width: ms(25),
      height: ms(25),
      tintColor: colors.text,
    }),
    [colors.text],
  );
};

export default useThemedStyles;
