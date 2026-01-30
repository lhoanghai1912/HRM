// src/navigators/MainTabs.tsx
// Bottom Tab Navigator - Main tabs for the app

import React from 'react';
import { Image, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';

import { MainTabsParamList } from './types';
import { SCREENS } from './screens';
import { useThemedColors } from '../contexts';
import { ms } from '../utils/spacing';
import { fontSize } from '../constants/dimensions';
import icons from '../assets/icons';

// Stack navigators for each tab
import HomeStack from './stacks/HomeStack';
import AttendanceStack from './stacks/AttendanceStack';
import EmployeeStack from './stacks/EmployeeStack';
import PayrollStack from './stacks/PayrollStack';
import ProfileStack from './stacks/ProfileStack';

const Tab = createBottomTabNavigator<MainTabsParamList>();

// Tab bar icon component
interface TabIconProps {
  focused: boolean;
  iconDefault: any;
  iconFocused: any;
  size?: number;
  color?: string;
}

const TabIcon: React.FC<TabIconProps> = ({
  focused,
  iconDefault,
  iconFocused,
  size = 24,
  color,
}) => (
  <Image
    source={focused ? iconFocused : iconDefault}
    style={{ width: ms(size), height: ms(size), tintColor: color }}
    resizeMode="contain"
  />
);

const MainTabs: React.FC = () => {
  const { t } = useTranslation();
  const colors = useThemedColors();

  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          height: Platform.OS === 'ios' ? 88 : 64,
        },
        tabBarLabelStyle: {
          fontSize: fontSize.xs,
          marginTop: 4,
        },
      }}
      initialRouteName={SCREENS.TABS.HOME}
    >
      <Tab.Screen
        name={SCREENS.TABS.HOME}
        component={HomeStack}
        options={{
          tabBarLabel: t('nav.home', 'Trang chủ'),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              iconDefault={icons.home}
              iconFocused={icons.home_focus}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name={SCREENS.TABS.ATTENDANCE}
        component={AttendanceStack}
        options={{
          tabBarLabel: t('nav.attendance', 'Chấm công'),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              iconDefault={icons.calendar}
              iconFocused={icons.calendar_focus}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name={SCREENS.TABS.EMPLOYEE}
        component={EmployeeStack}
        options={{
          tabBarLabel: t('nav.employee', 'Nhân viên'),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              iconDefault={icons.document}
              iconFocused={icons.document_focus}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name={SCREENS.TABS.PAYROLL}
        component={PayrollStack}
        options={{
          tabBarLabel: t('nav.payroll', 'Bảng lương'),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              iconDefault={icons.document}
              iconFocused={icons.document_focus}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name={SCREENS.TABS.PROFILE}
        component={ProfileStack}
        options={{
          tabBarLabel: t('nav.profile', 'Cá nhân'),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              iconDefault={icons.home}
              iconFocused={icons.home_focus}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({});

export default MainTabs;
