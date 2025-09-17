import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import images from '../../assets/images';
import { ms, spacing } from '../../utils/spacing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppStyles from '../../components/AppStyle';
import { useTranslation } from 'react-i18next';
import AppInput from '../../components/AppInput';
import { colors } from '../../utils/color';
import icons from '../../assets/icons';
import { Fonts } from '../../utils/fontSize';
import AppButton from '../../components/AppButton';
import { navigate } from '../../navigation/RootNavigator';
import { Screen_Name } from '../../navigation/ScreenName';
import ModalEnterOtp from '../../components/modal/ModalEnterOtp';
import { register } from '../../services/auth';
// import { enterOtp, register } from '../../services/auth';

const RegisterScreen = () => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [modalEnterOtp, setModalEnterOtp] = useState(false);
  const [resetOtp, setResetOtp] = useState('');
  const [Loading, setLoading] = useState(false);

  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const isMatch = password && confirm && password === confirm;
  const isValid =
    hasMinLength && hasUpperCase && hasNumber && hasSpecialChar && isMatch;

  const handleregister = async () => {
    try {
      setLoading(true);
      const res = await register(username, mail, password);
      console.log(res);
      // setModalEnterOtp(true);
    } catch (error) {
      console.log('error:', error);
    } finally {
      setLoading(false);
    }
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
        <Text style={AppStyles.title}>{t('button.register')}</Text>
        <View>
          <AppInput
            leftIcon={icons.mail}
            value={mail}
            placeholder={t('label.mail')}
            onChangeText={setMail}
            style={{ fontSize: Fonts.normal }}
          />
          <AppInput
            leftIcon={icons.username}
            value={username}
            placeholder={t('label.username')}
            onChangeText={setUsername}
            style={{ fontSize: Fonts.normal }}
          />
          <AppInput
            leftIcon={icons.password}
            value={password}
            placeholder={t('label.password')}
            secureTextEntry
            onChangeText={setPassword}
            style={{ fontSize: Fonts.normal }}
          />
          <AppInput
            leftIcon={icons.password}
            value={confirm}
            placeholder={t('label.confirm_password')}
            secureTextEntry
            onChangeText={setConfirm}
            style={{ fontSize: Fonts.normal }}
          />
        </View>
        {password && (
          <View style={{ marginBottom: spacing.large }}>
            <View style={{ flexDirection: 'row' }}>
              <Image
                source={hasMinLength ? icons.valid : icons.dot}
                style={{ width: 20, height: 20 }}
              />
              <Text
                style={{
                  color: !password
                    ? colors.Gray
                    : hasMinLength
                    ? colors.Gray
                    : colors.red,
                }}
              >
                Mật khẩu tối thiểu 8 ký tự
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Image
                source={hasUpperCase ? icons.valid : icons.dot}
                style={{ width: 20, height: 20 }}
              />
              <Text
                style={{
                  color: !password
                    ? colors.Gray
                    : hasUpperCase
                    ? colors.Gray
                    : colors.red,
                }}
              >
                Chứa ít nhất 1 ký tự viết hoa
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Image
                source={hasNumber ? icons.valid : icons.dot}
                style={{ width: 20, height: 20 }}
              />
              <Text
                style={{
                  color: !password
                    ? colors.Gray
                    : hasNumber
                    ? colors.Gray
                    : colors.red,
                }}
              >
                Chứa ít nhất 1 ký tự số
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Image
                source={hasSpecialChar ? icons.valid : icons.dot}
                style={{ width: 20, height: 20 }}
              />
              <Text
                style={{
                  color: !password
                    ? colors.Gray
                    : hasSpecialChar
                    ? colors.Gray
                    : colors.red,
                }}
              >
                Chứa ít nhất 1 ký tự đặc biệt
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Image
                source={isMatch ? icons.valid : icons.dot}
                style={{ width: 20, height: 20 }}
              />
              <Text
                style={{
                  color: !password
                    ? colors.Gray
                    : isMatch
                    ? colors.Gray
                    : colors.red,
                }}
              >
                Mật khẩu và xác nhận mật khẩu trùng khớp
              </Text>
            </View>
          </View>
        )}

        <AppButton
          title={t('button.register')}
          disabled={!isValid}
          onPress={() => handleregister()}
          textStyle={{ fontSize: Fonts.large }}
          customStyle={{ marginBottom: spacing.medium }}
        />
        <View
          style={[
            AppStyles.line,
            { width: '60%', alignSelf: 'center', marginBottom: spacing.medium },
          ]}
        />
        <View style={styles.notHave_account}>
          <Text style={AppStyles.text}>{t('message.have_account')}</Text>
          <TouchableOpacity
            onPress={() => {
              navigate(Screen_Name.Login);
            }}
          >
            <Text
              style={[
                AppStyles.text,
                { color: colors.blue, marginLeft: spacing.small },
              ]}
            >
              {t('button.login')}
            </Text>
          </TouchableOpacity>
        </View>

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
      </View>
      <ModalEnterOtp
        visible={modalEnterOtp}
        onClose={() => setModalEnterOtp(false)}
        onSuccess={otp => {
          setResetOtp(otp);
          setModalEnterOtp(false);
          navigate(Screen_Name.SetPassword, { mail, otp });
        }}
        email={mail}
      />
      {Loading && (
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
});

export default RegisterScreen;
