// src/navigators/stacks/HomeStack.tsx
// Home Stack Navigator - Nested inside Home Tab

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeStackParamList } from '../types';
import { SCREENS } from '../screens';

// Screens
import Home from '../../screens/HomeStack/Home';
import Notifications from '../../screens/HomeStack/Noti';
import Menu from '../../screens/HomeStack/Menu';
import QuickPin from '../../screens/HomeStack/QuickPin';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack: React.FC = () => {
  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
      initialRouteName={SCREENS.HOME.INDEX}
    >
      <Stack.Screen name={SCREENS.HOME.INDEX} component={Home} />
      <Stack.Screen
        name={SCREENS.HOME.NOTIFICATIONS}
        component={Notifications}
      />
      <Stack.Screen name={SCREENS.HOME.MENU} component={Menu} />
      <Stack.Screen name={SCREENS.HOME.QUICK_PIN} component={QuickPin} />
    </Stack.Navigator>
  );
};

export default HomeStack;
