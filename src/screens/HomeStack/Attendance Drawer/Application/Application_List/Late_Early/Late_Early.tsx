import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import CustomHeader from '../../../../../../components/CustomHeader';
import icons from '../../../../../../assets/icons';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

export default function Late_Early({ route }) {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { label, status } = route.params;
  const [mode, setMode] = React.useState(route.params.status);

  console.log('Late_Early Screen Label:', label);
  console.log('Late_Early Screen Status:', status);
  return (
    <View style={styles.container}>
      <CustomHeader
        label={label}
        leftIcon={icons.menu}
        leftPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        rightIcon={icons.add}
        rightPress={() => {
          setMode('create');
        }}
      />
      <Text>
        {t('label.hrm_application_late_early')} {mode}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
