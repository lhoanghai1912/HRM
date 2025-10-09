import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import NavBar from '../../components/Navbar';
import { ms, spacing } from '../../utils/spacing';
import icons from '../../assets/icons';
import images from '../../assets/images';
import { fonts } from '../../utils/fontSize';
import { colors } from '../../utils/color';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import AppStyles from '../../components/AppStyle';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { employee_Get } from '../../services/hr';

const Profile = ({ navigation }) => {
  const { userData } = useSelector((state: any) => state.user);
  const [fixedHeader, setFixedHeader] = useState(false);
  const [avatarSectionHeight, setAvatarSectionHeight] = useState(0);
  const [employee, setEmployee] = useState<any>();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  // Fetch employee data
  useEffect(() => {
    if (userData?.employeeId) {
      fetchEmployee();
    }
  }, [userData?.employeeId]);

  const fetchEmployee = async () => {
    try {
      const res = await employee_Get(userData.employeeId);
      console.log('Fetched employee data:', res);

      setEmployee(res); // Cập nhật state employee
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };
  const toggleSection = (sectionKey: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey], // Đảo trạng thái mở/đóng
    }));
  };
  // Tạo danh sách sections từ dữ liệu employee
  const sections = useMemo(() => {
    if (!employee) return [];
    const { employeeDocument, employeeContact, employeeJobInfo, ...basicInfo } =
      employee;

    return [
      { sectionKey: 'Basic Information', data: basicInfo },
      { sectionKey: 'Document Information', data: employeeDocument },
      { sectionKey: 'Contact Information', data: employeeContact },
      { sectionKey: 'Job Information', data: employeeJobInfo },
    ];
  }, [employee]);

  // Hàm format giá trị hiển thị
  const formatValue = (value: any) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
      // Format ngày (YYYY-MM-DD)
      return value.slice(0, 10);
    }
    return String(value);
  };

  // Hàm render từng trường
  const renderField = (key: string, value: any) => {
    const label = t(`label.${key}`, { defaultValue: key })
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, c => c.toUpperCase());

    return (
      <View key={key} style={styles.fieldWrap}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <TextInput
          editable={false}
          value={formatValue(value)}
          style={styles.readonlyInput}
        />
      </View>
    );
  };

  // Hàm render từng section
  const renderSection = (sectionKey: string, data: Record<string, any>) => {
    if (!data || Object.keys(data).length === 0) return null;
    const isOpen = openSections[sectionKey] ?? true; // Mặc định mở nếu chưa có trong state

    return (
      <View key={sectionKey} style={styles.sectionCard}>
        <TouchableOpacity
          onPress={() => toggleSection(sectionKey)}
          style={styles.sectionHeader}
        >
          <Text style={styles.title}>{sectionKey}</Text>
          <Image
            source={isOpen ? icons.up : icons.down} // Hiển thị icon mũi tên
            style={styles.sectionToggleIcon}
          />
        </TouchableOpacity>
        {isOpen && (
          <View style={{ marginTop: spacing.medium }}>
            {Object.entries(data).map(([key, value]) =>
              renderField(key, value),
            )}
          </View>
        )}
      </View>
    );
  };

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    if (scrollY > ms(avatarSectionHeight - 32)) {
      setFixedHeader(true);
    } else if (scrollY <= ms(avatarSectionHeight)) {
      setFixedHeader(false);
    }
  };

  const handleAvatarLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setAvatarSectionHeight(height);
  };

  return (
    <View style={styles.container}>
      {fixedHeader ? (
        <>
          <View
            style={[
              // styles.fixedHeader,
              {
                paddingTop: ms(insets.top + spacing.small),
                paddingVertical: spacing.small,
                flexDirection: 'row',
                backgroundColor: colors.white,
                alignItems: 'center',
                maxHeight: ms(110),
              },
            ]}
          >
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={icons.back}
                style={{
                  width: ms(25),
                  height: ms(25),
                }}
              />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={images.avt_default}
                style={{
                  width: ms(70),
                  height: ms(70),
                  borderRadius: ms(50),
                  marginHorizontal: spacing.small,
                  marginRight: spacing.medium,
                }}
              />
              <View>
                <Text style={AppStyles.label}>
                  {userData.employee.fullName}
                </Text>
                <Text style={AppStyles.text}>
                  {userData.employee.employeeCode}
                </Text>
              </View>
            </View>
          </View>
        </>
      ) : (
        <>
          <NavBar
            title="Profile"
            onPress={() => navigation.goBack()}
            customStyle={{
              marginBottom: 0,
              display: fixedHeader ? 'none' : 'flex',
            }}
          />
        </>
      )}

      <ScrollView onScroll={handleScroll} scrollEventThrottle={16} style={{}}>
        <View style={{}}>
          {fixedHeader ? (
            <>
              <View
                style={[
                  // styles.fixedHeader,
                  {
                    paddingTop: ms(insets.top + spacing.small),
                    paddingVertical: spacing.small,
                    flexDirection: 'row',
                    alignItems: 'center',
                  },
                ]}
              >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Image
                    source={icons.back}
                    style={{
                      width: ms(25),
                      height: ms(25),
                      tintColor: colors.white,
                    }}
                  />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    source={
                      // userProfile?.avatarUrl
                      //   ? { uri: `${link.url}${userProfile?.avatarUrl}` }
                      //   : userData?.avatarUrl
                      //   ? { uri: userData?.avatarUrl }
                      //   :
                      images.avt_default
                    }
                    style={{
                      width: ms(70),
                      height: ms(70),
                      borderRadius: ms(50),
                      marginHorizontal: spacing.small,
                      marginRight: spacing.medium,
                    }}
                  />
                  <View>
                    <Text style={AppStyles.label}>{`userData?.fullName`}</Text>
                    <Text style={AppStyles.text}>{`userData?.position`}</Text>
                  </View>
                </View>
              </View>
            </>
          ) : (
            <>
              <View
                onLayout={handleAvatarLayout}
                style={{
                  flexDirection: 'row',
                  paddingTop: spacing.medium,
                  paddingHorizontal: spacing.medium,
                  marginBottom: spacing.medium,
                }}
              >
                <Image source={images.avt_default} style={styles.avatar} />
                <View style={{ justifyContent: 'space-around' }}>
                  <Text
                    style={{
                      fontSize: fonts.large,
                      marginLeft: spacing.medium,
                    }}
                  >
                    {userData.employee.fullName}
                  </Text>
                  <Text
                    style={{
                      fontSize: fonts.normal,
                      marginLeft: spacing.medium,
                    }}
                  >
                    {userData.employee.employeeCode}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>
        {sections.map(({ sectionKey, data }) =>
          renderSection(sectionKey, data),
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  avatar: { width: ms(80), height: ms(80), borderRadius: 50 },
  name: { fontSize: fonts.large, fontWeight: '600' },
  code: { fontSize: fonts.normal, color: '#555' },
  title: {
    fontSize: fonts.large,
    fontWeight: '700',
  },
  fixedHeader: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    zIndex: 10,
  },
  fixedHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.medium,
  },
  fixedAvatar: {
    width: ms(54),
    height: ms(54),
    borderRadius: ms(40),
    marginRight: spacing.small,
  },
  sectionCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.medium,
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    marginBottom: spacing.medium,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E2E5EA',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingVertical: spacing.small,
  },
  sectionToggleIcon: {
    width: ms(16),
    height: ms(16),
    tintColor: '#555',
  },
  fieldWrap: { marginBottom: spacing.medium },
  fieldLabel: {
    fontSize: fonts.small,
    marginBottom: ms(4),
    color: '#555',
    fontWeight: '500',
  },
  readonlyInput: {
    borderWidth: 1,
    borderColor: '#E2E5EA',
    borderRadius: 12,
    paddingHorizontal: spacing.small,
    paddingVertical: ms(8),
    fontSize: fonts.normal,
    backgroundColor: colors.lightGray || '#F5F6F7',
    color: colors.black,
  },
});

export default Profile;
