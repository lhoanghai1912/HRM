import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { navigationRef } from './RootNavigator';
import HomeNavigator from './HomeNavigator';
import SplashScreen from '../screens/Splash';
import { useSelector } from 'react-redux';
import AuthNavigator from './AuthNavigator';
import BottomTabNavigator from './BottomTabNavigator';
const AppNavigator = () => {
  const [showSplash, setShowSplash] = useState(true);
  const token = useSelector((state: any) => state.user.token);
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
      {/* { token ? <HomeNavigator /> : <AuthNavigator/>} */}
      <AuthNavigator />
    </NavigationContainer>
  );
};

export default AppNavigator;
