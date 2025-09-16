import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AppButton from '../../components/AppButton';
import { logout } from '../../store/reducers/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { spacing } from '../../utils/spacing';
import { colors } from '../../utils/color';
import icons from '../../assets/icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppStyles from '../../components/AppStyle';
import CustomHeader from '../../components/CustomHeader';

const Home = () => {
  const dispatch = useDispatch();
  const inset = useSafeAreaInsets();
  const { userData } = useSelector((state: any) => state.user);
  const handleLogout = () => {
    // Logic to handle logout, e.g., clearing token from Redux

    dispatch(logout());
    console.log('Logout pressed');
  };
  console.log('userData', userData);

  return (
    <View style={styles.container}>
      <CustomHeader />
      <View style={styles.body}>
        <AppButton title="Logout" onPress={() => handleLogout()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  body: {
    flex: 1,
    justifyContent: 'center',
    margin: spacing.small,
    backgroundColor: colors.white,
  },
  text: {
    fontSize: 24,
  },
});

export default Home;
