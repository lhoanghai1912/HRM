import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../../utils/color';
import { ms, spacing } from '../../utils/spacing';
import { Fonts } from '../../utils/fontSize';

const QuickPin = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{'Quick Pin'}</Text>
      {/* ✨ Your content goes here */}
    </View>
  );
};

export default QuickPin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: Fonts.normal,
    fontWeight: 'bold',
    color: colors.black,
  },
});
