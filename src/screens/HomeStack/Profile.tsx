import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import icons from '../../assets/icons';
import { colors } from '../../utils/color';
import { spacing } from '../../utils/spacing';
import images from '../../assets/images';
import AppStyles from '../../components/AppStyle';
import { border } from '../../utils/fontSize';
import { Screen_Name } from '../../navigation/ScreenName';
import { navigate } from '../../navigation/RootNavigator';

const Profile = ({ route, navigation }) => {
  const fullName = 'Phạm Quỳnh Anh';
  const jobPosition = `Nhân viên kinh doanh`;
  const orgStruc = `Trung tâm R&D`;
  const employeeId = 'NV001';
  const userName = 'nguyenvana@gmail.com';
  const status = 'Đang hoạt động';
  return (
    <View style={styles.container}>
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

      <View style={[styles.section]}>
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
        <View style={styles.row}></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    marginTop: spacing.medium,
    marginHorizontal: spacing.medium,
    padding: spacing.medium,
    backgroundColor: colors.white,
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
