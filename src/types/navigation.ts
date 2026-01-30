// src/types/navigation.ts
// Navigation related types

import { NavigatorScreenParams } from '@react-navigation/native';

// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  SetPassword: { email: string; otpCode: string };
};

// Home Stack
export type HomeStackParamList = {
  Home: undefined;
  Profile: undefined;
  ChangePassword: undefined;
  Attendance_Drawer: undefined;
  Employee_Drawer: undefined;
  PayRoll_Drawer: undefined;
};

// Attendance Tab
export type AttendanceTabParamList = {
  Home: undefined;
  Application_List: undefined;
  Application_Create: undefined;
  TimeSheet: undefined;
};

// Employee Tab
export type EmployeeTabParamList = {
  Employee: undefined;
  Contract: undefined;
  Group: undefined;
  Appointment: undefined;
};

// Drawer Navigator
export type DrawerParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Attendance: NavigatorScreenParams<AttendanceTabParamList>;
  Employee: NavigatorScreenParams<EmployeeTabParamList>;
  PayRoll: undefined;
};

// Root Navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<DrawerParamList>;
  Splash: undefined;
};

// Type helper for useNavigation hook
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
