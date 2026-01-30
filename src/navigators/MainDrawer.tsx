// src/navigators/MainDrawer.tsx
// Main Drawer Navigator - Container for authenticated users

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { useTranslation } from 'react-i18next';

import { MainDrawerParamList } from './types';
import { SCREENS } from './screens';
import { useTheme, useThemedColors } from '../contexts';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logoutThunk } from '../store/slices';
import { spacing, fontSize, borderRadius } from '../constants/dimensions';
import icons from '../assets/icons';

import MainTabs from './MainTabs';

const Drawer = createDrawerNavigator<MainDrawerParamList>();

// Custom Drawer Content
const CustomDrawerContent: React.FC<DrawerContentComponentProps> = props => {
  const { t } = useTranslation();
  const colors = useThemedColors();
  const { isDark, toggleTheme } = useTheme();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth?.user);

  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk()).unwrap();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={[
        styles.drawerContent,
        { backgroundColor: colors.background },
      ]}
    >
      {/* User Profile Section */}
      <View
        style={[styles.profileSection, { borderBottomColor: colors.border }]}
      >
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={[styles.avatarText, { color: colors.white }]}>
            {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
          </Text>
        </View>
        <Text style={[styles.userName, { color: colors.text }]}>
          {user?.fullName || user?.username || 'User'}
        </Text>
        <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
          {user?.email || ''}
        </Text>
      </View>

      {/* Navigation Items */}
      <View style={styles.menuSection}>
        <DrawerItemList {...props} />
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Theme Toggle */}
        <TouchableOpacity
          style={[styles.bottomItem, { borderTopColor: colors.border }]}
          onPress={toggleTheme}
        >
          <Text style={[styles.bottomItemText, { color: colors.text }]}>
            {isDark
              ? '☀️ ' + t('settings.lightMode', 'Chế độ sáng')
              : '🌙 ' + t('settings.darkMode', 'Chế độ tối')}
          </Text>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.red }]}
          onPress={handleLogout}
        >
          <Text style={[styles.logoutText, { color: colors.white }]}>
            {t('auth.logout', 'Đăng xuất')}
          </Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const MainDrawer: React.FC = () => {
  const colors = useThemedColors();
  const { t } = useTranslation();

  return (
    <Drawer.Navigator
      id={undefined}
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: colors.background,
          width: '75%',
        },
        drawerActiveBackgroundColor: colors.primary + '20',
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.text,
        drawerLabelStyle: {
          fontSize: fontSize.md,
        },
      }}
    >
      <Drawer.Screen
        name={SCREENS.DRAWER.MAIN_TABS}
        component={MainTabs}
        options={{
          drawerLabel: t('nav.home', 'Trang chủ'),
          drawerIcon: ({ color, size }) => (
            <Image
              source={icons.home}
              style={{ width: size, height: size, tintColor: color }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  profileSection: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: fontSize.sm,
  },
  menuSection: {
    flex: 1,
    paddingTop: spacing.md,
  },
  bottomSection: {
    padding: spacing.md,
  },
  bottomItem: {
    paddingVertical: spacing.md,
    borderTopWidth: 1,
  },
  bottomItemText: {
    fontSize: fontSize.md,
  },
  logoutButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: '600',
  },
});

export default MainDrawer;
