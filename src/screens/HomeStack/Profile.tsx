import React, { use, useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInputComponent,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import NavBar from '../../components/Navbar';
import { ms, spacing } from '../../utils/spacing';
import icons from '../../assets/icons';
import images from '../../assets/images';
import { fonts } from '../../utils/fontSize';
import AppInput from '../../components/AppInput';
import { Screen_Name } from '../../navigation/ScreenName';
import { navigate } from '../../navigation/RootNavigator';
import { colors } from '../../utils/color';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import AppStyles from '../../components/AppStyle';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { lo } from '../../language/Resource';
import { useFocusEffect } from '@react-navigation/native';

const Profile = ({ navigation }) => {
  const { userData } = useSelector((state: any) => state.user);
  const [fixedHeader, setFixedHeader] = useState(false);
  const [showBasic, setShowBasic] = useState(true);
  const [avatarSectionHeight, setAvatarSectionHeight] = useState(0);
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  useFocusEffect(
    useCallback(() => {
      console.log('userData', userData);
    }, []),
  );

  const handleAvatarLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setAvatarSectionHeight(height);
  };

  // Hàm xử lý khi scroll
  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    // Khi scroll vượt qua chiều cao của avatar section, hiển thị fixedHeader
    if (scrollY > ms(avatarSectionHeight - 32)) {
      setFixedHeader(true);
    } else if (scrollY <= ms(avatarSectionHeight)) {
      setFixedHeader(false);
    }
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
        {showBasic ? (
          <>
            <View style={styles.basicInfo}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={AppStyles.title}>{t('label.basic_profile')}</Text>
                <TouchableOpacity onPress={() => setShowBasic(!showBasic)}>
                  <Image
                    source={showBasic ? icons.up : icons.down}
                    style={AppStyles.icon}
                  />
                </TouchableOpacity>
              </View>

              <View style={{}}>
                <View>
                  <Text style={styles.label}>{t(`label.username`)}</Text>
                  <TextInput
                    editable={false}
                    value={userData.fullName}
                    style={{
                      borderRadius: 15,
                      borderWidth: 1,
                      paddingHorizontal: spacing.small,
                      fontSize: fonts.normal,
                      backgroundColor: colors.lightGray,
                      marginBottom: spacing.medium,
                    }}
                  />
                </View>
                <View>
                  <Text style={styles.label}>{t(`label.password`)}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigate(Screen_Name.ChangePassword);
                    }}
                  >
                    <TextInput
                      editable={false}
                      value={`**********`}
                      style={{
                        borderRadius: 15,
                        borderWidth: 1,
                        paddingHorizontal: spacing.small,
                        fontSize: fonts.normal,
                        marginBottom: spacing.medium,
                      }}
                    />
                    <Image
                      source={icons.edit}
                      style={{
                        position: 'absolute',
                        right: spacing.small,
                        top: '20%',
                        width: ms(25),
                        height: ms(25),
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.label}>{t(`label.password`)}</Text>
                <TouchableOpacity
                  onPress={() => {
                    navigate(Screen_Name.ChangePassword);
                  }}
                >
                  <TextInput
                    editable={false}
                    value={userData.birthDay}
                    style={{
                      borderRadius: 15,
                      borderWidth: 1,
                      paddingHorizontal: spacing.small,
                      fontSize: fonts.normal,
                      marginBottom: spacing.medium,
                    }}
                  />
                  <Image
                    source={icons.edit}
                    style={{
                      position: 'absolute',
                      right: spacing.small,
                      top: '20%',
                      width: ms(25),
                      height: ms(25),
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={styles.basicInfo}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={AppStyles.title}>{t('label.basic_profile')}</Text>
                <TouchableOpacity onPress={() => setShowBasic(!showBasic)}>
                  <Image
                    source={showBasic ? icons.up : icons.down}
                    style={AppStyles.icon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
        {showBasic ? (
          <>
            <View style={styles.basicInfo}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={AppStyles.title}>{t('label.basic_profile')}</Text>
                <TouchableOpacity onPress={() => setShowBasic(!showBasic)}>
                  <Image
                    source={showBasic ? icons.up : icons.down}
                    style={AppStyles.icon}
                  />
                </TouchableOpacity>
              </View>

              <View style={{}}>
                <View>
                  <Text style={styles.label}>{t(`label.username`)}</Text>
                  <TextInput
                    editable={false}
                    value={userData.fullName}
                    style={{
                      borderRadius: 15,
                      borderWidth: 1,
                      paddingHorizontal: spacing.small,
                      fontSize: fonts.normal,
                      backgroundColor: colors.lightGray,
                      marginBottom: spacing.medium,
                    }}
                  />
                </View>
                <View>
                  <Text style={styles.label}>{t(`label.password`)}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigate(Screen_Name.ChangePassword);
                    }}
                  >
                    <TextInput
                      editable={false}
                      value={`**********`}
                      style={{
                        borderRadius: 15,
                        borderWidth: 1,
                        paddingHorizontal: spacing.small,
                        fontSize: fonts.normal,
                        marginBottom: spacing.medium,
                      }}
                    />
                    <Image
                      source={icons.edit}
                      style={{
                        position: 'absolute',
                        right: spacing.small,
                        top: '20%',
                        width: ms(25),
                        height: ms(25),
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.label}>{t(`label.password`)}</Text>
                <TouchableOpacity
                  onPress={() => {
                    navigate(Screen_Name.ChangePassword);
                  }}
                >
                  <TextInput
                    editable={false}
                    value={userData.birthDay}
                    style={{
                      borderRadius: 15,
                      borderWidth: 1,
                      paddingHorizontal: spacing.small,
                      fontSize: fonts.normal,
                      marginBottom: spacing.medium,
                    }}
                  />
                  <Image
                    source={icons.edit}
                    style={{
                      position: 'absolute',
                      right: spacing.small,
                      top: '20%',
                      width: ms(25),
                      height: ms(25),
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={styles.basicInfo}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={AppStyles.title}>{t('label.basic_profile')}</Text>
                <TouchableOpacity onPress={() => setShowBasic(!showBasic)}>
                  <Image
                    source={showBasic ? icons.up : icons.down}
                    style={AppStyles.icon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
        {showBasic ? (
          <>
            <View style={styles.basicInfo}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={AppStyles.title}>{t('label.basic_profile')}</Text>
                <TouchableOpacity onPress={() => setShowBasic(!showBasic)}>
                  <Image
                    source={showBasic ? icons.up : icons.down}
                    style={AppStyles.icon}
                  />
                </TouchableOpacity>
              </View>

              <View style={{}}>
                <View>
                  <Text style={styles.label}>{t(`label.username`)}</Text>
                  <TextInput
                    editable={false}
                    value={userData.fullName}
                    style={{
                      borderRadius: 15,
                      borderWidth: 1,
                      paddingHorizontal: spacing.small,
                      fontSize: fonts.normal,
                      backgroundColor: colors.lightGray,
                      marginBottom: spacing.medium,
                    }}
                  />
                </View>
                <View>
                  <Text style={styles.label}>{t(`label.password`)}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigate(Screen_Name.ChangePassword);
                    }}
                  >
                    <TextInput
                      editable={false}
                      value={`**********`}
                      style={{
                        borderRadius: 15,
                        borderWidth: 1,
                        paddingHorizontal: spacing.small,
                        fontSize: fonts.normal,
                        marginBottom: spacing.medium,
                      }}
                    />
                    <Image
                      source={icons.edit}
                      style={{
                        position: 'absolute',
                        right: spacing.small,
                        top: '20%',
                        width: ms(25),
                        height: ms(25),
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.label}>{t(`label.password`)}</Text>
                <TouchableOpacity
                  onPress={() => {
                    navigate(Screen_Name.ChangePassword);
                  }}
                >
                  <TextInput
                    editable={false}
                    value={userData.birthDay}
                    style={{
                      borderRadius: 15,
                      borderWidth: 1,
                      paddingHorizontal: spacing.small,
                      fontSize: fonts.normal,
                      marginBottom: spacing.medium,
                    }}
                  />
                  <Image
                    source={icons.edit}
                    style={{
                      position: 'absolute',
                      right: spacing.small,
                      top: '20%',
                      width: ms(25),
                      height: ms(25),
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={styles.basicInfo}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={AppStyles.title}>{t('label.basic_profile')}</Text>
                <TouchableOpacity onPress={() => setShowBasic(!showBasic)}>
                  <Image
                    source={showBasic ? icons.up : icons.down}
                    style={AppStyles.icon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
        {showBasic ? (
          <>
            <View style={styles.basicInfo}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={AppStyles.title}>{t('label.basic_profile')}</Text>
                <TouchableOpacity onPress={() => setShowBasic(!showBasic)}>
                  <Image
                    source={showBasic ? icons.up : icons.down}
                    style={AppStyles.icon}
                  />
                </TouchableOpacity>
              </View>

              <View style={{}}>
                <View>
                  <Text style={styles.label}>{t(`label.username`)}</Text>
                  <TextInput
                    editable={false}
                    value={userData.fullName}
                    style={{
                      borderRadius: 15,
                      borderWidth: 1,
                      paddingHorizontal: spacing.small,
                      fontSize: fonts.normal,
                      backgroundColor: colors.lightGray,
                      marginBottom: spacing.medium,
                    }}
                  />
                </View>
                <View>
                  <Text style={styles.label}>{t(`label.password`)}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigate(Screen_Name.ChangePassword);
                    }}
                  >
                    <TextInput
                      editable={false}
                      value={`**********`}
                      style={{
                        borderRadius: 15,
                        borderWidth: 1,
                        paddingHorizontal: spacing.small,
                        fontSize: fonts.normal,
                        marginBottom: spacing.medium,
                      }}
                    />
                    <Image
                      source={icons.edit}
                      style={{
                        position: 'absolute',
                        right: spacing.small,
                        top: '20%',
                        width: ms(25),
                        height: ms(25),
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.label}>{t(`label.password`)}</Text>
                <TouchableOpacity
                  onPress={() => {
                    navigate(Screen_Name.ChangePassword);
                  }}
                >
                  <TextInput
                    editable={false}
                    value={userData.birthDay}
                    style={{
                      borderRadius: 15,
                      borderWidth: 1,
                      paddingHorizontal: spacing.small,
                      fontSize: fonts.normal,
                      marginBottom: spacing.medium,
                    }}
                  />
                  <Image
                    source={icons.edit}
                    style={{
                      position: 'absolute',
                      right: spacing.small,
                      top: '20%',
                      width: ms(25),
                      height: ms(25),
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={styles.basicInfo}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={AppStyles.title}>{t('label.basic_profile')}</Text>
                <TouchableOpacity onPress={() => setShowBasic(!showBasic)}>
                  <Image
                    source={showBasic ? icons.up : icons.down}
                    style={AppStyles.icon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
        {showBasic ? (
          <>
            <View style={styles.basicInfo}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={AppStyles.title}>{t('label.basic_profile')}</Text>
                <TouchableOpacity onPress={() => setShowBasic(!showBasic)}>
                  <Image
                    source={showBasic ? icons.up : icons.down}
                    style={AppStyles.icon}
                  />
                </TouchableOpacity>
              </View>

              <View style={{}}>
                <View>
                  <Text style={styles.label}>{t(`label.username`)}</Text>
                  <TextInput
                    editable={false}
                    value={userData.fullName}
                    style={{
                      borderRadius: 15,
                      borderWidth: 1,
                      paddingHorizontal: spacing.small,
                      fontSize: fonts.normal,
                      backgroundColor: colors.lightGray,
                      marginBottom: spacing.medium,
                    }}
                  />
                </View>
                <View>
                  <Text style={styles.label}>{t(`label.password`)}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigate(Screen_Name.ChangePassword);
                    }}
                  >
                    <TextInput
                      editable={false}
                      value={`**********`}
                      style={{
                        borderRadius: 15,
                        borderWidth: 1,
                        paddingHorizontal: spacing.small,
                        fontSize: fonts.normal,
                        marginBottom: spacing.medium,
                      }}
                    />
                    <Image
                      source={icons.edit}
                      style={{
                        position: 'absolute',
                        right: spacing.small,
                        top: '20%',
                        width: ms(25),
                        height: ms(25),
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.label}>{t(`label.password`)}</Text>
                <TouchableOpacity
                  onPress={() => {
                    navigate(Screen_Name.ChangePassword);
                  }}
                >
                  <TextInput
                    editable={false}
                    value={userData.birthDay}
                    style={{
                      borderRadius: 15,
                      borderWidth: 1,
                      paddingHorizontal: spacing.small,
                      fontSize: fonts.normal,
                      marginBottom: spacing.medium,
                    }}
                  />
                  <Image
                    source={icons.edit}
                    style={{
                      position: 'absolute',
                      right: spacing.small,
                      top: '20%',
                      width: ms(25),
                      height: ms(25),
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={styles.basicInfo}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={AppStyles.title}>{t('label.basic_profile')}</Text>
                <TouchableOpacity onPress={() => setShowBasic(!showBasic)}>
                  <Image
                    source={showBasic ? icons.up : icons.down}
                    style={AppStyles.icon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  avatar: {
    width: ms(80),
    height: ms(80),
    borderRadius: 50,
  },
  label: {
    fontSize: fonts.normal,
    marginBottom: spacing.small,
  },
  basicInfo: {
    backgroundColor: colors.white,
    marginBottom: spacing.large,
    margin: spacing.medium,
    borderRadius: 15,
    padding: spacing.medium,
  },
});

export default Profile;
