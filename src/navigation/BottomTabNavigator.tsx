import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Image } from 'react-native';
import icons from '../assets/icons';
import { Screen_Name } from './ScreenName';
import HomeScreen from '../screens/HomeStack/HomeScreen';
import { useSelector } from 'react-redux';
import { ms, spacing } from '../utils/spacing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LoginScreen from '../screens/AuthStack/Login';
import RegisterScreen from '../screens/AuthStack/Register';
import { colors } from '../utils/color';
import AddForm from '../screens/HomeStack/AddForm';
import PayRoll from '../screens/HomeStack/PayRoll';
import Profile from '../screens/HomeStack/Profile';
import QuickPin from '../screens/HomeStack/QuickPin';
import TimeSheet from '../screens/HomeStack/TimeSheet';

// Các màn hình cho các tab

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const { token } = useSelector((state: any) => state.user); // ✅ lấy token từ Redux
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          paddingVertical: spacing.medium,
          height: ms(49 + insets.bottom),
          paddingTop: spacing.small,
        },
        tabBarIcon: ({ focused }) => {
          const iconMap = {
            QuickPin_Screen: focused ? icons.list : icons.list,
            TimeSheet_Screen: focused ? icons.calendar : icons.calendar,
            AddForm_Screen: focused ? icons.add : icons.add,
            PayRoll_Screen: focused ? icons.dollar : icons.dollar,
            Profile_Screen: focused ? icons.username_focus : icons.username,
          };

          return (
            <Image
              source={iconMap[route.name]}
              style={{ width: ms(24), height: ms(24) }}
              resizeMode="contain"
            />
          );
        },
        tabBarActiveTintColor: '#820201',
        tabBarInactiveTintColor: '#888',
      })}
    >
      <Tab.Screen name={Screen_Name.QuickPin_Screen} component={QuickPin} />
      <Tab.Screen name={Screen_Name.TimeSheet_Screen} component={TimeSheet} />
      <Tab.Screen name={Screen_Name.AddForm_Screen} component={AddForm} />
      <Tab.Screen name={Screen_Name.PayRoll_Screen} component={PayRoll} />
      <Tab.Screen name={Screen_Name.Profile_Screen} component={Profile} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
