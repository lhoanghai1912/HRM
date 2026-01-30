// src/navigators/stacks/ProfileStack.tsx
// Profile Stack Navigator - Nested inside Profile Tab

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ProfileStackParamList } from '../types';
import { SCREENS } from '../screens';

// Screens
import Profile from '../../screens/HomeStack/Profile';
import ChangePassword from '../../screens/HomeStack/ChangePassword';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStack: React.FC = () => {
  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
      initialRouteName={SCREENS.PROFILE.INDEX}
    >
      <Stack.Screen name={SCREENS.PROFILE.INDEX} component={Profile} />
      <Stack.Screen
        name={SCREENS.PROFILE.CHANGE_PASSWORD}
        component={ChangePassword}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
