import React from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigationState } from '@react-navigation/native';

import { Screen_Name } from './ScreenName';

import { AttendanceDrawer, EmployeeDrawer } from './DrawerNavigator';
import {
  BottomAttendTabNavigator,
  BottomTabNavigator,
} from './BottomTabNavigator';

const Stack = createNativeStackNavigator();

const HomeNavigator = () => {
  // Lấy route hiện tại
  const currentRoute = useNavigationState(state => {
    const route = state.routes[state.index];
    return route?.name;
  });

  // Khi mở AttendanceDrawer → dùng bottomAttendTab
  const isAttendanceMode = currentRoute === Screen_Name.Attendance_Drawer;

  return (
    <View style={{ flex: 1 }}>
      {/* MAIN STACK */}
      <View style={{ flex: 1 }}>
        <Stack.Navigator
          id={undefined}
          screenOptions={{ headerShown: false }}
          initialRouteName={Screen_Name.BottomTab_Navigator}
        >
          {/* HOME */}
          <Stack.Screen
            name={Screen_Name.BottomTab_Navigator}
            component={BottomTabNavigator}
          />

          {/* DRAWERS */}
          <Stack.Screen
            name={Screen_Name.Employee_Drawer}
            component={EmployeeDrawer}
          />

          <Stack.Screen
            name={Screen_Name.Attendance_Drawer}
            component={AttendanceDrawer}
          />
        </Stack.Navigator>
      </View>

      {/* DYNAMIC TAB BAR */}
      <View style={{ height: 60 }}>
        {isAttendanceMode ? (
          <BottomAttendTabNavigator />
        ) : (
          <BottomTabNavigator />
        )}
      </View>
    </View>
  );
};

export default HomeNavigator;
