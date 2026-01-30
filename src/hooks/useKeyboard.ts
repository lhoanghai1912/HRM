// src/hooks/useKeyboard.ts
// Hook for keyboard visibility and height

import { useState, useEffect } from 'react';
import { Keyboard, KeyboardEvent, Platform } from 'react-native';

interface UseKeyboardReturn {
  isKeyboardVisible: boolean;
  keyboardHeight: number;
}

/**
 * Hook to track keyboard visibility and height
 * Useful for adjusting UI when keyboard appears
 */
export function useKeyboard(): UseKeyboardReturn {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const handleKeyboardShow = (event: KeyboardEvent) => {
      setIsKeyboardVisible(true);
      setKeyboardHeight(event.endCoordinates.height);
    };

    const handleKeyboardHide = () => {
      setIsKeyboardVisible(false);
      setKeyboardHeight(0);
    };

    const showSubscription = Keyboard.addListener(
      showEvent,
      handleKeyboardShow,
    );
    const hideSubscription = Keyboard.addListener(
      hideEvent,
      handleKeyboardHide,
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return {
    isKeyboardVisible,
    keyboardHeight,
  };
}

/**
 * Hook to dismiss keyboard
 * Returns a function to dismiss the keyboard
 */
export function useDismissKeyboard(): () => void {
  return Keyboard.dismiss;
}
