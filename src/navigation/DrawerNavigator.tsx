import { createDrawerNavigator } from '@react-navigation/drawer';
import { Screen_Name } from './ScreenName';
import Profile from '../screens/HomeStack/Profile';
import { colors } from '../utils/color';
import { Image } from 'react-native';
import icons from '../assets/icons';
import { ms } from '../utils/spacing';
import Shift from '../screens/HomeStack/Shift';
import Details_Shift from '../screens/HomeStack/Shift/Details';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Application from '../screens/HomeStack/Attendance Drawer';

import Employee from '../screens/HomeStack/Employee Drawer/Employee';

import DetailEmployee from '../screens/HomeStack/Employee Drawer/Employee/DetailEmployee';
import Contract from '../screens/HomeStack/Employee Drawer/Contract';
import DetailContract from '../screens/HomeStack/Employee Drawer/Contract/DetailContract';
import GroupDetail from '../screens/HomeStack/Employee Drawer/Group/DetailGroup';
import Group from '../screens/HomeStack/Employee Drawer/Group';
import DetailAppointment from '../screens/HomeStack/Employee Drawer/Appointment/DetailAppointment';
import Appointment from '../screens/HomeStack/Employee Drawer/Appointment';
import Child_Field from '../components/Child_Field';
import Detail_Field from '../components/DetailField';
import PayRoll from '../screens/HomeStack/PayRoll';
import { AttendanceTabs, ContractTabs, EmployeeTabs, PayrollTabs } from './Tab';
import Home from '../screens/HomeStack/Home';
import HomeStack from './HomeStack';
import { border } from '../utils/fontSize';
import QuickPin from '../screens/HomeStack/QuickPin';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { form_application } from '../utils/form';
import { navigate } from './RootNavigator';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

export const AttendanceDrawer = () => {
  const [showQuick, setShowQuick] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Drawer.Navigator
        id={undefined}
        screenOptions={({ route }) => ({
          headerShown: false,
          drawerStyle: { width: '60%' },
          drawerActiveTintColor: colors.blue,
          drawerActiveBackgroundColor: colors.blue,
          drawerLabelStyle: { color: 'black' },
          drawerItemStyle: { borderRadius: border.radiusExtraLarge },

          drawerIcon: ({ focused }) => {
            const iconMap = {
              [Screen_Name.Home]: focused ? icons.home_focus : icons.home,
              [Screen_Name.Attendance]: focused ? icons.home_focus : icons.home,
              [Screen_Name.Employee]: focused ? icons.home_focus : icons.home,
              [Screen_Name.PayRoll]: focused ? icons.home_focus : icons.home,
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
        initialRouteName={Screen_Name.Attendance}
      >
        <Drawer.Screen
          name={Screen_Name.Home}
          component={HomeStack}
          options={{}}
        />
        <Drawer.Screen
          name={Screen_Name.Attendance}
          component={AttendanceTabs}
        />
        <Drawer.Screen name={Screen_Name.Employee} component={EmployeeTabs} />
        <Drawer.Screen name={Screen_Name.PayRoll} component={PayrollTabs} />
      </Drawer.Navigator>
    </>
  );
};

export const EmployeeDrawer = () => (
  <Drawer.Navigator
    id={undefined}
    screenOptions={{
      headerShown: false,
      drawerStyle: { width: '60%' },
      drawerActiveTintColor: colors.blue,
      drawerActiveBackgroundColor: colors.blue,
      drawerLabelStyle: { color: 'black' },
    }}
    initialRouteName={Screen_Name.Employee}
  >
    <Drawer.Screen name={Screen_Name.HomeStack} component={HomeStack} />
    <Drawer.Screen name={Screen_Name.Attendance} component={AttendanceTabs} />
    <Drawer.Screen name={Screen_Name.Employee} component={EmployeeTabs} />
    <Drawer.Screen name={Screen_Name.PayRoll} component={PayrollTabs} />
  </Drawer.Navigator>
);

export const PayRollDrawer = () => (
  <Drawer.Navigator
    id={undefined}
    screenOptions={{
      headerShown: false,
      drawerStyle: { width: '60%' },
      drawerActiveTintColor: colors.blue,
      drawerActiveBackgroundColor: colors.blue,
      drawerLabelStyle: { color: 'black' },
    }}
    initialRouteName={Screen_Name.PayRoll}
  >
    <Drawer.Screen name={Screen_Name.Home} component={HomeStack} />
    <Drawer.Screen name={Screen_Name.Attendance} component={AttendanceTabs} />
    <Drawer.Screen name={Screen_Name.Employee} component={EmployeeTabs} />
    <Drawer.Screen name={Screen_Name.PayRoll} component={PayrollTabs} />
  </Drawer.Navigator>
);
