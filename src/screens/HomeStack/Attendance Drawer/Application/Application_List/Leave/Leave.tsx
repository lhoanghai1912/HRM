import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import CustomHeader from '../../../../../../components/CustomHeader';
import icons from '../../../../../../assets/icons';
import { useTranslation } from 'react-i18next';

export default function Leave({ route }) {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const { label, status } = route.params;
  const [mode, setMode] = React.useState(route.params.status);
  console.log('route', route.params);
  console.log('Leave Screen Label:', label);
  console.log('Leave Screen Status:', status);
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
        {t('label.hrm_application_leave')} {status}
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
