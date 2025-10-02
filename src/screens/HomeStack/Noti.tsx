import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../../utils/color';
import { ms, spacing } from '../../utils/spacing';
import { fonts } from '../../utils/fontSize';
import NavBar from '../../components/Navbar';

const Notifications = ({ navigation }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <NavBar
        title="Notifications"
        onPress={() => navigation.goBack()}
        textStyle={{ textAlign: 'auto' }}
      />
      {/* ✨ Your content goes here */}
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: fonts.normal,
    fontWeight: 'bold',
    color: colors.black,
  },
});
