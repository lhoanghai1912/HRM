import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ms, spacing } from '../../utils/spacing';
import { fonts } from '../../utils/fontSize';
import AppStyles from '../../components/AppStyle';
import CustomHeader from '../../components/CustomHeader';
import { useColors } from '../../hooks/useColors';

const AddForm = () => {
  const { t } = useTranslation();
  const colors = useColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader />
      <Text
        style={[AppStyles.label, { color: colors.text }]}
      >{`Add form`}</Text>
      {/* ✨ Your content goes here */}
    </View>
  );
};

export default AddForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  body: {
    flex: 1,
    justifyContent: 'center',
    margin: spacing.small,
  },
  text: {
    fontSize: 24,
  },
});
