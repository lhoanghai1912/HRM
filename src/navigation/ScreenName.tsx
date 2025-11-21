import ForgotPassword from '../screens/AuthStack/ForgotPassword';
import AddForm from '../screens/HomeStack/AddForm';
import ChangePassword from '../screens/HomeStack/ChangePassword';
import Details_Shift from '../screens/HomeStack/Shift';
import Menu from '../screens/HomeStack/Menu';
import QuickPin from '../screens/HomeStack/QuickPin';
import Leave from '../screens/HomeStack/Attendance Drawer/Leave';
import Remote from '../screens/HomeStack/Attendance Drawer/Remote';
import Attendance from '../screens/HomeStack/Attendance Drawer/Attendance Drawer';
import Attendance_Update from '../screens/HomeStack/Attendance Drawer/Attendance_Update';
import Detail_Late_Early from '../screens/HomeStack/Attendance Drawer/Late_Early/Detail';
import DetailField from '../components/DetailField';

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

  //Drawer
  Employee_Drawer: 'Employee_Drawer',
  Attendance_Drawer: 'Attendance_Drawer',
  Appointment_Drawer: 'Appointment_Drawer',

  // Attendance
  Attendance: 'Attendance',

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

  PayRoll_Drawer: 'PayRoll_Drawer',

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
  BottomAttendTab_Navigator: 'BottomAttendTab_Navigator',
  Drawer_Navigator: 'Drawer_Navigator',

  Test: 'Test',
};
