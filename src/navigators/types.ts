// src/navigators/types.ts
// Navigation type definitions

import { NavigatorScreenParams, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// ============================================
// Auth Stack Types
// ============================================
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  SetPassword: { email: string; otpCode: string };
};

export type AuthStackNavigationProp =
  NativeStackNavigationProp<AuthStackParamList>;

// ============================================
// Home Stack Types (inside Home Tab)
// ============================================
export type HomeStackParamList = {
  Home: undefined;
  Notifications: undefined;
  QuickPin: undefined;
  Menu: undefined;
};

export type HomeStackNavigationProp =
  NativeStackNavigationProp<HomeStackParamList>;

// ============================================
// Attendance Stack Types (inside Attendance Tab)
// ============================================
export type AttendanceStackParamList = {
  Attendance: undefined;
  ApplicationList: undefined;
  ApplicationCreate: { type?: string };
  ApplicationDetail: { id: string };
  Timesheet: undefined;
  TimesheetDetail: { id: string };
  CheckInOut: undefined;
  Leave: undefined;
  LateEarly: undefined;
  Overtime: undefined;
  Remote: undefined;
  AttendanceUpdate: { id?: string };
  ShiftUpdate: { id?: string };
  BusinessTrip: undefined;
  TimekeepingApp: undefined;
};

export type AttendanceStackNavigationProp =
  NativeStackNavigationProp<AttendanceStackParamList>;

// ============================================
// Employee Stack Types (inside Employee Tab)
// ============================================
export type EmployeeStackParamList = {
  Employee: undefined;
  EmployeeDetail: { id: string };
  AddEmployee: undefined;
  Contract: undefined;
  ContractDetail: { id: string };
  Group: undefined;
  GroupDetail: { id: string };
  Appointment: undefined;
  AppointmentDetail: { id: string };
  OrgStruct: undefined;
  DetailField: { data: any; config: any };
  ChildField: { data: any; config: any };
};

export type EmployeeStackNavigationProp =
  NativeStackNavigationProp<EmployeeStackParamList>;

// ============================================
// Payroll Stack Types (inside Payroll Tab)
// ============================================
export type PayrollStackParamList = {
  Payroll: undefined;
  PayrollDetail: { id: string };
};

export type PayrollStackNavigationProp =
  NativeStackNavigationProp<PayrollStackParamList>;

// ============================================
// Profile Stack Types (inside Profile Tab)
// ============================================
export type ProfileStackParamList = {
  Profile: undefined;
  ChangePassword: undefined;
  EditProfile: undefined;
};

export type ProfileStackNavigationProp =
  NativeStackNavigationProp<ProfileStackParamList>;

// ============================================
// Bottom Tab Types
// ============================================
export type MainTabsParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  AttendanceTab: NavigatorScreenParams<AttendanceStackParamList>;
  EmployeeTab: NavigatorScreenParams<EmployeeStackParamList>;
  PayrollTab: NavigatorScreenParams<PayrollStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

export type MainTabsNavigationProp = BottomTabNavigationProp<MainTabsParamList>;

// ============================================
// Drawer Types
// ============================================
export type MainDrawerParamList = {
  MainTabs: NavigatorScreenParams<MainTabsParamList>;
  Settings: undefined;
};

export type MainDrawerNavigationProp =
  DrawerNavigationProp<MainDrawerParamList>;

// ============================================
// Root Stack Types
// ============================================
export type RootStackParamList = {
  Splash: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainDrawerParamList>;
};

export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

// ============================================
// Global Navigation Types (for useNavigation)
// ============================================
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

// ============================================
// Route Prop Types (for useRoute)
// ============================================
export type AuthRouteProp<T extends keyof AuthStackParamList> = RouteProp<
  AuthStackParamList,
  T
>;

export type HomeRouteProp<T extends keyof HomeStackParamList> = RouteProp<
  HomeStackParamList,
  T
>;

export type AttendanceRouteProp<T extends keyof AttendanceStackParamList> =
  RouteProp<AttendanceStackParamList, T>;

export type EmployeeRouteProp<T extends keyof EmployeeStackParamList> =
  RouteProp<EmployeeStackParamList, T>;

export type PayrollRouteProp<T extends keyof PayrollStackParamList> = RouteProp<
  PayrollStackParamList,
  T
>;

export type ProfileRouteProp<T extends keyof ProfileStackParamList> = RouteProp<
  ProfileStackParamList,
  T
>;
