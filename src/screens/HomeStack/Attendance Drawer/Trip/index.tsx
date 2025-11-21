import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomHeader from '../../../../components/CustomHeader';
import icons from '../../../../assets/icons';
const Business_Trip = ({ navigation }) => {
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
      <Text>Business_Trip</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});

export default Business_Trip;
