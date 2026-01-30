import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { spacing } from '../../utils/spacing';
import { border, fonts, weight } from '../../utils/fontSize';
import { useColors } from '../../hooks/useColors';

interface LanguageModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectLanguage: (code: string) => void;
  selectedLanguage: string;
  languages: { code: string; label: string }[];
}

const LanguageModal = ({
  visible,
  onClose,
  onSelectLanguage,
  selectedLanguage,
  languages,
}: LanguageModalProps) => {
  const { t, i18n } = useTranslation();
  const colors = useColors();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[styles.modalContainer, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.title, { color: colors.text }]}>
            {t('button.choose_language')}
          </Text>

          {languages.map(lang => (
            <Pressable
              key={lang.code}
              onPress={() => onSelectLanguage(lang.code)}
              style={[
                styles.languageItem,
                {
                  backgroundColor:
                    selectedLanguage === lang.code
                      ? colors.primary
                      : colors.surface,
                  borderBottomColor: colors.divider,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 16,
                  color:
                    selectedLanguage === lang.code
                      ? colors.buttonText
                      : colors.text,
                }}
              >
                {lang.label}
              </Text>
            </Pressable>
          ))}

          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeText, { color: colors.primary }]}>
              {t('button.close')}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default LanguageModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    borderRadius: border.radiusLarge,
    padding: spacing.medium,
    width: '60%',
  },
  title: {
    fontWeight: weight.bold,
    fontSize: fonts.normal,
    marginBottom: spacing.medium,
    textAlign: 'center',
  },
  languageItem: {
    borderBottomWidth: 1,
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
  },
  closeButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  closeText: {
    fontWeight: weight.bold,
    fontSize: 16,
  },
});
