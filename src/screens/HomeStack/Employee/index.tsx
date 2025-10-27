import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Employee = () => {
  return (
    <View style={styles.container}>
      <Text>Employee</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});

export default Employee;
