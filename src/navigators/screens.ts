// src/navigators/screens.ts
// Centralized screen name constants

export const SCREENS = {
  // Auth Stack
  AUTH: {
    LOGIN: 'Login',
    REGISTER: 'Register',
    FORGOT_PASSWORD: 'ForgotPassword',
    SET_PASSWORD: 'SetPassword',
  },

  // Main Drawer
  DRAWER: {
    MAIN_TABS: 'MainTabs',
    SETTINGS: 'Settings',
  },

  // Bottom Tabs
  TABS: {
    HOME: 'HomeTab',
    ATTENDANCE: 'AttendanceTab',
    EMPLOYEE: 'EmployeeTab',
    PAYROLL: 'PayrollTab',
    PROFILE: 'ProfileTab',
  },

  // Home Stack
  HOME: {
    INDEX: 'Home',
    NOTIFICATIONS: 'Notifications',
    QUICK_PIN: 'QuickPin',
    MENU: 'Menu',
  },

  // Attendance Stack
  ATTENDANCE: {
    INDEX: 'Attendance',
    APPLICATION_LIST: 'ApplicationList',
    APPLICATION_CREATE: 'ApplicationCreate',
    APPLICATION_DETAIL: 'ApplicationDetail',
    TIMESHEET: 'Timesheet',
    TIMESHEET_DETAIL: 'TimesheetDetail',
    CHECKIN_OUT: 'CheckInOut',
    LEAVE: 'Leave',
    LATE_EARLY: 'LateEarly',
    OVERTIME: 'Overtime',
    REMOTE: 'Remote',
    ATTENDANCE_UPDATE: 'AttendanceUpdate',
    SHIFT_UPDATE: 'ShiftUpdate',
    BUSINESS_TRIP: 'BusinessTrip',
    TIMEKEEPING_APP: 'TimekeepingApp',
  },

  // Employee Stack
  EMPLOYEE: {
    INDEX: 'Employee',
    DETAIL: 'EmployeeDetail',
    ADD: 'AddEmployee',
    CONTRACT: 'Contract',
    CONTRACT_DETAIL: 'ContractDetail',
    GROUP: 'Group',
    GROUP_DETAIL: 'GroupDetail',
    APPOINTMENT: 'Appointment',
    APPOINTMENT_DETAIL: 'AppointmentDetail',
    ORG_STRUCT: 'OrgStruct',
  },

  // Payroll Stack
  PAYROLL: {
    INDEX: 'Payroll',
    DETAIL: 'PayrollDetail',
  },

  // Profile Stack
  PROFILE: {
    INDEX: 'Profile',
    CHANGE_PASSWORD: 'ChangePassword',
    EDIT_PROFILE: 'EditProfile',
  },

  // Shared/Common
  COMMON: {
    DETAIL_FIELD: 'DetailField',
    CHILD_FIELD: 'ChildField',
    ADD_FORM: 'AddForm',
    SHIFT: 'Shift',
    SHIFT_DETAIL: 'ShiftDetail',
  },
} as const;

// Type helpers
export type AuthScreens = (typeof SCREENS.AUTH)[keyof typeof SCREENS.AUTH];
export type HomeScreens = (typeof SCREENS.HOME)[keyof typeof SCREENS.HOME];
export type AttendanceScreens =
  (typeof SCREENS.ATTENDANCE)[keyof typeof SCREENS.ATTENDANCE];
export type EmployeeScreens =
  (typeof SCREENS.EMPLOYEE)[keyof typeof SCREENS.EMPLOYEE];
export type PayrollScreens =
  (typeof SCREENS.PAYROLL)[keyof typeof SCREENS.PAYROLL];
export type ProfileScreens =
  (typeof SCREENS.PROFILE)[keyof typeof SCREENS.PROFILE];
