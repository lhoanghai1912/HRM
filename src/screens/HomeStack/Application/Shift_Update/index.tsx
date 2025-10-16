import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomHeader from '../../../../navigation/CustomHeader';
import icons from '../../../../assets/icons';

const Shift_Update = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <CustomHeader
        label="Application"
        Home={false}
        rightIcon={icons.back}
        rightPress={() => {
          navigation.goBack();
        }}
      />
      <Text>Shift_Update</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});

export default Shift_Update;
