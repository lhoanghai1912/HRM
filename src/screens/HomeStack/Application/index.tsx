import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Application = () => {
  return (
    <View style={styles.container}>
      <Text>Application</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});

export default Application;
