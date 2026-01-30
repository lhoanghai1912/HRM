// src/constants/screens.ts
// Screen names as constants for type-safe navigation

export const SCREENS = {
  // Auth Stack
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',
  SET_PASSWORD: 'SetPassword',

  // Home Stack
  HOME: 'Home',
  PROFILE: 'Profile',
  CHANGE_PASSWORD: 'ChangePassword',
  NOTIFICATIONS: 'Notifications',
  MENU: 'Menu',
  ADD_EMPLOYEE: 'AddEmployee',
  ORG_STRUCT: 'OrgStruct',

  // Drawers
  ATTENDANCE_DRAWER: 'Attendance_Drawer',
  EMPLOYEE_DRAWER: 'Employee_Drawer',
  PAYROLL_DRAWER: 'PayRoll_Drawer',

  // Tabs
  ATTENDANCE: 'Attendance',
  EMPLOYEE: 'Employee',
  PAYROLL: 'PayRoll',

  // Application
  APPLICATION_LIST: 'Application_List',
  APPLICATION_CREATE: 'Application_Create',
  APPLICATION_DETAIL: 'Application_Detail',

  // TimeSheet
  TIMESHEET: 'TimeSheet',
  TIMESHEET_DETAIL: 'TimeSheet_Detail',

  // Employee Management
  EMPLOYEE_DETAIL: 'Employee_Detail',
  CONTRACT: 'Contract',
  CONTRACT_DETAIL: 'Contract_Detail',
  GROUP: 'Group',
  GROUP_DETAIL: 'Group_Detail',
  APPOINTMENT: 'Appointment',
  APPOINTMENT_DETAIL: 'Appointment_Detail',

  // Shift
  SHIFT: 'Shift',
  SHIFT_DETAIL: 'Shift_Detail',

  // Others
  QUICK_PIN: 'QuickPin',
  CHILD_FIELD: 'Child_Field',
  DETAIL_FIELD: 'Detail_Field',
} as const;

// Type for screen names
export type ScreenName = (typeof SCREENS)[keyof typeof SCREENS];
