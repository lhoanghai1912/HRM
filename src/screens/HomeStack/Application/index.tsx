import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import CustomHeader from '../../../navigation/CustomHeader';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import icons from '../../../assets/icons';
import AppStyles from '../../../components/AppStyle';
import { ms, spacing } from '../../../utils/spacing';
import { form_application, form_itemStack } from '../../../utils/form';
import { navigate } from '../../../navigation/RootNavigator';
import { colors, darken } from '../../../utils/color';
import { useTranslation } from 'react-i18next';

const Application = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <CustomHeader
        label="Application"
        Home={false}
        rightIcon={icons.menu}
        rightPress={() => {
          navigation.openDrawer();
        }}
      />
      <Text style={AppStyles.title}>Application Management</Text>
      <ScrollView>
        <View style={styles.grid}>
          {form_application(t).map(item => (
            <TouchableOpacity
              key={item.id}
              style={[styles.item, { backgroundColor: colors.white }]}
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  grid: {
    paddingHorizontal: spacing.large,
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
    borderRadius: 20,
  },
});

export default Application;
