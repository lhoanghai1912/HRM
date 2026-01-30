// src/components/AppButton.tsx

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  StyleSheet,
  Image,
  View,
  ImageSourcePropType,
  ImageStyle,
} from 'react-native';
import { spacing } from '../utils/spacing';
import { border, fonts } from '../utils/fontSize';
import { useColors } from '../hooks/useColors';

interface AppButtonProps {
  // key?: number;
  onPress: () => void; // Hàm khi nhấn nút
  title?: string; // Tiêu đề nút
  customStyle?: ViewStyle; // Custom style cho nút
  disabled?: boolean;
  leftIcon?: ImageSourcePropType; // icon key trong ICONS
  textStyle?: TextStyle; // 👈 style cho text
  iconStyle?: ImageStyle;
}

const AppButton: React.FC<AppButtonProps> = ({
  // key,
  onPress,
  title,
  customStyle,
  disabled,
  leftIcon,
  textStyle,
  iconStyle,
}) => {
  const colors = useColors();
  return (
    <TouchableOpacity
      // key={key}
      disabled={disabled}
      onPress={onPress}
      style={[
        disabled
          ? [styles.buttonDisabled, { backgroundColor: colors.buttonDisabled }]
          : [
              styles.button,
              { backgroundColor: colors.button, shadowColor: colors.primary },
            ],
        customStyle,
        { opacity: disabled ? 0.5 : 1 },
      ]}
    >
      <View style={leftIcon ? styles.contentWrapper : undefined}>
        {leftIcon && (
          <Image
            source={leftIcon}
            style={[styles.icon, iconStyle, { tintColor: colors.buttonText }]}
            resizeMode="contain"
          />
        )}

        <Text
          style={[styles.buttonText, textStyle, { color: colors.buttonText }]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  //Button
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    borderRadius: border.radiusExtraLarge,
    justifyContent: 'center',
    alignContent: 'center',
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },

  buttonDisabled: {
    borderRadius: border.radiusExtraLarge,
    justifyContent: 'center',
    alignContent: 'center',
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
  },
  buttonText: {
    fontSize: fonts.normal,
    fontWeight: '500',
    textAlign: 'center',
  },

  icon: {
    width: 20,
    height: 20,
    marginRight: spacing.small,
  },
});

export default AppButton;
