import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AppButton from '../../components/AppButton';
import { logout } from '../../store/reducers/userSlice';
import { useDispatch } from 'react-redux';
import { spacing } from '../../utils/spacing';
import { colors } from '../../utils/color';
import icons from '../../assets/icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppStyles from '../../components/AppStyle';

const HomeScreen: React.FC = () => {
  const dispatch = useDispatch();
  const inset = useSafeAreaInsets();
  const handleLogout = () => {
    // Logic to handle logout, e.g., clearing token from Redux

    dispatch(logout());
    console.log('Logout pressed');
  };
  return (
    <View style={styles.container}>
      <View style={[styles.header, { marginTop: inset.top }]}>
        <View style={[styles.headerItem, { width: '75%' }]}>
          <TouchableOpacity
            onPress={() => console.log('Menu pressed')}
            style={{ marginRight: spacing.medium }}
          >
            <Image
              source={icons.menu}
              style={AppStyles.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text
            style={[styles.text, { textAlign: 'center' }]}
          >{`User Name`}</Text>
        </View>
        <View style={[styles.headerItem, { width: '5%' }]}></View>
        <View
          style={[
            styles.headerItem,
            { width: '20%', justifyContent: 'space-between' },
          ]}
        >
          <TouchableOpacity
            onPress={() => console.log('Notifications pressed')}
          >
            <Image
              source={icons.noti}
              style={AppStyles.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Home pressed')}>
            <Image
              source={icons.home}
              style={AppStyles.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
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
  header: {
    width: '100%',
    backgroundColor: colors.white,
    marginBottom: spacing.medium,
    flexDirection: 'row',
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
  },
  headerItem: {
    flexDirection: 'row',
    alignItems: 'center',
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

export default HomeScreen;
