import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React, { use } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QuickPin from '../../../QuickPin';
import { form_application } from '../../../../../utils/form';
import { useTranslation } from 'react-i18next';
import { navigate } from '../../../../../navigation/RootNavigator';

const CreateApplication = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [showQuick, setShowQuick] = React.useState(false);
  const { t } = useTranslation();
  return (
    <QuickPin
      visible={showQuick}
      onClose={() => setShowQuick(false)}
      items={form_application(t)}
      title="Chọn nhanh"
      onSelect={screen => {
        setShowQuick(false);
        navigate(screen); // 👈 chỉ navigate Drawer thôi
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});

export default CreateApplication;
