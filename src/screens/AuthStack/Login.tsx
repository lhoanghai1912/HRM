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
import { colors } from '../../utils/color';
import icons from '../../assets/icons';
import { fonts } from '../../utils/fontSize';
import AppButton from '../../components/AppButton';
import { navigate } from '../../navigation/RootNavigator';
import { Screen_Name } from '../../navigation/ScreenName';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import {
  setToken,
  setUserData,
  setUserId,
} from '../../store/reducers/userSlice';
import i18n from '../../language';
import LanguageModal from '../../components/modal/ModalLanguage';
import { login } from '../../services/auth';
import { languages } from '../../utils/language';
import { getMe } from '../../services/user';
// import { login, loginFirebase } from '../../services/auth';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import auth from '@react-native-firebase/auth';

const LoginScreen = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [username, setUserName] = useState('haihl01');
  const [password, setPassword] = useState('1234@Abcd');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalLanguage, setModalLanguage] = useState(false);
  const { userData } = useSelector((state: any) => state.user);
  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await login(username, password);
      console.log('login res', res);
      dispatch(setToken({ token: res.accessToken }));
      const user = await getMe();
      console.log('user getme', user);

      dispatch(setUserData({ userData: user }));

      Toast.show({
        type: 'success',
        text1: `${t('message.welcome')} `,
        text2: `${t('message.welcome_back')} ${res.profile.fullName}`,
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  console.log('userdata', userData);

  const handleGoogleLogin = async () => {
    // try {
    //   setLoading(true);
    //   await GoogleSignin.hasPlayServices();
    //   const userInfo = await GoogleSignin.signIn();
    //   const idToken = userInfo?.data?.idToken || '';
    //   const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    //   const userCredential = await auth().signInWithCredential(
    //     googleCredential,
    //   );
    //   const firebaseIdToken = await userCredential.user.getIdToken();
    //   console.log('firebaseIdToken', firebaseIdToken);
    //   const res = await loginFirebase(firebaseIdToken);
    //   dispatch(setToken({ token: res.token }));
    //   dispatch(setUserId({ userId: res.id }));
    //   console.log('token', res.token);
    //   navigate(Screen_Name.BottomTab_Navigator);
    //   console.log(userInfo);
    // } catch (error) {
    // } finally {
    //   setLoading(false);
    // }
  };

  const handleFacebookLogin = async () => {
    try {
      // const result = await LoginManager.logInWithPermissions([
      //   'public_profile',
      //   'email',
      // ]);
      // console.log('result', result);

      // if (result.isCancelled) return;

      // const data = await AccessToken.getCurrentAccessToken();
      // console.log('data', data);
      // if (!data) return;

      // const facebookCredential = auth.FacebookAuthProvider.credential(
      //   data.accessToken,
      // );
      // console.log('facebookCredential', facebookCredential);

      // const userCredential = await auth().signInWithCredential(
      //   facebookCredential,
      // );
      // console.log('facebook userCredential', userCredential);

      // const firebaseIdToken = await userCredential.user.getIdToken();

      // const res = await loginFirebase(firebaseIdToken);
      // console.log('facebook loginFirebase res', res);

      // dispatch(setToken({ token: res.token }));
      // navigate(Screen_Name.BottomTab_Navigator);
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
    <View style={styles.container}>
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
        <Image
          source={images.top_cv}
          style={{
            resizeMode: 'contain',
            width: ms(150),
            height: ms(70),
          }}
        />
        <Text style={AppStyles.text}>{t('message.welcome')}</Text>
      </View>

      <View style={styles.body}>
        <Text style={AppStyles.title}>{t('button.login')}</Text>
        <View>
          <AppInput
            leftIcon={icons.company}
            value={company}
            placeholder={t('label.company')}
            onChangeText={setCompany}
            style={{ fontSize: fonts.normal }}
          />
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
        <View style={styles.iconGroup}>
          {/* Facebook button: luôn hiển thị trên Android/iOS */}
          <TouchableOpacity
            style={{
              padding: spacing.small,
              borderWidth: 1,
              borderColor: colors.Gray,
              borderRadius: 50,
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
            <Image source={icons.facebook} style={[AppStyles.icon]} />
          </TouchableOpacity>
          {/* Google button: luôn hiển thị trên Android/iOS */}
          <TouchableOpacity
            style={{
              padding: spacing.small,
              borderWidth: 1,
              borderColor: colors.Gray,
              borderRadius: 50,
              marginRight: spacing.medium,
            }}
            onPress={() => handleGoogleLogin()}
          >
            <Image source={icons.google} style={[AppStyles.icon]} />
          </TouchableOpacity>
          {/* Apple button: chỉ hiển thị trên iOS */}
          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={{
                padding: spacing.small,
                borderWidth: 1,
                borderColor: colors.Gray,
                borderRadius: 50,
              }}
              onPress={() =>
                Toast.show({
                  type: 'info',
                  text2: `${t('message.comming_soon')}`,
                })
              }
            >
              <Image source={icons.apple} style={[AppStyles.icon]} />
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
            style={styles.language}
            onPress={() => setModalLanguage(true)}
          >
            <View>
              {/* <Text style={AppStyles.text}>{t('label.language')}</Text> */}
              <Text style={AppStyles.text}>{t('label.language')}</Text>
            </View>
            <View>
              <Image source={icons.down} style={AppStyles.icon} />
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
    backgroundColor: colors.white,
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
    borderBottomColor: colors.Gray,
    justifyContent: 'center',
  },
});

export default LoginScreen;
