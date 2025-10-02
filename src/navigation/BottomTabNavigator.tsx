import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import icons from '../assets/icons';
import { Screen_Name } from './ScreenName';
import { useSelector } from 'react-redux';
import { ms, spacing } from '../utils/spacing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AddForm from '../screens/HomeStack/AddForm';
import PayRoll from '../screens/HomeStack/PayRoll';
import QuickPin from '../screens/HomeStack/QuickPin';
import TimeSheet from '../screens/HomeStack/TimeSheet';
import Home from '../screens/HomeStack/Home';
import { form_quickPinItems } from '../utils/form';
import { useTranslation } from 'react-i18next';

// Các màn hình cho các tab

const Tab = createBottomTabNavigator();
const BottomTabNavigator = ({ navigation }) => {
  const { t } = useTranslation();
  const { token } = useSelector((state: any) => state.user); // ✅ lấy token từ Redux
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
              Home: focused ? icons.home_focus : icons.home,
              QuickPin: focused ? icons.list_focus : icons.list,
              TimeSheet: focused ? icons.calendar_focus : icons.calendar,
              AddForm: focused ? icons.add_focus : icons.add,
              PayRoll: focused ? icons.dollar_focus : icons.dollar,
            };
            const labelKeyMap: Record<string, string> = {
              Home_Screen: 'label.screen_home',
              QuickPin_Screen: 'label.screen_quickpin',
              TimeSheet_Screen: 'label.screen_timesheet',
              AddForm_Screen: 'label.screen_add',
              PayRoll_Screen: 'label.screen_payroll',
            };
            return (
              <>
                <Image
                  source={iconMap[route.name]}
                  style={{ width: ms(24), height: ms(24) }}
                  resizeMode="contain"
                />
              </>
            );
          },
          tabBarActiveTintColor: '#820201',
          tabBarInactiveTintColor: '#888',
        })}
      >
        {/* <Tab.Screen name={Screen_Name.Home} component={HomeScreen} /> */}

        <Tab.Screen name={Screen_Name.Home} component={Home} />
        <Tab.Screen name={Screen_Name.TimeSheet} component={TimeSheet} />
        <Tab.Screen name={Screen_Name.AddForm} component={AddForm} />
        <Tab.Screen name={Screen_Name.PayRoll} component={PayRoll} />
        {/* 👇 Quick Pin: KHÔNG ĐIỀU HƯỚNG, CHỈ MỞ MODAL */}
        <Tab.Screen
          name={Screen_Name.QuickPin}
          component={Home} // dummy component
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
            tabPress: e => e.preventDefault(), // chặn navigate mặc định
          }}
        />
      </Tab.Navigator>

      {/* Modal chọn nhanh */}
      <QuickPin
        visible={showQuick}
        onClose={() => setShowQuick(false)}
        items={form_quickPinItems(t)}
        title="Chọn nhanh"
        onSelect={screen => {
          setShowQuick(false);
          // chọn xong mới điều hướng
          navigation.navigate(screen);
        }}
      />
    </>
  );
};

export default BottomTabNavigator;
