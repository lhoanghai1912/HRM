// src/navigators/AuthStack.tsx
// Authentication Stack Navigator

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthStackParamList } from './types';
import { SCREENS } from './screens';

// Auth Screens
import LoginScreen from '../screens/AuthStack/Login';
import RegisterScreen from '../screens/AuthStack/Register';
import ForgotPasswordScreen from '../screens/AuthStack/ForgotPassword';
import SetPasswordScreen from '../components/SetPassword';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
      }}
      initialRouteName={SCREENS.AUTH.LOGIN}
    >
      <Stack.Screen name={SCREENS.AUTH.LOGIN} component={LoginScreen} />
      <Stack.Screen name={SCREENS.AUTH.REGISTER} component={RegisterScreen} />
      <Stack.Screen
        name={SCREENS.AUTH.FORGOT_PASSWORD}
        component={ForgotPasswordScreen}
      />
      <Stack.Screen
        name={SCREENS.AUTH.SET_PASSWORD}
        component={SetPasswordScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
