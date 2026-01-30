import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Platform } from 'react-native';
import images from '../../assets/images';
import { ms, spacing } from '../../utils/spacing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppStyles from '../../components/AppStyle';
import { useTranslation } from 'react-i18next';
import AppInput from '../../components/AppInput';
import useColors from '../../hooks/useColors';
import icons from '../../assets/icons';
import { border, fonts } from '../../utils/fontSize';
import AppButton from '../../components/AppButton';
import { navigate } from '../../navigation/RootNavigator';
import { Screen_Name } from '../../navigation/ScreenName';
import Toast from 'react-native-toast-message';
import { useAppDispatch } from '../../store/hooks';
import { loginThunk } from '../../store/slices/auth/authThunks';
import { fetchProfileThunk } from '../../store/slices/user/userThunks';
import i18n from '../../language';
import LanguageModal from '../../components/modal/ModalLanguage';
import { languages } from '../../utils/language';
// import { login, loginFirebase } from '../../services/auth';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import auth from '@react-native-firebase/auth';

const LoginScreen = () => {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [username, setUserName] = useState('admin');
  const [password, setPassword] = useState('1234@Abcd');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalLanguage, setModalLanguage] = useState(false);
  // const { userData } = useSelector((state: any) => state.user);
  // const [loginText, setLoginText] = useState('');
  const handleLogin = async () => {
    try {
      setLoading(true);

      // Gọi loginThunk để xử lý đăng nhập
      const resultAction = await dispatch(loginThunk({ username, password }));

      if (loginThunk.fulfilled.match(resultAction)) {
        // Đăng nhập thành công
        Toast.show({
          type: 'success',
          text2: t('message.login_success') || 'Đăng nhập thành công',
        });

        // Lấy thông tin user profile
        try {
          await dispatch(fetchProfileThunk());
        } catch (err) {
          console.log('Error fetching user profile:', err);
        }

        // AppNavigator sẽ tự động điều hướng dựa vào token trong store
      } else {
        // Đăng nhập thất bại
        const errorMessage = resultAction.payload || 'Đăng nhập thất bại';
        Toast.show({
          type: 'error',
          text2: errorMessage as string,
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text2: error?.message || 'Đã xảy ra lỗi',
      });
    } finally {
      setLoading(false);
    }
  };
  // console.log('userdata', userData);

  const handleGoogleLogin = async () => {};

  const handleFacebookLogin = async () => {
    try {
      Toast.show({
        type: 'info',
        text2: `${t('message.comming_soon')}`,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text2: 'Facebook login failed',
      });
    }
  };

  const handleChangeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setModalLanguage(false);
  };
  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Image
          source={images.company_logo}
          style={{
            resizeMode: 'contain',
            width: ms(250),
            height: ms(100),
            marginBottom: spacing.small,
          }}
        />

        <Text style={AppStyles.text}>{t('message.welcome')}</Text>
      </View>

      <View style={styles.body}>
        <Text style={AppStyles.title}>{t('button.login')}</Text>
        <View>
          {/* <AppInput
            leftIcon={icons.company}
            value={company}
            placeholder={t('label.company')}
            onChangeText={setCompany}
            style={{ fontSize: fonts.normal }}
          /> */}
          <AppInput
            leftIcon={icons.mail}
            value={username}
            placeholder={t('label.username')}
            onChangeText={setUserName}
            style={{ fontSize: fonts.normal }}
          />
          <AppInput
            leftIcon={icons.password}
            placeholder={t('label.password')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{ fontSize: fonts.normal }}
          />
        </View>
        <TouchableOpacity onPress={() => navigate(Screen_Name.ForgotPassword)}>
          <Text
            style={[
              AppStyles.text,
              {
                textAlign: 'right',
                color: colors.blue,
                textDecorationLine: 'underline',
                marginBottom: spacing.medium,
              },
            ]}
          >
            {t('button.forgot_pw')}
          </Text>
        </TouchableOpacity>
        <AppButton
          title={t('button.login')}
          onPress={() => handleLogin()}
          textStyle={{ fontSize: fonts.large }}
          customStyle={{ marginBottom: spacing.medium }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flex: 1,
            marginBottom: spacing.medium,
          }}
        >
          <View style={[AppStyles.line, { width: '35%', flex: 1 }]} />
          <Text style={[AppStyles.text, { marginHorizontal: spacing.small }]}>
            {t('message.login')}
          </Text>
          <View style={[AppStyles.line, { width: '35%', flex: 1 }]} />
        </View>
        {/* <Text style={[AppStyles.text, { backgroundColor: 'red' }]}>
          {' '}
          {loginText}
        </Text> */}
        <View style={styles.iconGroup}>
          {/* Facebook button: luôn hiển thị trên Android/iOS */}
          <TouchableOpacity
            style={{
              padding: spacing.small,
              borderWidth: 1,
              borderColor: colors.gray,
              borderRadius: border.radiusCircle,
              marginRight: spacing.medium,
            }}
            onPress={() =>
              // Toast.show({
              //   type: 'info',
              //   text2: `${t('message.comming_soon')}`,
              // })
              handleFacebookLogin()
            }
          >
            <Image
              source={icons.facebook}
              style={[AppStyles.icon, { tintColor: colors.text }]}
            />
          </TouchableOpacity>
          {/* Google button: luôn hiển thị trên Android/iOS */}
          <TouchableOpacity
            style={{
              padding: spacing.small,
              borderWidth: 1,
              borderColor: colors.gray,
              borderRadius: border.radiusCircle,
              marginRight: spacing.medium,
            }}
            onPress={() => handleGoogleLogin()}
          >
            <Image
              source={icons.google}
              style={[AppStyles.icon, { tintColor: colors.text }]}
            />
          </TouchableOpacity>
          {/* Apple button: chỉ hiển thị trên iOS */}
          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={{
                padding: spacing.small,
                borderWidth: 1,
                borderColor: colors.gray,
                borderRadius: border.radiusCircle,
              }}
              onPress={() =>
                Toast.show({
                  type: 'info',
                  text2: `${t('message.comming_soon')}`,
                })
              }
            >
              <Image
                source={icons.apple}
                style={[AppStyles.icon, { tintColor: colors.text }]}
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.notHave_account}>
          <Text style={AppStyles.text}>{t('message.nothave_account')}</Text>
          <TouchableOpacity
            onPress={() => {
              navigate(Screen_Name.Register);
            }}
          >
            <Text
              style={[
                AppStyles.text,
                { color: colors.blue, marginLeft: spacing.small },
              ]}
            >
              {t('button.register')}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            AppStyles.line,
            { width: '60%', alignSelf: 'center', marginBottom: spacing.medium },
          ]}
        />
        {/* <TouchableOpacity
          onPress={() => navigate(Screen_Name.BottomTab_Navigator)}
        >
          <Text
            style={[
              AppStyles.text,
              { alignSelf: 'center', color: colors.blue },
            ]}
          >
            {t('message.guest')}
          </Text>
        </TouchableOpacity> */}
        <View>
          <TouchableOpacity
            style={[styles.language, { borderBottomColor: colors.underline }]}
            onPress={() => setModalLanguage(true)}
          >
            <View>
              {/* <Text style={AppStyles.text}>{t('label.language')}</Text> */}
              <Text style={AppStyles.text}>{t('label.language')}</Text>
            </View>
            <View>
              <Image
                source={icons.down}
                style={[AppStyles.icon, { tintColor: colors.text }]}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {loading && (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <ActivityIndicator size="large" color="#E53935" />
        </View>
      )}
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
  container: {
    flex: 1,
  },
  header: { alignItems: 'center', marginBottom: spacing.xlarge },
  body: { paddingHorizontal: spacing.medium },
  iconGroup: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: spacing.medium,
  },
  notHave_account: {
    flexDirection: 'row',
    marginBottom: spacing.medium,
    alignSelf: 'center',
  },
  language: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.small,
    paddingBottom: spacing.small,
    justifyContent: 'center',
  },
});

export default LoginScreen;
