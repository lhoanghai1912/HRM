// src/navigators/stacks/EmployeeStack.tsx
// Employee Stack Navigator - Nested inside Employee Tab

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { EmployeeStackParamList } from '../types';
import { SCREENS } from '../screens';

// Screens
import Employee from '../../screens/HomeStack/Employee Drawer/Employee';
import DetailEmployee from '../../screens/HomeStack/Employee Drawer/Employee/DetailEmployee';
import AddEmployee from '../../screens/HomeStack/AddEmployee';
import Contract from '../../screens/HomeStack/Employee Drawer/Contract';
import DetailContract from '../../screens/HomeStack/Employee Drawer/Contract/DetailContract';
import Group from '../../screens/HomeStack/Employee Drawer/Group';
import DetailGroup from '../../screens/HomeStack/Employee Drawer/Group/DetailGroup';
import Appointment from '../../screens/HomeStack/Employee Drawer/Appointment';
import DetailAppointment from '../../screens/HomeStack/Employee Drawer/Appointment/DetailAppointment';
import OrgStruct from '../../screens/HomeStack/OrgStruct';
import DetailField from '../../components/DetailField';
import ChildField from '../../components/Child_Field';

const Stack = createNativeStackNavigator<EmployeeStackParamList>();

const EmployeeStack: React.FC = () => {
  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
      initialRouteName={SCREENS.EMPLOYEE.INDEX}
    >
      <Stack.Screen name={SCREENS.EMPLOYEE.INDEX} component={Employee} />
      <Stack.Screen name={SCREENS.EMPLOYEE.DETAIL} component={DetailEmployee} />
      <Stack.Screen name={SCREENS.EMPLOYEE.ADD} component={AddEmployee} />
      <Stack.Screen name={SCREENS.EMPLOYEE.CONTRACT} component={Contract} />
      <Stack.Screen
        name={SCREENS.EMPLOYEE.CONTRACT_DETAIL}
        component={DetailContract}
      />
      <Stack.Screen name={SCREENS.EMPLOYEE.GROUP} component={Group} />
      <Stack.Screen
        name={SCREENS.EMPLOYEE.GROUP_DETAIL}
        component={DetailGroup}
      />
      <Stack.Screen
        name={SCREENS.EMPLOYEE.APPOINTMENT}
        component={Appointment}
      />
      <Stack.Screen
        name={SCREENS.EMPLOYEE.APPOINTMENT_DETAIL}
        component={DetailAppointment}
      />
      <Stack.Screen name={SCREENS.EMPLOYEE.ORG_STRUCT} component={OrgStruct} />
      <Stack.Screen name="DetailField" component={DetailField} />
      <Stack.Screen name="ChildField" component={ChildField} />
    </Stack.Navigator>
  );
};

export default EmployeeStack;
