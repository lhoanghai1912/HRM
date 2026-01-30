import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ms, spacing } from '../../utils/spacing';
import { fonts, weight } from '../../utils/fontSize';
import NavBar from '../../components/Navbar';
import { useColors } from '../../hooks/useColors';

const Notifications = ({ navigation }) => {
  const { t } = useTranslation();
  const colors = useColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
    fontWeight: weight.bold,
    color: colors.black,
  },
});
