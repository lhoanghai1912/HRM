import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomHeader from '../../../../components/CustomHeader';
import icons from '../../../../assets/icons';
const Remote = ({ navigation }) => {
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
      <Text>Remote</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});

export default Remote;
