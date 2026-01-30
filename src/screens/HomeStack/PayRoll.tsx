import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ms, spacing } from '../../utils/spacing';
import { fonts } from '../../utils/fontSize';
import CustomHeader from '../../components/CustomHeader';
import AppStyles from '../../components/AppStyle';
import icons from '../../assets/icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useColors } from '../../hooks/useColors';
import { colors } from '../../constants';

const PayRoll = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const { t } = useTranslation();
  const colors = useColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader
        label={t('payroll')}
        leftIcon={icons.menu}
        leftPress={() => {
          navigation.openDrawer();
        }}
      />

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
