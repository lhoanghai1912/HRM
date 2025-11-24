import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomHeader from '../../../components/CustomHeader';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import icons from '../../../assets/icons';

const Attendance = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <View style={styles.container}>
      <CustomHeader
        leftIcon={icons.menu}
        leftPress={() => navigation.openDrawer()}
        label="Attendance"
        Home={false}
        rightPress={() => {
          navigation.openDrawer();
        }}
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
