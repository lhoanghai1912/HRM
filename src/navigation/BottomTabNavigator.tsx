import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, TouchableOpacity } from 'react-native';
import icons from '../assets/icons';
import { Screen_Name } from './ScreenName';
import { ms, spacing } from '../utils/spacing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { form_quickPinItems } from '../utils/form';
import { useTranslation } from 'react-i18next';
import HomeStack from './HomeStack';
import QuickPin from '../screens/HomeStack/QuickPin';
import { navigate } from './RootNavigator';
import Profile from '../screens/HomeStack/Profile';
import Attendance from '../screens/HomeStack/Attendance Drawer/Attendance Drawer';
import {
  AttendanceDrawer,
  AttendanceStack,
  EmployeeDrawer,
  EmployeeStack,
} from './DrawerNavigator';

const Tab = createBottomTabNavigator();

export const BottomTabNavigator = ({}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [showQuick, setShowQuick] = useState(false);

  return (
    <>
      <Tab.Navigator
        id={undefined}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: true,
          tabBarStyle: {
            paddingVertical: spacing.medium,
            paddingBottom: ms(spacing.medium + insets.bottom),
            height: ms(49 + insets.bottom),
          },
          tabBarIcon: ({ focused }) => {
            const iconMap = {
              [Screen_Name.Home]: focused ? icons.home_focus : icons.home,
              [Screen_Name.QuickPin]: focused ? icons.list_focus : icons.list,
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
        <Tab.Screen name={Screen_Name.Home} component={HomeStack} />

        <Tab.Screen
          name={Screen_Name.QuickPin}
          component={HomeStack}
          options={{
            tabBarButton: props => (
              <TouchableOpacity
                activeOpacity={0.8}
                accessibilityRole="button"
                onPress={() => setShowQuick(true)}
                style={props.style}
              >
                {props.children}
              </TouchableOpacity>
            ),
          }}
          listeners={{
            tabPress: (e: any) => e.preventDefault(),
          }}
        />
      </Tab.Navigator>

      <QuickPin
        visible={showQuick}
        onClose={() => setShowQuick(false)}
        items={form_quickPinItems(t)}
        title="Chọn nhanh"
        onSelect={screen => {
          setShowQuick(false);
          navigate(screen); // 👈 chỉ navigate Drawer thôi
        }}
      />
    </>
  );
};

export const BottomAttendTabNavigator = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [showQuick, setShowQuick] = useState(false);

  return (
    <>
      <Tab.Navigator
        id={undefined}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: true,
          tabBarStyle: {
            paddingVertical: spacing.medium,
            paddingBottom: ms(spacing.medium + insets.bottom),
            height: ms(49 + insets.bottom),
          },
          tabBarIcon: ({ focused }) => {
            const iconMap = {
              [Screen_Name.Attendance]: focused ? icons.home_focus : icons.home,
              [Screen_Name.Profile]: focused ? icons.add_focus : icons.add,
              [Screen_Name.Employee]: focused
                ? icons.username_focus
                : icons.username,
            };
            return (
              <Image
                source={iconMap[route.name]}
                style={{ width: ms(24), height: ms(24) }}
                resizeMode="contain"
              />
            );
          },
        })}
      >
        {/* NÚT HOME – navigate ra màn Home */}
        <Tab.Screen
          name={Screen_Name.Attendance}
          component={AttendanceStack}
          options={{
            tabBarButton: props => (
              <TouchableOpacity
                style={props.style}
                onPress={() => navigate(Screen_Name.Home)} // ⭐ quay về HomeStack
              >
                {props.children}
              </TouchableOpacity>
            ),
          }}
        />

        <Tab.Screen name={Screen_Name.Profile} component={Profile} />

        <Tab.Screen name={Screen_Name.Employee} component={EmployeeStack} />
      </Tab.Navigator>
    </>
  );
};
