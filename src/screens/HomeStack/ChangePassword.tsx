import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import NavBar from '../../components/Navbar';
import SetPassword from '../../components/SetPassword';
import AppInput from '../../components/AppInput';
import { useTranslation } from 'react-i18next';
import icons from '../../assets/icons';
import { spacing } from '../../utils/spacing';
import { colors } from '../../utils/color';
import AppButton from '../../components/AppButton';
import { border, fonts } from '../../utils/fontSize';
import { password_Change } from '../../services/user';
import Toast from 'react-native-toast-message';
import { navigate } from '../../navigation/RootNavigator';
import { Screen_Name } from '../../navigation/ScreenName';
import CustomHeader from '../../components/CustomHeader';

const ChangePassword = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
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
  const { t } = useTranslation();

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const res = await password_Change(currentPassword, password);
      console.log(res);
      Toast.show({ type: 'success', text2: t('message.update_success') });
      navigate(Screen_Name.BottomTab_Navigator, { screen: Screen_Name.Home });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        label={t('button.change_pw')}
        leftIcon={icons.back}
        leftPress={() => navigation.goBack()}
      />
      <View style={styles.body}>
        {/* <Text
          style={{
            textAlign: 'center',
            fontSize: fonts.xlarge,
            marginBottom: spacing.small,
          }}
        >
          {t('button.change_pw')}
        </Text> */}

        <View>
          <AppInput
            label={t('label.password_current')}
            leftIcon={icons.password}
            placeholder={t('label.password_current')}
            onChangeText={setCurrentPassword}
            secureTextEntry={true}
            value={currentPassword}
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
        <Text style={{ textAlign: 'center', marginBottom: spacing.medium }}>
          {t('message.valid')}
        </Text>
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
        <View
          style={{
            marginBottom: spacing.xxxlarge,
            alignItems: 'center',
          }}
        >
          <AppButton
            customStyle={{
              backgroundColor: colors.primary,
              width: '60%',
            }}
            // textStyle={{ color: colors.red }}
            title={t('button.confirm')}
            onPress={() => handleConfirm()}
            disabled={!isValid}
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
  },
  body: {
    marginHorizontal: spacing.medium,
    borderRadius: border.radiusMedium,
    padding: spacing.medium,
    // backgroundColor: colors.red,
  },
});

export default ChangePassword;
