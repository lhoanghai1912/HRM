import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import images from '../../assets/images';
import { ms, spacing } from '../../utils/spacing';
import AppStyles from '../../components/AppStyle';
import { useTranslation } from 'react-i18next';
import AppInput from '../../components/AppInput';
import { colors } from '../../utils/color';
import AppButton from '../../components/AppButton';
import { navigate } from '../../navigation/RootNavigator';
import { Screen_Name } from '../../navigation/ScreenName';
import NavBar from '../../components/Navbar';
import ModalEnterOtp from '../../components/modal/ModalEnterOtp';
import { sendOtp } from '../../services/auth';
// import { login, loginFirebase } from '../../services/auth';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import auth from '@react-native-firebase/auth';

const ForgotPassword = ({ navigation }) => {
  const { t } = useTranslation();
  const [isEnterOtpModalVisible, setIsEnterOtpModalVisible] = useState(false);
  const [resetContact, setResetContact] = useState(''); // giữ email từ OTPModal
  const [resetOtp, setResetOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setContact] = useState('');

  const handleSendOtp = async () => {
    // Gửi OTP về số điện thoại/email
    try {
      setLoading(true);
      const response = await sendOtp(email);
      console.log(response);
      setLoading(false);
      setIsEnterOtpModalVisible(true);
      setResetContact(email);
    } catch (error) {
    } finally {
      setLoading(false);
    }
    // navigate(Screen_Name.SetPassword_Screen, {
    //   soure: 'forgot',
    //   email,
    //   otp: '123456',
    // });
  };

  return (
    <View style={styles.container}>
      <NavBar
        title={t('button.forgot_pw')}
        onPress={() => navigation.goBack()}
      />
      <View style={styles.body}>
        <View style={[{ paddingBottom: spacing.xlarge }]}>
          <Image
            source={images.company_logo}
            style={{
              width: ms(250),
              height: ms(100),
              resizeMode: 'contain',
              alignSelf: 'center',
            }}
          />

          <Text style={[AppStyles.text, { textAlign: 'center' }]}>
            {t('message.register')}
          </Text>
        </View>

        <View style={{}}>
          <AppInput
            label={t('label.mail')}
            placeholder={t('label.mail')}
            value={email}
            onChangeText={setContact}
          />
          <AppButton
            disabled={!email}
            title={t('button.confirm')}
            onPress={handleSendOtp}
          />

          <ModalEnterOtp
            visible={isEnterOtpModalVisible}
            onClose={() => setIsEnterOtpModalVisible(false)}
            email={resetContact}
            onSuccess={otp => {
              setResetOtp(otp);
              setIsEnterOtpModalVisible(false);
              navigate(Screen_Name.SetPassword_Screen, {
                source: 'forgot',
                email,
                otp,
              });
            }}
          />
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
  input: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    padding: spacing.medium,
    marginVertical: spacing.medium,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.large,
    alignItems: 'center',
    width: '80%',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: spacing.large,
  },
  otpInput: {
    width: 40,
    height: 50,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    marginHorizontal: 6,
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: colors.white,
  },
});
export default ForgotPassword;
