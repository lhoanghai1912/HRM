import ForgotPassword from '../screens/AuthStack/ForgotPassword';
import AddForm from '../screens/HomeStack/AddForm';
import ChangePassword from '../screens/HomeStack/ChangePassword';
import Details_Shift from '../screens/HomeStack/Shift';
import Menu from '../screens/HomeStack/Menu';
import QuickPin from '../screens/HomeStack/QuickPin';
import Leave from '../screens/HomeStack/Application/Leave';
import Remote from '../screens/HomeStack/Application/Remote';
import Attendance from '../screens/HomeStack/Check_InOut';
import Attendance_Update from '../screens/HomeStack/Application/Attendance_Update';
import Detail_Late_Early from '../screens/HomeStack/Application/Late_Early/Detail';
// import { AttendanceDrawer } from './DrawerNavigator';

export const Screen_Name = {
  //AuthStack
  Login: 'Login',
  Register: 'Register',
  SetPassword: 'SetPassword',
  ForgotPassword: 'ForgotPassword',

  Home: 'Home',
  Profile: 'Profile',
  TimeSheet: 'TimeSheet',
  PayRoll: 'PayRoll',
  QuickPin: 'QuickPin',
  AddForm: 'AddForm',
  Menu: 'Menu',
  Notification: 'Notification',
  AddEmployee: 'AddEmployee',
  OrnStruct: 'OrnStruct',
  User: 'User',
  ChangePassword: 'ChangePassword',

  // Attendance
  Attendance: 'Attendance',

  //Employee
  Employee: 'Employee',

  //Shift
  Shift: 'Shift',
  Details_Shift: 'Details_Shift',
  Employee_Drawer: 'Employee_Drawer',
  AttendanceDrawer: 'AttendanceDrawer',
  Check_Drawer: 'Check_Drawer',

  //Application
  Application: 'Application',
  Leave: 'Leave',
  Late_Early: 'Late_Early',
  Overtime: 'Overtime',
  Business_Trip: 'Trip',
  Remote: 'Remote',
  Attendance_Update: 'Attendance_Update',
  Shift_Update: 'Shift_Update',
  Detail_Late_Early: 'Detail_Late_Early',

  //Other
  Splash: 'Splash',
  Loading: 'Loading',
  BottomTab_Navigator: 'BottomTab_Navigator',
  Drawer_Navigator: 'Drawer_Navigator',

  Test: 'Test',
};
