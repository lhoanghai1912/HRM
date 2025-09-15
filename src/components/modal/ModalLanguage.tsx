import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../../utils/color';
import { spacing } from '../../utils/spacing';
import { Fonts } from '../../utils/fontSize';

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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{t('button.choose_language')}</Text>

          {languages.map(lang => (
            <Pressable
              key={lang.code}
              onPress={() => onSelectLanguage(lang.code)}
              style={({ pressed }) => [
                styles.languageItem,
                {
                  backgroundColor:
                    selectedLanguage === lang.code
                      ? colors.primary
                      : colors.white,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 16,
                  color:
                    selectedLanguage === lang.code
                      ? colors.white
                      : colors.black,
                }}
              >
                {lang.label}
              </Text>
            </Pressable>
          ))}

          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>{t('button.close')}</Text>
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
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: spacing.medium,
    width: '60%',
  },
  title: {
    fontWeight: 'bold',
    fontSize: Fonts.normal,
    marginBottom: spacing.medium,
    textAlign: 'center',
  },
  languageItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
  },
  closeButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  closeText: {
    color: '#1A7FEE',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
