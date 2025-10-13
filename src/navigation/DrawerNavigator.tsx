import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { Screen_Name } from './ScreenName';
import Profile from '../screens/HomeStack/Profile';
import Setting from '../screens/HomeStack/Setting';
import { colors } from '../utils/color';
import Attendance from '../screens/HomeStack/Check_InOut';
import Details_Shift from '../screens/HomeStack/Check_InOut/Shift';
import { Text } from 'react-native-gesture-handler';
import { Image } from 'react-native';
import icons from '../assets/icons';
import { ms } from '../utils/spacing';

const Drawer = createDrawerNavigator();

const AttendanceDrawer = () => (
  <Drawer.Navigator
    id={undefined}
    screenOptions={({ route }) => ({
      headerShown: false,
      drawerStyle: { width: '60%' },
      drawerActiveTintColor: colors.blue,
      drawerActiveBackgroundColor: colors.blue,
      drawerLabelStyle: {
        color: 'black',
      },
      drawerIcon: ({ focused }) => {
        const iconMap = {
          [Screen_Name.Attendance]: focused ? icons.home_focus : icons.home,
          [Screen_Name.Profile]: focused ? icons.list_focus : icons.list,
        };
        return (
          <Image
            source={iconMap[route.name]}
            style={{ width: ms(24), height: ms(24) }}
            resizeMode="contain"
          />
        );
      },
    })}
    // drawerContent={props => (
    //   <DrawerContentScrollView {...props}>
    //     <Text>abc</Text>
    //     <DrawerItem
    //       label="Attendance"
    //       icon={({ focused, color, size }) => (
    //         <Image
    //           source={focused ? icons.home_focus : icons.home}
    //           style={{ width: 24, height: 24, tintColor: color }}
    //           resizeMode="contain"
    //         />
    //       )}
    //       onPress={() => props.navigation.navigate(Screen_Name.Attendance)}
    //     />
    //     <DrawerItem
    //       label="Profile"
    //       icon={({ focused, color, size }) => (
    //         <Image
    //           source={focused ? icons.add : icons.add}
    //           style={{ width: 24, height: 24, tintColor: color }}
    //           resizeMode="contain"
    //         />
    //       )}
    //       onPress={() => props.navigation.navigate(Screen_Name.Profile)}
    //     />
    //   </DrawerContentScrollView>
    // )}
  >
    <Drawer.Screen name={Screen_Name.Attendance} component={Attendance} />
    <Drawer.Screen name={Screen_Name.Profile} component={Profile} />
  </Drawer.Navigator>
);

export { AttendanceDrawer };

const EmployeeDrawer = () => (
  <Drawer.Navigator
    id={undefined}
    screenOptions={({ route }) => ({
      headerShown: false,
      drawerStyle: { width: '60%' },
      drawerActiveTintColor: colors.blue,
      drawerActiveBackgroundColor: colors.blue,
      drawerLabelStyle: {
        color: 'black',
      },
      drawerIcon: ({ focused }) => {
        const iconMap = {
          [Screen_Name.Details_Shift]: focused ? icons.home_focus : icons.home,
          [Screen_Name.Setting]: focused ? icons.list_focus : icons.list,
        };
        return (
          <Image
            source={iconMap[route.name]}
            style={{ width: ms(24), height: ms(24) }}
            resizeMode="contain"
          />
        );
      },
    })}
  >
    <Drawer.Screen name={Screen_Name.Details_Shift} component={Details_Shift} />
    <Drawer.Screen name={Screen_Name.Setting} component={Setting} />
  </Drawer.Navigator>
);

export { EmployeeDrawer };
