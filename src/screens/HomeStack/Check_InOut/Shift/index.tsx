import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomHeader from '../../../../navigation/CustomHeader';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

const Details_Shift = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <View style={styles.container}>
      <CustomHeader
        label="Shift Details"
        Home={false}
        onMenuPress={() => {
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

export default Details_Shift;
