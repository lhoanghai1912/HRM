import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ListApplication = () => {
  return (
    <View style={styles.container}>
      <Text>ListApplication</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});

export default ListApplication;
