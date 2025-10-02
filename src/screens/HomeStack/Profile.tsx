import React, { use } from 'react';
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

const Profile = ({ navigation }) => {
  const { userData } = useSelector((state: any) => state.user);
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <NavBar title="Profile" onPress={() => navigation.goBack()} />
      <ScrollView style={{}}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: 'red',
            width: '100%',
            paddingHorizontal: spacing.medium,
            paddingVertical: spacing.medium,
          }}
        >
          <Image source={images.avt_default} style={styles.avatar} />
          <View style={{ justifyContent: 'space-around' }}>
            <Text
              style={{
                color: 'white',
                fontSize: fonts.large,
                marginLeft: spacing.medium,
              }}
            >
              John Doe
            </Text>
            <Text
              style={{
                color: 'white',
                fontSize: fonts.normal,
                marginLeft: spacing.medium,
              }}
            >
              Software Engineer
            </Text>
          </View>
        </View>
        <View style={{ padding: spacing.medium }}>
          <View>
            <Text style={styles.label}>{t(`label.username`)}</Text>
            <TextInput
              editable={false}
              value={userData.userName}
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
                  backgroundColor: colors.lightGray,
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

export default Profile;
