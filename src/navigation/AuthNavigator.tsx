import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Screen_Name } from './ScreenName';
import LoginScreen from '../screens/AuthStack/Login';
import RegisterScreen from '../screens/AuthStack/Register';
import ForgotPassword from '../screens/AuthStack/ForgotPassword';
import SetPassword from '../components/SetPassword';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name={Screen_Name.Login} component={LoginScreen} />
      <Stack.Screen name={Screen_Name.Register} component={RegisterScreen} />
      <Stack.Screen
        name={Screen_Name.ForgotPassword}
        component={ForgotPassword}
      />
      <Stack.Screen name={Screen_Name.SetPassword} component={SetPassword} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
