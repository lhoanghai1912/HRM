import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, TouchableOpacity } from 'react-native';
import icons from '../assets/icons';
import { Screen_Name } from './ScreenName';
import { ms, spacing } from '../utils/spacing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { form_quickPinItems } from '../utils/form';
import { useTranslation } from 'react-i18next';
import HomeStack from './HomeStack';
import QuickPin from '../screens/HomeStack/QuickPin';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = ({ navigation }) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [showQuick, setShowQuick] = useState(false);

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: true,
          tabBarStyle: {
            paddingVertical: spacing.medium,
            paddingBottom: ms(spacing.medium + insets.bottom),
            height: ms(49 + insets.bottom),
          },
          tabBarIcon: ({ focused }) => {
            const iconMap = {
              [Screen_Name.Home]: focused ? icons.home_focus : icons.home,
              [Screen_Name.QuickPin]: focused ? icons.list_focus : icons.list,
            };
            return (
              <Image
                source={iconMap[route.name]}
                style={{ width: ms(24), height: ms(24) }}
                resizeMode="contain"
              />
            );
          },
          tabBarActiveTintColor: '#820201',
          tabBarInactiveTintColor: '#888',
        })}
      >
        <Tab.Screen name={Screen_Name.Home} component={HomeStack} />

        <Tab.Screen
          name={Screen_Name.QuickPin}
          component={HomeStack}
          options={{
            tabBarButton: props => (
              <TouchableOpacity
                activeOpacity={0.8}
                accessibilityRole="button"
                onPress={() => setShowQuick(true)}
                style={props.style}
              >
                {props.children}
              </TouchableOpacity>
            ),
          }}
          listeners={{
            tabPress: e => e.preventDefault(),
          }}
        />
      </Tab.Navigator>

      <QuickPin
        visible={showQuick}
        onClose={() => setShowQuick(false)}
        items={form_quickPinItems(t)}
        title="Chọn nhanh"
        onSelect={screen => {
          setShowQuick(false);
          navigation.navigate(screen);
        }}
      />
    </>
  );
};

export default BottomTabNavigator;
