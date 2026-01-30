import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useAppSelector } from '../../store/hooks';
import { ms, spacing } from '../../utils/spacing';
import useColors, { darken } from '../../hooks/useColors';
import icons from '../../assets/icons';
import AppStyles from '../../components/AppStyle';
import CustomHeader from '../../components/CustomHeader';
import { form_itemStack } from '../../utils/form';
import { useTranslation } from 'react-i18next';
import { navigate } from '../../navigation/RootNavigator';
import { border } from '../../utils/fontSize';

const Home = () => {
  const colors = useColors();
  const user = useAppSelector(state => state.auth.user);
  const profile = useAppSelector(state => state.userProfile.profile);
  const { t } = useTranslation();
  console.log('user', user);
  console.log('profile', profile);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader
        label={profile?.fullName || user?.fullName || user?.username}
        Home={true}
        profileIcon={icons.settings}
      />
      <View style={[styles.bodyItem, { backgroundColor: colors.surface }]}>
        <Text style={[AppStyles.label, { color: colors.text }]}>HRM</Text>
        <View style={styles.grid}>
          {form_itemStack(t).map(item => (
            <TouchableOpacity
              key={item.id}
              style={[styles.item, { backgroundColor: item.bg }]}
              onPress={() => navigate(item.screen)}
            >
              <Image
                source={item.icon}
                style={[styles.icon, { tintColor: colors.text }]}
                resizeMode="contain"
              />
              <Text
                style={[
                  AppStyles.text,
                  { textAlign: 'center', color: colors.text },
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* <TouchableOpacity onPress={() => navigate(Screen_Name.Drawer_Navigator, { screen: Screen_Name.Attendance_Drawer })}>
          <Image source={icons.apple} style={AppStyles.icon}></Image>
        </TouchableOpacity> */}
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
  },
  text: {
    fontSize: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.medium,
  },
  item: {
    width: '45%', // mỗi hàng 3 cột
    aspectRatio: 1, // vuông
    borderRadius: 12,
    // margin: '1.5%',
    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: spacing.large,
  },
  icon: {
    width: ms(24),
    height: ms(24),
    marginBottom: spacing.small,
  },
  bodyItem: {
    marginHorizontal: ms(spacing.medium),
    padding: ms(spacing.medium),
    marginBottom: spacing.medium,
    borderRadius: border.radiusExtraLarge,
  },
});

export default Home;
