import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import {
  employee_Update,
  employeeAvatar_Update,
  getMe,
} from '../../services/user';
import icons from '../../assets/icons';
import { ms, spacing } from '../../utils/spacing';
import { launchImageLibrary } from 'react-native-image-picker';
import { colors } from '../../utils/color';
import images from '../../assets/images';
import AppStyles from '../../components/AppStyle';
import CustomHeader from '../../components/CustomHeader';
import { fonts } from '../../utils/fontSize';
import { employee_Get } from '../../services/hr';

const Profile = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const { userData } = useSelector((state: any) => state.user);
  const [fixedHeader, setFixedHeader] = useState(false);
  const [avatarSectionHeight, setAvatarSectionHeight] = useState(0);
  const [employee, setEmployee] = useState<any>();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [originalEmployee, setOriginalEmployee] = useState<any>();
  const [loading, setLoading] = useState(false);
  // Fetch employee data
  useFocusEffect(
    useCallback(() => {
      fetchEmployee();
    }, []),
  );

  const fetchEmployee = async () => {
    try {
      const res = await getMe();
      console.log('Fetched employee data:', res);
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  const getEmployeeObjectKey = (sectionKey: string) => {
    switch (sectionKey) {
      case 'Document Information':
        return 'employeeDocument';
      case 'Contact Information':
        return 'employeeContact';
      case 'Job Information':
        return 'employeeJobInfo';
      default:
        return null;
    }
  };

  const toggleSection = (sectionKey: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const sections = useMemo(() => {
    if (!employee) return [];
    const {
      employeeDocument = {},
      employeeContact = {},
      employeeJobInfo = {},
      ...basicInfo
    } = employee;

    return [
      { sectionKey: 'Basic Information', data: basicInfo },
      { sectionKey: 'Document Information', data: employeeDocument },
      { sectionKey: 'Contact Information', data: employeeContact },
      { sectionKey: 'Job Information', data: employeeJobInfo },
    ];
  }, [employee]);

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
      return value.slice(0, 10);
    }
    return String(value);
  };

  const saveEmployeeData = async (sectionKey: string) => {
    try {
      setLoading(true);
      let updatedEmployee;
      if (sectionKey === 'Basic Information') {
        const {
          employeeDocument,
          employeeContact,
          employeeJobInfo,
          ...basicInfo
        } = employee;
        updatedEmployee = await employee_Update(userData.employeeId, {
          ...employee,
          ...basicInfo,
        });
      } else {
        const objectKey = getEmployeeObjectKey(sectionKey);
        if (objectKey) {
          // Chỉ dùng nếu objectKey là string
          const updatedSectionData = employee[objectKey];
          updatedEmployee = await employee_Update(userData.employeeId, {
            ...employee,
            [objectKey]: updatedSectionData,
          });
        } else {
          // Nếu objectKey là null, không làm gì hoặc xử lý lỗi
          return;
        }
      }
      setEmployee(updatedEmployee);
      setOriginalEmployee(updatedEmployee);
      setEditingSection(null);
      console.log('Employee data saved successfully');
      fetchEmployee();
    } catch (error) {
      console.error('Failed to save employee data:', error);
      setEmployee(originalEmployee);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = (sectionKey: string) => {
    if (sectionKey === 'Basic Information') {
      const {
        employeeDocument,
        employeeContact,
        employeeJobInfo,
        ...basicInfo
      } = originalEmployee;
      setEmployee(prev => ({
        ...prev,
        ...basicInfo,
      }));
    } else {
      const objectKey = getEmployeeObjectKey(sectionKey);
      if (objectKey) {
        setEmployee(prev => ({
          ...prev,
          [objectKey]: { ...(originalEmployee[objectKey] || {}) },
        }));
      }
    }
    setEditingSection(null);
  };

  const renderField = (
    key: string,
    value: any,
    isEditing: boolean,
    sectionKey: string,
  ) => {
    const label = t(`label.${key}`, { defaultValue: key })
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, c => c.toUpperCase());

    const handleChange = (text: string) => {
      if (sectionKey === 'Basic Information') {
        setEmployee(prev => ({
          ...prev,
          [key]: text,
        }));
      } else {
        const objectKey = getEmployeeObjectKey(sectionKey);
        if (objectKey) {
          setEmployee(prev => ({
            ...prev,
            [objectKey]: {
              ...(prev[objectKey] || {}),
              [key]: text,
            },
          }));
        }
      }
    };

    const getInputType = (key: string, value: any) => {
      if (key.toLowerCase().includes('email')) return 'email-address';
      if (key.toLowerCase().includes('phone')) return 'phone-pad';
      if (typeof value === 'number') return 'numeric';
      return 'default';
    };

    return (
      <View key={key} style={styles.fieldWrap}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {isEditing ? (
          <TextInput
            value={String(value || '')}
            onChangeText={handleChange}
            style={styles.editableInput}
            keyboardType={getInputType(key, value)}
            multiline={
              key.toLowerCase().includes('address') ||
              key.toLowerCase().includes('note')
            }
            numberOfLines={
              key.toLowerCase().includes('address') ||
              key.toLowerCase().includes('note')
                ? 3
                : 1
            }
          />
        ) : (
          <TextInput
            editable={false}
            value={formatValue(value)}
            style={styles.readonlyInput}
            multiline={
              key.toLowerCase().includes('address') ||
              key.toLowerCase().includes('note')
            }
            numberOfLines={
              key.toLowerCase().includes('address') ||
              key.toLowerCase().includes('note')
                ? 3
                : 1
            }
          />
        )}
      </View>
    );
  };

  const renderSection = (sectionKey: string, data: Record<string, any>) => {
    if (!data || Object.keys(data).length === 0) return null;

    const isOpen = openSections[sectionKey];
    const isEditing = editingSection === sectionKey;

    return (
      <View key={sectionKey} style={styles.sectionCard}>
        <TouchableOpacity
          onPress={() => toggleSection(sectionKey)}
          style={styles.sectionHeader}
        >
          <Text style={styles.title}>{sectionKey}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {isEditing ? (
              <>
                <TouchableOpacity
                  onPress={() => cancelEdit(sectionKey)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    await saveEmployeeData(sectionKey);
                    setEditingSection(null);
                  }}
                  style={styles.saveButton}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  // Nếu section đang đóng, mở nó ra
                  if (!isOpen) {
                    setOpenSections(prev => ({
                      ...prev,
                      [sectionKey]: true,
                    }));
                  }
                  // Chuyển sang chế độ chỉnh sửa
                  setEditingSection(sectionKey);
                }}
              >
                <Text style={styles.editButton}>Edit</Text>
              </TouchableOpacity>
            )}
            <Image
              source={isOpen ? icons.up : icons.down}
              style={styles.sectionToggleIcon}
            />
          </View>
        </TouchableOpacity>
        {isOpen && (
          <View style={{ marginTop: spacing.medium }}>
            {Object.entries(data).map(([key, value]) =>
              renderField(key, value, isEditing, sectionKey),
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

  const handleSelectAvatar = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: false,
    });

    if (result.didCancel) {
      console.log('User cancelled image picker');
      return;
    }

    if (result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      if (selectedImage.uri) {
        try {
          setLoading(true);
          const updatedAvatar = await employeeAvatar_Update(
            userData.employeeId,
            {
              uri: selectedImage.uri,
              fileName: selectedImage.fileName,
              type: selectedImage.type,
            },
          );

          setEmployee((prev: any) => ({
            ...prev,
            employeeAvatar: updatedAvatar.avatarUrl,
          }));
          fetchEmployee();
        } catch (error) {
          console.error('Failed to upload avatar:', error);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {fixedHeader ? (
        <>
          <View
            style={[
              {
                paddingTop: ms(insets.top + spacing.small),
                paddingVertical: spacing.small,
                paddingHorizontal: spacing.medium,
                flexDirection: 'row',
                backgroundColor: colors.white,
                alignItems: 'center',
                maxHeight: ms(110),
              },
            ]}
          >
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Image
                source={icons.menu}
                style={{
                  width: ms(25),
                  height: ms(25),
                  marginRight: spacing.medium,
                }}
              />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={
                  employee?.employeeAvatar
                    ? { uri: employee?.employeeAvatar }
                    : images.avt_default
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
                <Text style={AppStyles.label}>{employee?.fullName}</Text>
                <Text style={AppStyles.text}>{employee?.employeeCode}</Text>
              </View>
            </View>
          </View>
        </>
      ) : (
        <>
          <CustomHeader
            label={userData?.employee?.fullName}
            Home={false}
            leftIcon={icons.back}
            leftPress={() => {
              navigation.goBack();
            }}
          />
        </>
      )}

      <ScrollView onScroll={handleScroll} scrollEventThrottle={16} style={{}}>
        <View style={{}}>
          {fixedHeader ? (
            <>
              <View
                style={{
                  marginBottom: ms(avatarSectionHeight + spacing.large),
                }}
              />
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
                <TouchableOpacity onPress={() => handleSelectAvatar()}>
                  <Image
                    source={
                      employee?.employeeAvatar
                        ? { uri: employee?.employeeAvatar }
                        : images.avt_default
                    }
                    style={styles.avatar}
                  />
                </TouchableOpacity>
                <View style={{ justifyContent: 'space-around' }}>
                  <Text
                    style={{
                      fontSize: fonts.large,
                      marginLeft: spacing.medium,
                    }}
                  >
                    {employee?.fullName}
                  </Text>
                  <Text
                    style={{
                      fontSize: fonts.normal,
                      marginLeft: spacing.medium,
                    }}
                  >
                    {employee?.employeeCode}
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
  container: { flex: 1, backgroundColor: colors.background },
  avatar: { width: ms(80), height: ms(80), borderRadius: border.radiusCircle },
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
    shadowColor: colors.black,
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
    borderRadius: border.radiusLarge,
    borderWidth: 1,
    borderColor: colors.Gray,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    borderColor: colors.Gray,
    borderRadius: 12,
    paddingHorizontal: spacing.small,
    paddingVertical: ms(8),
    fontSize: fonts.normal,
    backgroundColor: colors.lightGray || '#F5F6F7',
    color: colors.black,
  },
  editButton: {
    fontSize: fonts.normal,
    color: colors.primary,
    marginRight: spacing.small,
  },
  editableInput: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: spacing.small,
    paddingVertical: ms(8),
    fontSize: fonts.normal,
    backgroundColor: colors.white,
    color: colors.black,
  },
  cancelButton: {
    paddingHorizontal: spacing.small,
    paddingVertical: ms(4),
    backgroundColor: '#f5f5f5',
    borderRadius: border.radiusMedium,
    marginRight: spacing.small,
  },
  cancelButtonText: {
    fontSize: fonts.small,
    color: '#666',
  },
  saveButton: {
    paddingHorizontal: spacing.small,
    paddingVertical: ms(4),
    backgroundColor: colors.primary,
    borderRadius: border.radiusMedium,
    marginRight: spacing.small,
  },
  saveButtonText: {
    fontSize: fonts.small,
    color: colors.white,
    fontWeight: '600',
  },
});

export default Profile;
