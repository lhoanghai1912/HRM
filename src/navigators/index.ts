// src/navigators/index.ts
// Central export for all navigators

export { default as RootNavigator } from './RootNavigator';
export { default as AuthStack } from './AuthStack';
export { default as MainDrawer } from './MainDrawer';
export { default as MainTabs } from './MainTabs';

// Stack per tab exports
export { default as HomeStack } from './stacks/HomeStack';
export { default as AttendanceStack } from './stacks/AttendanceStack';
export { default as EmployeeStack } from './stacks/EmployeeStack';
export { default as PayrollStack } from './stacks/PayrollStack';
export { default as ProfileStack } from './stacks/ProfileStack';

// Navigation utilities
export {
  navigationRef,
  navigate,
  goBack,
  resetRoot,
} from './NavigationService';

// Screen names
export { SCREENS } from './screens';

// Navigation types
export type * from './types';
