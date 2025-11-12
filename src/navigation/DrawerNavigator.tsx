import { createDrawerNavigator } from '@react-navigation/drawer';
import { Screen_Name } from './ScreenName';
import Profile from '../screens/HomeStack/Profile';
import { colors } from '../utils/color';
import Attendance from '../screens/HomeStack/Check_InOut';
import { Image } from 'react-native';
import icons from '../assets/icons';
import { ms } from '../utils/spacing';
import Shift from '../screens/HomeStack/Shift';
import Details_Shift from '../screens/HomeStack/Shift/Details';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Application from '../screens/HomeStack/Application';
import Leave from '../screens/HomeStack/Application/Leave';
import Attendance_Update from '../screens/HomeStack/Application/Attendance_Update';
import Late_Early from '../screens/HomeStack/Application/Late_Early';
import Overtime from '../screens/HomeStack/Application/OverTime';
import Remote from '../screens/HomeStack/Application/Remote';
import Business_Trip from '../screens/HomeStack/Application/Trip';
import Shift_Update from '../screens/HomeStack/Application/Shift_Update';
import Detail_Late_Early from '../screens/HomeStack/Application/Late_Early/Detail';
import Employee from '../screens/HomeStack/Employee Drawer/Employee';

import DetailEmployee from '../screens/HomeStack/Employee Drawer/Employee/DetailEmployee';
import Contract from '../screens/HomeStack/Employee Drawer/Contract';
import DetailContract from '../screens/HomeStack/Employee Drawer/Contract/DetailContract';
import Not_Expand from '../screens/HomeStack/Employee Drawer/Group/DetailGroup';
import GroupDetail from '../screens/HomeStack/Employee Drawer/Group/DetailGroup';
import Group from '../screens/HomeStack/Employee Drawer/Group';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

export const AttendanceDrawer = () => (
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

export const CheckDrawer = () => (
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
          [Screen_Name.Shift]: focused ? icons.shift_focus : icons.shift,
          [Screen_Name.Application]: focused
            ? icons.document_focus
            : icons.document,
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
    <Drawer.Screen
      name={Screen_Name.Application}
      component={ApplicationStack}
    />
  </Drawer.Navigator>
);

export const EmployeeDrawer = () => (
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
          [Screen_Name.Employee]: focused
            ? icons.username_focus
            : icons.username,
          [Screen_Name.Contract]: focused
            ? icons.document_focus
            : icons.document,
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
    <Drawer.Screen name={Screen_Name.Employee} component={EmployeeStack} />
    <Drawer.Screen name={Screen_Name.Contract} component={ContractStack} />
  </Drawer.Navigator>
);

export const EmployeeStack = () => (
  <Stack.Navigator
    id={undefined}
    screenOptions={{
      headerShown: false,
    }}
    initialRouteName={Screen_Name.Employee}
  >
    <Stack.Screen name={Screen_Name.Employee} component={Employee} />
    <Stack.Screen
      name={Screen_Name.Details_Employee}
      component={DetailEmployee}
    />
    <Stack.Screen name={Screen_Name.Detail_Group} component={GroupDetail} />
    <Stack.Screen name={Screen_Name.Group} component={Group} />
  </Stack.Navigator>
);

export const ContractStack = () => (
  <Stack.Navigator
    id={undefined}
    screenOptions={{ headerShown: false }}
    initialRouteName={Screen_Name.Contract}
  >
    <Stack.Screen name={Screen_Name.Contract} component={Contract} />
    <Stack.Screen
      name={Screen_Name.Details_Contract}
      component={DetailContract}
    />
    <Stack.Screen name={Screen_Name.Detail_Group} component={GroupDetail} />
    <Stack.Screen name={Screen_Name.Group} component={Group} />
  </Stack.Navigator>
);

export const ShiftStack = () => (
  <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
    <Stack.Screen name={Screen_Name.Shift} component={Shift} />
    <Stack.Screen name={Screen_Name.Details_Shift} component={Details_Shift} />
  </Stack.Navigator>
);

export const ApplicationStack = () => (
  <Stack.Navigator
    id={undefined}
    screenOptions={{ headerShown: false }}
    initialRouteName={Screen_Name.Application}
  >
    <Stack.Screen name={Screen_Name.Application} component={Application} />
    <Stack.Screen name={Screen_Name.Leave} component={Leave} />
    <Stack.Screen name={Screen_Name.Late_Early} component={Late_Early} />
    <Stack.Screen name={Screen_Name.Overtime} component={Overtime} />
    <Stack.Screen name={Screen_Name.Remote} component={Remote} />
    <Stack.Screen name={Screen_Name.Business_Trip} component={Business_Trip} />
    <Stack.Screen name={Screen_Name.Shift_Update} component={Shift_Update} />

    <Stack.Screen
      name={Screen_Name.Attendance_Update}
      component={Attendance_Update}
    />
    <Stack.Screen
      name={Screen_Name.Detail_Late_Early}
      component={Detail_Late_Early}
    />
    {/* Add other application-related screens here */}
  </Stack.Navigator>
);
