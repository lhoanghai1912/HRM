import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Pressable,
  Modal,
  Linking,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../../utils/color';
import { ms, spacing } from '../../utils/spacing';
import { Fonts } from '../../utils/fontSize';
import AppStyles from '../../components/AppStyle';
import NavBar from '../../components/Navbar';
import icons from '../../assets/icons';
import i18n from '../../language';
import { languages } from '../../utils/language';
import LanguageModal from '../../components/modal/ModalLanguage';
import { link } from '../../utils/constants';
import AppButton from '../../components/AppButton';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/reducers/userSlice';
import { navigate } from '../../navigation/RootNavigator';
import { Screen_Name } from '../../navigation/ScreenName';

const Setting = ({ navigation }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [modalLanguage, setModalLanguage] = useState(false);
  const handleChangeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setModalLanguage(false);
  };
  const handleLogout = () => {
    // Logic to handle logout, e.g., clearing token from Redux

    dispatch(logout());
    console.log('Logout pressed');
  };
  return (
    <View style={styles.container}>
      <NavBar
        title={t('label.account_setting')}
        onPress={() => navigation.goBack()}
        textStyle={{ textAlign: 'auto' }}
      />

      <View
        style={{
          marginTop: spacing.medium,
          paddingHorizontal: 20,
          marginBottom: spacing.medium,
        }}
      >
        <Text
          style={[
            AppStyles.label,
            { fontWeight: '500', marginBottom: spacing.small },
          ]}
        >
          {t('label.account_setting')}
        </Text>
        <View>
          <TouchableOpacity
            style={styles.link}
            onPress={() => Linking.openURL(link.company)}
          >
            <View>
              <Text style={AppStyles.text}>{t('label.about_us')}</Text>
            </View>
            <View>
              <Image source={icons.arrow} style={AppStyles.icon} />
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            style={styles.link}
            onPress={() => Linking.openURL(link.terms)}
          >
            <View>
              <Text style={AppStyles.text}>{t('label.term_conditions')}</Text>
            </View>
            <View>
              <Image source={icons.arrow} style={AppStyles.icon} />
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            style={styles.link}
            onPress={() => Linking.openURL(link.privacy)}
          >
            <View>
              <Text style={AppStyles.text}>{t('label.privacy_policy')}</Text>
            </View>
            <View>
              <Image source={icons.arrow} style={AppStyles.icon} />
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            style={styles.link}
            onPress={() => setModalLanguage(true)}
          >
            <Text style={AppStyles.text}>{t(`button.choose_language`)}</Text>
            <View>
              <Text style={AppStyles.text}>{t('label.language')}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          marginTop: spacing.medium,
          paddingHorizontal: 20,
          marginBottom: spacing.medium,
        }}
      >
        <Text
          style={[
            AppStyles.label,
            { fontWeight: '500', marginBottom: spacing.small },
          ]}
        >
          {t('label.hr')}
        </Text>
        <View>
          <TouchableOpacity
            style={styles.link}
            onPress={() => navigate(Screen_Name.Employee)}
          >
            <View>
              <Text style={AppStyles.text}>{t('label.hr_add_employee')}</Text>
            </View>
            <View>
              <Image source={icons.arrow} style={AppStyles.icon} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <AppButton
        title="Logout"
        onPress={() => handleLogout()}
        customStyle={{ marginHorizontal: spacing.medium }}
      />

      <LanguageModal
        visible={modalLanguage}
        onClose={() => setModalLanguage(false)}
        onSelectLanguage={handleChangeLanguage}
        selectedLanguage={i18n.language}
        languages={languages}
      />
    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    marginHorizontal: spacing.medium,
  },
  bodyItem: {
    marginHorizontal: spacing.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: Fonts.normal,
    fontWeight: 'bold',
    color: colors.black,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.small,
    paddingBottom: spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: colors.Gray,
    justifyContent: 'space-between',
  },
});
