import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TimeSheet = () => {
  return (
    <View style={styles.container}>
      <Text>TimeSheet</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});

export default TimeSheet;
