import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NavBar from '../../components/Navbar';

const ChangePassword = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <NavBar title="Change Password" onPress={() => navigation.goBack()} />
      <Text>ChangePassword</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});

export default ChangePassword;
