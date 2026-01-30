// src/navigators/RootNavigator.tsx
// Root Navigator - decides between Auth and Main based on token

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAppSelector, useAppDispatch } from '../store/hooks';
import { restoreAuthThunk } from '../store/slices';
import { navigationRef } from './NavigationService';
import { RootStackParamList } from './types';

import AuthStack from './AuthStack';
import MainDrawer from './MainDrawer';
import SplashScreen from '../screens/Splash';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  // Get auth state from Redux
  const token = useAppSelector(state => state.auth?.token);
  const isAuthenticated = !!token;

  // Check for existing session on app start
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        await dispatch(restoreAuthThunk()).unwrap();
      } catch (error) {
        // Restore failed, user needs to login
        console.log('No existing session found');
      } finally {
        setIsLoading(false);
      }
    };

    // Show splash for minimum time
    const timer = setTimeout(() => {
      bootstrapAsync();
    }, 1500);

    return () => clearTimeout(timer);
  }, [dispatch]);

  // Show splash screen while loading
  if (isLoading) {
    return <SplashScreen onAnimationEnd={() => setIsLoading(false)} />;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        id={undefined}
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        {isAuthenticated ? (
          // User is signed in - show main app
          <Stack.Screen
            name="Main"
            component={MainDrawer}
            options={{ animationTypeForReplace: 'push' }}
          />
        ) : (
          // User is NOT signed in - show auth screens
          <Stack.Screen
            name="Auth"
            component={AuthStack}
            options={{ animationTypeForReplace: 'pop' }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
