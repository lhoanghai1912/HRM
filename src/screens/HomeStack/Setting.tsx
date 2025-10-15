import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomHeader from '../../navigation/CustomHeader';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import icons from '../../assets/icons';

const Setting = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <View style={styles.container}>
      <CustomHeader
        label="Setting"
        Home={false}
        rightIcon={icons.menu}
        rightPress={() => {
          navigation.openDrawer();
        }}
      />
      <Text>Setting</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});

export default Setting;
