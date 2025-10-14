import { createDrawerNavigator } from '@react-navigation/drawer';
import { Screen_Name } from './ScreenName';
import Profile from '../screens/HomeStack/Profile';
import Setting from '../screens/HomeStack/Setting';
import { colors } from '../utils/color';
import Attendance from '../screens/HomeStack/Check_InOut';
import { Image } from 'react-native';
import icons from '../assets/icons';
import { ms } from '../utils/spacing';
import Shift from '../screens/HomeStack/Shift';
import Details_Shift from '../screens/HomeStack/Shift/Details';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

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
          [Screen_Name.Shift]: focused ? icons.home_focus : icons.home,
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
    <Drawer.Screen name={Screen_Name.Shift} component={ShiftStack} />
    <Drawer.Screen name={Screen_Name.Setting} component={Setting} />
  </Drawer.Navigator>
);

export { EmployeeDrawer };

const ShiftStack = () => (
  <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
    <Stack.Screen name={Screen_Name.Shift} component={Shift} />
    <Stack.Screen name={Screen_Name.Details_Shift} component={Details_Shift} />
  </Stack.Navigator>
);

export default ShiftStack;
