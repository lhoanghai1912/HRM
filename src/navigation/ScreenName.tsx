import ForgotPassword from '../screens/AuthStack/ForgotPassword';
import AddForm from '../screens/HomeStack/AddForm';
import ChangePassword from '../screens/HomeStack/ChangePassword';
import Details_Shift from '../screens/HomeStack/Shift';
import Menu from '../screens/HomeStack/Menu';
import QuickPin from '../screens/HomeStack/QuickPin';

import DetailField from '../components/DetailField';
import PayRoll from '../screens/HomeStack/PayRoll';
import App from '../App';
import { useTranslation } from 'react-i18next';
// import { AttendanceDrawer } from './DrawerNavigator';

export const Screen_Name = {
  //AuthStack

  Login: 'Login',
  Register: 'Register',
  SetPassword: 'SetPassword',
  ForgotPassword: 'ForgotPassword',

  Home: 'Home',
  HomeStack: 'HomeStack',
  Profile: 'Profile',
  PayRoll: 'PayRoll',
  QuickPin: 'QuickPin',
  AddForm: 'AddForm',
  Menu: 'Menu',
  Notification: 'Notification',
  AddEmployee: 'AddEmployee',
  OrnStruct: 'OrnStruct',
  User: 'User',
  ChangePassword: 'ChangePassword',

  //Drawer
  Employee_Drawer: 'Employee_Drawer',
  Attendance_Drawer: 'Attendance_Drawer',
  Appointment_Drawer: 'Appointment_Drawer',
  PayRoll_Drawer: 'PayRoll_Drawer',
  // Attendance

  //Employee
  Employee: 'Employee',
  Details_Employee: 'Details_Employee',
  Contract: 'Contract',
  Details_Contract: 'Details_Contract',
  Detail_Group: 'Detail_Group',
  Group: 'Group',
  Appointment: 'Appointment',
  Detail_Appointment: 'Detail_Appointment',
  Detail_Field: 'Detail_Field',
  Child_Field: 'Child_Field',

  //Shift
  Shift: 'Shift',
  Details_Shift: 'Details_Shift',

  //Attendance
  Attendance: 'Attendance',
  CheckInOut: 'CheckInOut',
  Application: 'Application',
  TimeSheet: 'Timesheet',
  Application_List: 'Application_List',
  Application_Create: 'Application_Create',

  Leave: 'Leave',
  Late_Early: 'Late_Early',
  Overtime: 'Overtime',
  Remote: 'Remote',
  Attendance_Update: 'Attendance_Update',
  Shift_Update: 'Shift_Update',
  Business_Trip: 'Business_Trip',
  TimeKeeping_App: 'TimeKeeping_App',
  Detail_TimeSheet: 'Detail_TimeSheet',

  //Other
  Splash: 'Splash',
  Loading: 'Loading',
  BottomTab_Navigator: 'BottomTab_Navigator',
  Drawer_Navigator: 'Drawer_Navigator',

  Test: 'Test',
};
