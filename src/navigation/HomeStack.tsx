import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Screen_Name } from './ScreenName';
import Home from '../screens/HomeStack/Home';
import Profile from '../screens/HomeStack/Profile';
import Menu from '../screens/HomeStack/Menu';
import AddEmployee from '../screens/HomeStack/AddEmployee';
import OrnStruct from '../screens/HomeStack/OrgStruct';
import ChangePassword from '../screens/HomeStack/ChangePassword';
import Notifications from '../screens/HomeStack/Noti';
import Attendance from '../screens/HomeStack/Check_InOut';
import Details_Shift from '../screens/HomeStack/Check_InOut/Shift';
import DrawerNavigator from './DrawerNavigator';

const Stack = createNativeStackNavigator();

const HomeStack = () => (
  <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={Home} />
    <Stack.Screen name={Screen_Name.Profile} component={Profile} />
    <Stack.Screen name={Screen_Name.Menu} component={Menu} />
    <Stack.Screen name={Screen_Name.AddEmployee} component={AddEmployee} />
    <Stack.Screen name={Screen_Name.OrnStruct} component={OrnStruct} />
    <Stack.Screen
      name={Screen_Name.ChangePassword}
      component={ChangePassword}
    />
    <Stack.Screen name={Screen_Name.Notification} component={Notifications} />

    <Stack.Screen name={Screen_Name.Attendance} component={DrawerNavigator} />
    <Stack.Screen name={Screen_Name.Details_Shift} component={Details_Shift} />
  </Stack.Navigator>
);

export default HomeStack;
