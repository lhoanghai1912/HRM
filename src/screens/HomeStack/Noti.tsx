import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../../utils/color';
import { ms, spacing } from '../../utils/spacing';
import { Fonts } from '../../utils/fontSize';

const Notifications = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`Notifications`}</Text>
      {/* ✨ Your content goes here */}
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.medium,
  },
  title: {
    fontSize: Fonts.normal,
    fontWeight: 'bold',
    color: colors.black,
  },
});
