import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomHeader from '../../../../components/CustomHeader';
import icons from '../../../../assets/icons';
const Overtime = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <CustomHeader
        label="Application"
        Home={false}
        leftIcon={icons.back}
        leftPress={() => {
          navigation.goBack();
        }}
      />
      <Text>Overtime</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});

export default Overtime;
