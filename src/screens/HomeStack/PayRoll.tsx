import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../../utils/color';
import { ms, spacing } from '../../utils/spacing';
import { fonts } from '../../utils/fontSize';
import CustomHeader from '../../navigation/CustomHeader';
import AppStyles from '../../components/AppStyle';

const PayRoll = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <CustomHeader />
      <Text style={AppStyles.label}>{'Pay roll'}</Text>
    </View>
  );
};

export default PayRoll;

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
