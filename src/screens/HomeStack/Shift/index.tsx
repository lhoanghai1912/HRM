import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Shift = () => {
  return (
    <View style={styles.container}>
      <Text>Shift</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});

export default Shift;
