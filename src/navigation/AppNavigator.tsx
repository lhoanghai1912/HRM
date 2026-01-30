import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { navigationRef } from './RootNavigator';
import HomeNavigator from './HomeNavigator';
import SplashScreen from '../screens/Splash';
import { useAppSelector } from '../store';
import AuthNavigator from './AuthNavigator';
const AppNavigator = () => {
  const [showSplash, setShowSplash] = useState(true);
  const token = useAppSelector(state => state.auth.token);
  useEffect(() => {
    // delay splash 1.5s để hiển thị logo
    const timeout = setTimeout(() => {
      setShowSplash(false);
    }, 1500);
    return () => clearTimeout(timeout);
  }, []);

  if (showSplash) {
    return <SplashScreen onAnimationEnd={() => setShowSplash(false)} />;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      {token ? <HomeNavigator /> : <AuthNavigator />}
      {/* <AuthNavigator /> */}
    </NavigationContainer>
  );
};

export default AppNavigator;
