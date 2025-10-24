import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AddEmployee = () => {
  return (
    <View style={styles.container}>
      <Text>AddEmployee</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});

export default AddEmployee;
