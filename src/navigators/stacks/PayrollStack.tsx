// src/navigators/stacks/PayrollStack.tsx
// Payroll Stack Navigator - Nested inside Payroll Tab

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PayrollStackParamList } from '../types';
import { SCREENS } from '../screens';

// Screens
import PayRoll from '../../screens/HomeStack/PayRoll';

const Stack = createNativeStackNavigator<PayrollStackParamList>();

const PayrollStack: React.FC = () => {
  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
      initialRouteName={SCREENS.PAYROLL.INDEX}
    >
      <Stack.Screen name={SCREENS.PAYROLL.INDEX} component={PayRoll} />
      {/* Add PayrollDetail screen when available */}
    </Stack.Navigator>
  );
};

export default PayrollStack;
