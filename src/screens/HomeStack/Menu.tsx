import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, darken } from '../../utils/color';
import { ms, spacing } from '../../utils/spacing';
import { fonts } from '../../utils/fontSize';
import NavBar from '../../components/Navbar';
import { form_itemHRM } from '../../utils/form';
import AppStyles from '../../components/AppStyle';

const Menu = ({ navigation }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <NavBar
        title="Menu"
        onPress={() => navigation.goBack()}
        textStyle={{ textAlign: 'auto' }}
      />
      <View style={styles.bodyItem}>
        <Text style={AppStyles.label}>HRM</Text>
        <View style={styles.grid}>
          {form_itemHRM(t).map(item => (
            <TouchableOpacity
              key={item.id}
              style={[styles.item, { backgroundColor: item.bg }]}
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

export default Menu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: fonts.normal,
    fontWeight: 'bold',
    color: colors.black,
  },
  bodyItem: {
    marginHorizontal: ms(spacing.medium),
    backgroundColor: colors.white,
    padding: ms(spacing.medium),
    marginBottom: spacing.medium,
    borderRadius: 20,
  },
  section: {
    marginHorizontal: ms(spacing.medium),
    backgroundColor: colors.white,
    padding: spacing.medium,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: fonts.normal,
    fontWeight: 'bold',
    marginBottom: spacing.medium,
    color: colors.black,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.medium,
  },
  item: {
    width: '30%', // mỗi hàng 3 cột
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
  label: {
    fontSize: fonts.small,
    color: colors.black,
    textAlign: 'center',
  },
});
