import {
  Image,
  ImageRequireSource,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../utils/color';
import { spacing } from '../utils/spacing';
import icons from '../assets/icons';
import AppStyles from './AppStyle';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { navigate } from '../navigation/RootNavigator';
import { Screen_Name } from '../navigation/ScreenName';
import { form_user } from '../utils/form';
import { act, use, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageModal from './modal/ModalLanguage';
import i18n from '../language';
import { languages } from '../utils/language';
import User from '../screens/HomeStack/User';
import { useNavigation } from '@react-navigation/native';

interface CustomHeaderProps {
  Home?: boolean;
  label?: string;
  leftIcon?: ImageRequireSource;
  leftPress?: () => void;
  leftIcon1?: ImageRequireSource;
  leftPress1?: () => void;
  rightIcon?: ImageRequireSource;
  rightPress?: () => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  Home,
  label,
  leftIcon,
  leftPress,
  leftIcon1,
  leftPress1,
  rightIcon,
  rightPress,
}) => {
  const { t } = useTranslation();
  const [showUser, setShowUser] = useState(false);
  const [modalLanguage, setModalLanguage] = useState(false);
  const dispatch = useDispatch();
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
        {leftIcon && (
          <TouchableOpacity
            onPress={() => {
              leftPress();
            }}
            style={{ marginRight: spacing.medium }}
          >
            <Image
              source={leftIcon ? leftIcon : icons.back}
              style={[AppStyles.icon]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}

        <Text style={[AppStyles.label, { textAlign: 'left' }]}>{label}</Text>
      </View>
      <View style={[styles.headerItem, { width: '5%' }]}></View>
      <View
        style={[
          styles.headerItem,
          {
            width: '20%',
            justifyContent: rightIcon ? 'space-between' : 'flex-end',
          },
        ]}
      >
        {rightIcon && (
          <TouchableOpacity onPress={() => rightPress()}>
            <Image
              source={rightIcon}
              style={[AppStyles.icon]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
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
        items={form_user(t, setModalLanguage, dispatch)}
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
