// src/navigators/NavigationService.ts
// Navigation service for navigating outside of React components

import {
  createNavigationContainerRef,
  CommonActions,
  StackActions,
} from '@react-navigation/native';
import { RootStackParamList } from './types';

// Navigation container ref
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

/**
 * Navigate to a screen
 */
export function navigate(name: string, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as any, params as any);
  } else {
    // Queue navigation for when ref is ready
    console.warn('Navigation not ready, queuing navigation to:', name);
  }
}

/**
 * Go back to previous screen
 */
export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

/**
 * Reset navigation state to a specific route
 */
export function resetRoot(routeName: string, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: routeName, params }],
      }),
    );
  }
}

/**
 * Navigate to a screen and reset the stack
 */
export function navigateAndReset(name: string, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name, params }],
      }),
    );
  }
}

/**
 * Push a new screen onto the stack
 */
export function push(name: string, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(name, params));
  }
}

/**
 * Pop to top of the stack
 */
export function popToTop() {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.popToTop());
  }
}

/**
 * Replace current screen
 */
export function replace(name: string, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.replace(name, params));
  }
}

/**
 * Get current route name
 */
export function getCurrentRouteName(): string | undefined {
  if (navigationRef.isReady()) {
    return navigationRef.getCurrentRoute()?.name;
  }
  return undefined;
}

/**
 * Check if can go back
 */
export function canGoBack(): boolean {
  if (navigationRef.isReady()) {
    return navigationRef.canGoBack();
  }
  return false;
}
