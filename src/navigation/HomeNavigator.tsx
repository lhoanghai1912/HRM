import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Screen_Name } from './ScreenName';
import BottomTabNavigator from './BottomTabNavigator';

import Profile from '../screens/HomeStack/Profile';
import Menu from '../screens/HomeStack/Menu';
import Notifications from '../screens/HomeStack/Noti';
import Employee from '../screens/HomeStack/AddEmployee';
import OrnStruct from '../screens/HomeStack/OrgStruct';
import ChangePassword from '../screens/HomeStack/ChangePassword';

const Stack = createNativeStackNavigator();

const HomeNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      initialRouteName={Screen_Name.BottomTab_Navigator}
    >
      <Stack.Screen
        name={Screen_Name.BottomTab_Navigator}
        component={BottomTabNavigator}
      />
      <Stack.Screen name={Screen_Name.Notification} component={Notifications} />
      <Stack.Screen name={Screen_Name.Menu} component={Menu} />
      <Stack.Screen name={Screen_Name.Employee} component={Employee} />
      <Stack.Screen name={Screen_Name.OrnStruct} component={OrnStruct} />
      <Stack.Screen name={Screen_Name.Profile} component={Profile} />
      <Stack.Screen
        name={Screen_Name.ChangePassword}
        component={ChangePassword}
      />

      {/* <Stack.Screen name={Screen_Name.Profile} component={Profile} />
      <Stack.Screen name={Screen_Name.Profile} component={Profile} />
      <Stack.Screen name={Screen_Name.Profile} component={Profile} /> */}

      {/* <Stack.Screen name={Screen_Name.AddForm} component={AddForm} />
      <Stack.Screen name={Screen_Name.PayRoll} component={PayRoll} />
      <Stack.Screen name={Screen_Name.QuickPin} component={QuickPin} />
      <Stack.Screen name={Screen_Name.TimeSheet} component={TimeSheet} /> */}
    </Stack.Navigator>
  );
};
export default HomeNavigator;
