import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import icons from '../../assets/icons';
import useColors from '../../hooks/useColors';
import { spacing } from '../../utils/spacing';
import images from '../../assets/images';
import AppStyles from '../../components/AppStyle';
import { border } from '../../utils/fontSize';
import { Screen_Name } from '../../navigation/ScreenName';
import { navigate } from '../../navigation/RootNavigator';
import ThemeSelector from '../../components/modal/ThemeSelector';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

const Profile = ({ route, navigation }) => {
  const colors = useColors();
  const [showThemeModal, setShowThemeModal] = useState(false);
  const { theme } = useTheme();
  const { t } = useTranslation();
  const fullName = 'Phạm Quỳnh Anh';
  const jobPosition = `Nhân viên kinh doanh`;
  const orgStruc = `Trung tâm R&D`;
  const employeeId = 'NV001';
  const userName = 'nguyenvana@gmail.com';
  const status = 'Đang hoạt động';
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader
        label="Thông tin tài khoản"
        leftIcon={icons.back}
        leftPress={() => navigation.goBack()}
      />
      <View
        style={[
          styles.section,
          styles.row,
          {
            backgroundColor: colors.blue,
            justifyContent: undefined,
            marginBottom: 0,
          },
        ]}
      >
        <Image
          source={images.avt}
          style={[AppStyles.avartar, { marginRight: spacing.medium }]}
        />
        <View>
          <Text
            style={[AppStyles.label, { color: colors.white }]}
          >{`Xin chào, ${fullName || 'abc'}`}</Text>
          <Text
            style={[{ color: colors.white }]}
          >{`${jobPosition} - ${orgStruc}`}</Text>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <View style={styles.row}>
          <View style={{ width: '60%' }}>
            <Text style={AppStyles.label}>Mã nhân viên</Text>
            <Text style={AppStyles.text}>{employeeId}</Text>
          </View>
          <View style={{ width: '40%' }}>
            <Text style={AppStyles.label}>Trạng thái</Text>
            <Text
              style={[
                AppStyles.text,
                {
                  backgroundColor: colors.green,
                  paddingHorizontal: spacing.small,
                  borderRadius: border.radiusSmall,
                  color: colors.white,
                },
              ]}
            >
              {status}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={{ width: '60%' }}>
            <Text style={AppStyles.label}>Tên đăng nhập</Text>
            <Text style={AppStyles.text}>{userName}</Text>
          </View>
          <View style={{ width: '40%' }}>
            <Text style={AppStyles.label}>Mật khẩu</Text>
            <TouchableOpacity
              onPress={() => navigate(Screen_Name.ChangePassword)}
            >
              <Text style={[AppStyles.text, AppStyles.linkText]}>
                Đổi mật khẩu
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <View style={{ width: '60%' }}>
            <Text style={AppStyles.label}>
              {t('theme.theme') || 'Giao diện'}
            </Text>
            <Text style={AppStyles.text}>
              {theme === 'light'
                ? t('theme.light') || 'Sáng'
                : theme === 'dark'
                ? t('theme.dark') || 'Tối'
                : t('theme.system') || 'Theo hệ thống'}
            </Text>
          </View>
          <View style={{ width: '40%' }}>
            <TouchableOpacity onPress={() => setShowThemeModal(true)}>
              <Text style={[AppStyles.text, AppStyles.linkText]}>
                {t('button.change') || 'Thay đổi'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ThemeSelector
        visible={showThemeModal}
        onClose={() => setShowThemeModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: spacing.medium,
    marginHorizontal: spacing.medium,
    padding: spacing.medium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: border.radiusMedium,
    justifyContent: 'space-between',
    marginBottom: spacing.medium,
  },
});

export default Profile;
