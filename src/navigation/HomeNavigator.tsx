import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeStack/HomeScreen';
import { Screen_Name } from './ScreenName';
import BottomTabNavigator from './BottomTabNavigator';
import AddForm from '../screens/HomeStack/AddForm';
import PayRoll from '../screens/HomeStack/PayRoll';
import QuickPin from '../screens/HomeStack/QuickPin';
import TimeSheet from '../screens/HomeStack/TimeSheet';

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
      <Stack.Screen name={Screen_Name.Home_Screen} component={HomeScreen} />
      {/* <Stack.Screen name={Screen_Name.AddForm_Screen} component={AddForm} />
      <Stack.Screen name={Screen_Name.PayRoll_Screen} component={PayRoll} />
      <Stack.Screen name={Screen_Name.QuickPin_Screen} component={QuickPin} />
      <Stack.Screen name={Screen_Name.TimeSheet_Screen} component={TimeSheet} /> */}
    </Stack.Navigator>
  );
};
export default HomeNavigator;
