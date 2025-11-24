import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Screen_Name } from './ScreenName';
import Home from '../screens/HomeStack/Home';
import Profile from '../screens/HomeStack/Profile';
import Menu from '../screens/HomeStack/Menu';
import AddEmployee from '../screens/HomeStack/AddEmployee';
import OrnStruct from '../screens/HomeStack/OrgStruct';
import ChangePassword from '../screens/HomeStack/ChangePassword';
import Notifications from '../screens/HomeStack/Noti';
import {
  AttendanceDrawer,
  EmployeeDrawer,
  PayRollDrawer,
} from './DrawerNavigator';

const Stack = createNativeStackNavigator();

const HomeStack = () => (
  <Stack.Navigator
    id={undefined}
    screenOptions={{ headerShown: false }}
    initialRouteName={Screen_Name.Home}
  >
    <Stack.Screen name={Screen_Name.Home} component={Home} />

    <Stack.Screen
      name={Screen_Name.Attendance_Drawer}
      component={AttendanceDrawer}
    />
    <Stack.Screen
      name={Screen_Name.Employee_Drawer}
      component={EmployeeDrawer}
    />
    <Stack.Screen name={Screen_Name.PayRoll_Drawer} component={PayRollDrawer} />
  </Stack.Navigator>
);

export default HomeStack;
