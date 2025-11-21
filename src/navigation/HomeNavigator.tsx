import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Screen_Name } from './ScreenName';
import {
  BottomAttendTabNavigator,
  BottomTabNavigator,
} from './BottomTabNavigator';

import Profile from '../screens/HomeStack/Profile';
import Menu from '../screens/HomeStack/Menu';
import Notifications from '../screens/HomeStack/Noti';
import Employee from '../screens/HomeStack/AddEmployee';
import OrnStruct from '../screens/HomeStack/OrgStruct';
import ChangePassword from '../screens/HomeStack/ChangePassword';
import AddEmployee from '../screens/HomeStack/AddEmployee';
import { AttendanceDrawer, EmployeeDrawer } from './DrawerNavigator';
import { useNavigationState } from '@react-navigation/native';
import HomeStack from './HomeStack';

const Stack = createNativeStackNavigator();

const HomeNavigator = () => {
  // const currentRoute = useNavigationState(state => {
  //   const route = state.routes[state.index];
  //   return route?.name;
  // });
  // const useAttendTab = currentRoute === Screen_Name.Attendance_Drawer;

  return (
    <>
      <Stack.Navigator
        id={undefined}
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
        initialRouteName={Screen_Name.BottomTab_Navigator}
      >
        <Stack.Screen
          name={Screen_Name.BottomTab_Navigator}
          component={BottomTabNavigator}
        />
        <Stack.Screen
          name={Screen_Name.BottomAttendTab_Navigator}
          component={BottomAttendTabNavigator}
        />
      </Stack.Navigator>
    </>
  );
};
export default HomeNavigator;
