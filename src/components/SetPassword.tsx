import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import NavBar from './Navbar';
import { ms, spacing } from '../utils/spacing';
import images from '../assets/images';
import AppInput from './AppInput';
import icons from '../assets/icons';
import { colors } from '../utils/color';
import AppButton from './AppButton';
import { t } from 'i18next';
import AppStyles from './AppStyle';
import { forgot_pw, login } from '../services/auth';
import { setToken } from '../store/reducers/userSlice';
import { navigate } from '../navigation/RootNavigator';
import { Screen_Name } from '../navigation/ScreenName';

interface Props {
  navigation: any;
  route: any;
}
const SetPassword: React.FC<Props> = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { verificationToken } = useSelector((state: any) => state.user);

  const [password, SetPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const isMatch = password && confirmPassword && password === confirmPassword;
  const isValid =
    hasMinLength && hasUpperCase && hasNumber && hasSpecialChar && isMatch;

  const handleConfirm = async () => {
    try {
      setLoading(true);
      if (route.params?.source === 'forgot') {
        console.log('vao day');

        const response = await forgot_pw(
          route.params?.email,
          route.params?.otp,
          password,
        );
        console.log(response);
        Toast.show({ type: 'success', text2: t('message.update_success') });
        navigate(Screen_Name.Login);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={[styles.container]}>
      <NavBar title={'Tạo mật khẩu'} onPress={() => navigation.goBack()} />
      <View style={styles.body}>
        <View style={{ marginBottom: spacing.large }}>
          <Image
            source={images.company_logo}
            style={{
              width: ms(250),
              height: ms(100),
              resizeMode: 'contain',
              alignSelf: 'center',
            }}
          />
        </View>

        <View>
          <AppInput
            label={t('label.password')}
            leftIcon={icons.password}
            placeholder={t('label.password')}
            onChangeText={SetPassword}
            secureTextEntry={true}
            value={password}
          />
        </View>
        <View>
          <AppInput
            label={t('label.confirm_password')}
            leftIcon={icons.password}
            placeholder={t('label.confirm_password')}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
            value={confirmPassword}
          />
        </View>

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
              {t('message.valid_password_length')}
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
              {t('message.valid_password_uppercase')}
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
              {t('message.valid_password_number')}
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
              {t('message.valid_password_special')}
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
              {t('message.valid_password_match')}
            </Text>
          </View>
        </View>
        {/* <View
        style={{
          borderWidth: 0.5,
          marginBottom: spacing.medium,
        }}
      /> */}
        <View style={{ marginBottom: spacing.xlarge }}>
          <AppButton
            title={t('button.confirm')}
            onPress={() => handleConfirm()}
            disabled={!isValid}
          />
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  body: {
    paddingHorizontal: spacing.medium,
  },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0,
    borderColor: '#ccc',
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: '#F4F5F5',
    paddingHorizontal: spacing.medium,
    marginBottom: spacing.medium,
  },
});

export default SetPassword;
