import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AppButton from '../../components/AppButton';
import { logout } from '../../store/reducers/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ms, spacing } from '../../utils/spacing';
import { colors, darken } from '../../utils/color';
import icons from '../../assets/icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppStyles from '../../components/AppStyle';
import CustomHeader from '../../components/CustomHeader';
import { form_itemHRM, form_itemStack } from '../../utils/form';
import { useTranslation } from 'react-i18next';
import { navigate } from '../../navigation/RootNavigator';
import { Screen_Name } from '../../navigation/ScreenName';
import images from '../../assets/images';

const Home = () => {
  const { t } = useTranslation();
  const { userData } = useSelector((state: any) => state.user);

  console.log('userData', userData);

  return (
    <View style={styles.container}>
      <CustomHeader label={userData?.employee?.fullName} Home={true} />
      <View style={styles.bodyItem}>
        <Text style={AppStyles.label}>HRM</Text>
        <View style={styles.grid}>
          {form_itemStack(t).map(item => (
            <TouchableOpacity
              key={item.id}
              style={[styles.item, { backgroundColor: item.bg }]}
              onPress={() => item.screen && navigate(item.screen)}
            >
              <Image
                source={item.icon}
                style={styles.icon}
                resizeMode="contain"
                tintColor={darken(item.bg, 50)}
              />
              <Text style={[AppStyles.text, { textAlign: 'center' }]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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
    backgroundColor: colors.white,
    padding: ms(spacing.medium),
    marginBottom: spacing.medium,
    borderRadius: border.radiusExtraLarge,
  },
});

export default Home;
