import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Screen_Name } from './ScreenName';
// import { BottomTabNavigator } from './BottomTabNavigator';

import Profile from '../screens/HomeStack/Profile';
import Menu from '../screens/HomeStack/Menu';
import Notifications from '../screens/HomeStack/Noti';
import Employee from '../screens/HomeStack/AddEmployee';
import OrnStruct from '../screens/HomeStack/OrgStruct';
import ChangePassword from '../screens/HomeStack/ChangePassword';
import AddEmployee from '../screens/HomeStack/AddEmployee';
import {
  AttendanceDrawer,
  EmployeeDrawer,
  PayRollDrawer,
} from './DrawerNavigator';
import HomeStack from './HomeStack';
// import BottomTabNavigator from './BottomTabNavigator';
import Home from '../screens/HomeStack/Home';

const Stack = createNativeStackNavigator();

export default function HomeNavigator() {
  return (
    <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      {/* TAB HOME (có BottomTab riêng) */}
      <Stack.Screen name={Screen_Name.Home} component={HomeStack} />

      {/* Drawer – KHÔNG nằm trong BottomTab nên sẽ không bị overlap */}
      <Stack.Screen name="AttendanceDrawer" component={AttendanceDrawer} />
      <Stack.Screen name="EmployeeDrawer" component={EmployeeDrawer} />
      <Stack.Screen name="PayrollDrawer" component={PayRollDrawer} />
    </Stack.Navigator>
  );
}
