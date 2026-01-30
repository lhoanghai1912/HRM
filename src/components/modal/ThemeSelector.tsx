import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useTheme, ThemeMode } from '../../contexts/ThemeContext';
import useColors from '../../hooks/useColors';
import { spacing, ms } from '../../utils/spacing';
import { border, fonts, weight } from '../../utils/fontSize';
import icons from '../../assets/icons';
import { useTranslation } from 'react-i18next';

interface ThemeSelectorProps {
  visible: boolean;
  onClose: () => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ visible, onClose }) => {
  const colors = useColors();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  const themeOptions: { value: ThemeMode; label: string; icon: any }[] = [
    {
      value: 'light',
      label: t('theme.light') || 'Sáng',
      icon: icons.notification,
    },
    {
      value: 'dark',
      label: t('theme.dark') || 'Tối',
      icon: icons.hide,
    },
    {
      value: 'system',
      label: t('theme.system') || 'Theo hệ thống',
      icon: icons.settings,
    },
  ];

  const handleSelectTheme = (selectedTheme: ThemeMode) => {
    setTheme(selectedTheme);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={[styles.modalContainer, { backgroundColor: colors.surface }]}
        >
          <TouchableOpacity activeOpacity={1}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
              <Text style={[styles.title, { color: colors.text }]}>
                {t('theme.select') || 'Chọn giao diện'}
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Image
                  source={icons.clear}
                  style={[styles.closeIcon, { tintColor: colors.darkGray }]}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.optionsContainer}>
              {themeOptions.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.option,
                    { backgroundColor: colors.background },
                    theme === option.value && {
                      backgroundColor: colors.blue + '20',
                      borderWidth: 1,
                      borderColor: colors.blue,
                    },
                  ]}
                  onPress={() => handleSelectTheme(option.value)}
                >
                  <View style={styles.optionContent}>
                    <Image
                      source={option.icon}
                      style={[
                        styles.optionIcon,
                        { tintColor: colors.darkGray },
                      ]}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        { color: colors.text },
                        theme === option.value && {
                          fontWeight: weight.bold,
                          color: colors.blue,
                        },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </View>
                  {theme === option.value && (
                    <Image
                      source={icons.valid}
                      style={[styles.checkIcon, { tintColor: colors.blue }]}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    borderRadius: border.radiusMedium,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.medium,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: fonts.large,
    fontWeight: weight.bold,
  },
  closeButton: {
    padding: spacing.small,
  },
  closeIcon: {
    width: ms(20),
    height: ms(20),
  },
  optionsContainer: {
    padding: spacing.medium,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.medium,
    borderRadius: border.radiusSmall,
    marginBottom: spacing.small,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: ms(24),
    height: ms(24),
    marginRight: spacing.medium,
  },
  optionText: {
    fontSize: fonts.normal,
  },
  checkIcon: {
    width: ms(20),
    height: ms(20),
  },
});

export default ThemeSelector;
