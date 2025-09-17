import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../utils/color';
import { spacing } from '../utils/spacing';
import icons from '../assets/icons';
import AppStyles from './AppStyle';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { navigate } from '../navigation/RootNavigator';
import { Screen_Name } from '../navigation/ScreenName';

const CustomHeader = () => {
  const inset = useSafeAreaInsets();
  const { userData } = useSelector((state: any) => state.user);
  return (
    <View style={[styles.header, { paddingTop: inset.top }]}>
      <View style={[styles.headerItem, { width: '75%' }]}>
        <TouchableOpacity
          onPress={() => navigate(Screen_Name.Menu)}
          style={{ marginRight: spacing.medium }}
        >
          <Image
            source={icons.menu}
            style={AppStyles.icon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={[AppStyles.label, { textAlign: 'center' }]}>
          {userData.userName}
        </Text>
      </View>
      <View style={[styles.headerItem, { width: '5%' }]}></View>
      <View
        style={[
          styles.headerItem,
          { width: '20%', justifyContent: 'space-between' },
        ]}
      >
        <TouchableOpacity onPress={() => navigate(Screen_Name.Notification)}>
          <Image
            source={icons.noti}
            style={AppStyles.icon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigate(Screen_Name.Profile)}>
          <Image
            source={icons.username}
            style={AppStyles.icon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    width: '100%',
    backgroundColor: colors.white,
    marginBottom: spacing.medium,
    flexDirection: 'row',
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
  },
  headerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default CustomHeader;
