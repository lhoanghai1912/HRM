import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../utils/color';
import { spacing } from '../utils/spacing';
import icons from '../assets/icons';
import AppStyles from '../components/AppStyle';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { navigate } from './RootNavigator';
import { Screen_Name } from './ScreenName';
import { form_user } from '../utils/form';
import { act, use, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageModal from '../components/modal/ModalLanguage';
import i18n from '../language';
import { languages } from '../utils/language';
import User from '../screens/HomeStack/User';

const CustomHeader = () => {
  const { t } = useTranslation();
  const [showUser, setShowUser] = useState(false);
  const [modalLanguage, setModalLanguage] = useState(false);

  // const navigation = useNavigation();
  const inset = useSafeAreaInsets();
  const { userData } = useSelector((state: any) => state.user);

  const handleChangeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setModalLanguage(false);
  };
  return (
    <View style={[styles.header, { paddingTop: inset.top }]}>
      <View style={[styles.headerItem, { width: '75%' }]}>
        <TouchableOpacity
          onPress={() => navigate(Screen_Name.Menu)}
          style={{ marginRight: spacing.medium }}
        >
          <Image
            source={icons.menu}
            style={AppStyles.icon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={[AppStyles.label, { textAlign: 'center' }]}>
          {userData?.userName}
        </Text>
      </View>
      <View style={[styles.headerItem, { width: '5%' }]}></View>
      <View
        style={[
          styles.headerItem,
          { width: '20%', justifyContent: 'space-between' },
        ]}
      >
        <TouchableOpacity onPress={() => navigate(Screen_Name.Notification)}>
          <Image
            source={icons.noti}
            style={AppStyles.icon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowUser(true)}>
          <Image
            source={icons.username}
            style={AppStyles.icon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <User
        visible={showUser}
        onClose={() => setShowUser(false)}
        items={form_user(t, setModalLanguage)}
        title="Chọn nhanh"
        onSelect={(item: any) => {
          if (item.action) {
            item.action();
          }
          setShowUser(false);
        }}
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
const styles = StyleSheet.create({
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
});
export default CustomHeader;
