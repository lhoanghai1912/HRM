import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../../utils/color';
import { ms, spacing } from '../../utils/spacing';
import { fonts } from '../../utils/fontSize';
import AppStyles from '../../components/AppStyle';
import CustomHeader from '../../components/CustomHeader';

const TimeSheet = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <CustomHeader />
      <Text style={AppStyles.label}>{`TimeSheet`}</Text>
      {/* ✨ Your content goes here */}
    </View>
  );
};

export default TimeSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  body: {
    flex: 1,
    justifyContent: 'center',
    margin: spacing.small,
    backgroundColor: colors.white,
  },
  text: {
    fontSize: 24,
  },
});
