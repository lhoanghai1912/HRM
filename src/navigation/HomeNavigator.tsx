import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Screen_Name } from './ScreenName';
import { BottomTabNavigator } from './BottomTabNavigator';

import Profile from '../screens/HomeStack/Profile';
import Menu from '../screens/HomeStack/Menu';
import Notifications from '../screens/HomeStack/Noti';
import Employee from '../screens/HomeStack/AddEmployee';
import OrnStruct from '../screens/HomeStack/OrgStruct';
import ChangePassword from '../screens/HomeStack/ChangePassword';
import AddEmployee from '../screens/HomeStack/AddEmployee';
import { AttendanceDrawer, EmployeeDrawer } from './DrawerNavigator';

const Stack = createNativeStackNavigator();

const HomeNavigator = () => {
  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      initialRouteName={Screen_Name.BottomTab_Navigator}
    >
      <Stack.Screen
        name={Screen_Name.BottomTab_Navigator}
        component={BottomTabNavigator}
      />
    </Stack.Navigator>
  );
};
export default HomeNavigator;
