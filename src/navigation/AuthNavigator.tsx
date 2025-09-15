import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Screen_Name } from './ScreenName';
import LoginScreen from '../screens/AuthStack/Login';
import RegisterScreen from '../screens/AuthStack/Register';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name={Screen_Name.Login_Screen} component={LoginScreen} />
      <Stack.Screen name={Screen_Name.Register_Screen} component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
