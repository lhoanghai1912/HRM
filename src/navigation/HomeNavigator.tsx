import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Screen_Name } from './ScreenName';
import BottomTabNavigator from './BottomTabNavigator';

import Profile from '../screens/HomeStack/Profile';
import Menu from '../screens/HomeStack/Menu';
import Notifications from '../screens/HomeStack/Noti';

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
      <Stack.Screen name={Screen_Name.Profile_Screen} component={Profile} />
      <Stack.Screen
        name={Screen_Name.Notification_Screen}
        component={Notifications}
      />
      <Stack.Screen name={Screen_Name.Menu_Screen} component={Menu} />
      {/* <Stack.Screen name={Screen_Name.AddForm_Screen} component={AddForm} />
      <Stack.Screen name={Screen_Name.PayRoll_Screen} component={PayRoll} />
      <Stack.Screen name={Screen_Name.QuickPin_Screen} component={QuickPin} />
      <Stack.Screen name={Screen_Name.TimeSheet_Screen} component={TimeSheet} /> */}
    </Stack.Navigator>
  );
};
export default HomeNavigator;
