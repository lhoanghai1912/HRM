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
import { quickPinItems } from '../utils/menu';

// Các màn hình cho các tab

const Tab = createBottomTabNavigator();

const BottomTabNavigator = ({ navigation }) => {
  const { token } = useSelector((state: any) => state.user); // ✅ lấy token từ Redux
  const insets = useSafeAreaInsets();
  const [showQuick, setShowQuick] = useState(false);

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            paddingVertical: spacing.medium,
            height: ms(49 + insets.bottom),
            paddingTop: spacing.small,
          },
          tabBarIcon: ({ focused }) => {
            const iconMap = {
              Home_Screen: focused ? icons.home_focus : icons.home,
              QuickPin_Screen: focused ? icons.list : icons.list,
              TimeSheet_Screen: focused ? icons.calendar : icons.calendar,
              AddForm_Screen: focused ? icons.add : icons.add,
              PayRoll_Screen: focused ? icons.dollar : icons.dollar,
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
        {/* <Tab.Screen name={Screen_Name.Home_Screen} component={HomeScreen} /> */}

        <Tab.Screen name={Screen_Name.Home_Screen} component={Home} />
        <Tab.Screen name={Screen_Name.TimeSheet_Screen} component={TimeSheet} />
        <Tab.Screen name={Screen_Name.AddForm_Screen} component={AddForm} />
        <Tab.Screen name={Screen_Name.PayRoll_Screen} component={PayRoll} />
        {/* 👇 Quick Pin: KHÔNG ĐIỀU HƯỚNG, CHỈ MỞ MODAL */}
        <Tab.Screen
          name={Screen_Name.QuickPin_Screen}
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
        items={quickPinItems}
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
