import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import CustomHeader from '../../../../../../components/CustomHeader';
import icons from '../../../../../../assets/icons';
import { useTranslation } from 'react-i18next';

export default function Remote({ route }) {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const label = route.params?.label;
  return (
    <View style={styles.container}>
      <CustomHeader
        label={label}
        leftIcon={icons.menu}
        leftPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
