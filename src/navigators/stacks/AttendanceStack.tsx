// src/navigators/stacks/AttendanceStack.tsx
// Attendance Stack Navigator - Nested inside Attendance Tab

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AttendanceStackParamList } from '../types';
import { SCREENS } from '../screens';

// Screens
import Attendance from '../../screens/HomeStack/Attendance Drawer';
import ListApplication from '../../screens/HomeStack/Attendance Drawer/Application/Application_List';
import CreateApplication from '../../screens/HomeStack/Attendance Drawer/Application/Application_Create';
import TimeSheet from '../../screens/HomeStack/Attendance Drawer/TimeSheet';
import DetailTimeSheet from '../../screens/HomeStack/Attendance Drawer/TimeSheet/detail';
import Leave from '../../screens/HomeStack/Attendance Drawer/Application/Application_List/Leave/Leave';
import Late_Early from '../../screens/HomeStack/Attendance Drawer/Application/Application_List/Late_Early/Late_Early';
import Overtime from '../../screens/HomeStack/Attendance Drawer/Application/Application_List/Overtime/Overtime';
import Remote from '../../screens/HomeStack/Attendance Drawer/Application/Application_List/Remote/Remote';
import Attendance_Update from '../../screens/HomeStack/Attendance Drawer/Application/Application_List/Attendance_Update/Attendance_Update';
import Shift_Update from '../../screens/HomeStack/Attendance Drawer/Application/Application_List/Shift_Update/Shift_Update';
import Business_Trip from '../../screens/HomeStack/Attendance Drawer/Application/Application_List/Business_Trip/Business_Trip';
import TimeKeeping_App from '../../screens/HomeStack/Attendance Drawer/Application/Application_List/TimeKeeping_App/TimeKeeping_App';

const Stack = createNativeStackNavigator<AttendanceStackParamList>();

const AttendanceStack: React.FC = () => {
  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
      initialRouteName={SCREENS.ATTENDANCE.INDEX}
    >
      <Stack.Screen name={SCREENS.ATTENDANCE.INDEX} component={Attendance} />
      <Stack.Screen
        name={SCREENS.ATTENDANCE.APPLICATION_LIST}
        component={ListApplication}
      />
      <Stack.Screen
        name={SCREENS.ATTENDANCE.APPLICATION_CREATE}
        component={CreateApplication}
      />
      <Stack.Screen name={SCREENS.ATTENDANCE.TIMESHEET} component={TimeSheet} />
      <Stack.Screen
        name={SCREENS.ATTENDANCE.TIMESHEET_DETAIL}
        component={DetailTimeSheet}
      />
      <Stack.Screen name={SCREENS.ATTENDANCE.LEAVE} component={Leave} />
      <Stack.Screen
        name={SCREENS.ATTENDANCE.LATE_EARLY}
        component={Late_Early}
      />
      <Stack.Screen name={SCREENS.ATTENDANCE.OVERTIME} component={Overtime} />
      <Stack.Screen name={SCREENS.ATTENDANCE.REMOTE} component={Remote} />
      <Stack.Screen
        name={SCREENS.ATTENDANCE.ATTENDANCE_UPDATE}
        component={Attendance_Update}
      />
      <Stack.Screen
        name={SCREENS.ATTENDANCE.SHIFT_UPDATE}
        component={Shift_Update}
      />
      <Stack.Screen
        name={SCREENS.ATTENDANCE.BUSINESS_TRIP}
        component={Business_Trip}
      />
      <Stack.Screen
        name={SCREENS.ATTENDANCE.TIMEKEEPING_APP}
        component={TimeKeeping_App}
      />
    </Stack.Navigator>
  );
};

export default AttendanceStack;
