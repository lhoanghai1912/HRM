import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomHeader from '../../../components/CustomHeader';
import icons from '../../../assets/icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

const Attendance = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <View style={styles.container}>
      <CustomHeader
        label="Đơn, chế độ "
        leftIcon={icons.menu}
        leftPress={() => navigation.openDrawer()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});

export default Attendance;
