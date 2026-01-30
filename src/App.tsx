/**
 * HRM React Native App
 * Production-grade architecture with Redux, Context, and proper layering
 *
 * @format
 */
if (__DEV__) {
  require('../ReactotronConfig');
}

import './language'; // Import i18n before any component
import 'react-native-gesture-handler';

import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import { enableScreens } from 'react-native-screens';
import AppNavigator from './navigation/AppNavigator';
import store from './store';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import '../global.css';

enableScreens(); // Enable screens for navigation performance

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <ThemeProvider>
          <LanguageProvider>
            <StatusBar barStyle="light-content" translucent={false} />
            <SafeAreaProvider initialMetrics={initialWindowMetrics}>
              <AppNavigator />
              <Toast />
            </SafeAreaProvider>
          </LanguageProvider>
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
