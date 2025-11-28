import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Attendance from '../screens/HomeStack/Attendance Drawer';
import HomeStack from './HomeStack';
import { Screen_Name } from './ScreenName';
import Profile from '../screens/HomeStack/Profile';
import PayRoll from '../screens/HomeStack/PayRoll';
import Employee from '../screens/HomeStack/Employee Drawer/Employee';
import icons from '../assets/icons';
import { Image, Settings, TouchableOpacity, View } from 'react-native';
import { ms } from '../utils/spacing';
import Contract from '../screens/HomeStack/Employee Drawer/Contract';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DetailEmployee from '../screens/HomeStack/Employee Drawer/Employee/DetailEmployee';
import Detail_Field from '../components/DetailField';
import Child_Field from '../components/Child_Field';
import Group from '../screens/HomeStack/Employee Drawer/Group';
import DetailGroup from '../screens/HomeStack/Employee Drawer/Group/DetailGroup';
import DetailContract from '../screens/HomeStack/Employee Drawer/Contract/DetailContract';
import Home from '../screens/HomeStack/Home';
import HomeNavigator from './HomeNavigator';
import { navigate } from './RootNavigator';
import { useEffect, useState } from 'react';
import {
  getFocusedRouteNameFromRoute,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import AddEmployee from '../screens/HomeStack/AddEmployee';
import ListApplication from '../screens/HomeStack/Attendance Drawer/Application/Application_List';
import Application from '../screens/HomeStack/Attendance Drawer/Application';
import CreateApplication from '../screens/HomeStack/Attendance Drawer/Application/Application_Create';
import TimeSheet from '../screens/HomeStack/Attendance Drawer/TimeSheet';
import Attendance_Update from '../screens/HomeStack/Attendance Drawer/Application/Application_List/Attendance_Update/Attendance_Update';
import Business_Trip from '../screens/HomeStack/Attendance Drawer/Application/Application_List/Business_Trip/Business_Trip';
import Late_Early from '../screens/HomeStack/Attendance Drawer/Application/Application_List/Late_Early/Late_Early';
import Leave from '../screens/HomeStack/Attendance Drawer/Application/Application_List/Leave/Leave';
import Overtime from '../screens/HomeStack/Attendance Drawer/Application/Application_List/Overtime/Overtime';
import Remote from '../screens/HomeStack/Attendance Drawer/Application/Application_List/Remote/Remote';
import Shift_Update from '../screens/HomeStack/Attendance Drawer/Application/Application_List/Shift_Update/Shift_Update';
import TimeKeeping_App from '../screens/HomeStack/Attendance Drawer/Application/Application_List/TimeKeeping_App/TimeKeeping_App';
import QuickPin from '../screens/HomeStack/QuickPin';
import { form_application } from '../utils/form';
import { useTranslation } from 'react-i18next';
import App from '../App';
import DetailTimeSheet from '../screens/HomeStack/Attendance Drawer/TimeSheet/detail';
// import BottomTabNavigator from './BottomTabNavigator';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export function AttendanceTabs() {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useTranslation();
  const [showQuick, setShowQuick] = useState(false);
  // ---- LẤY ROUTE HIỆN TẠI CORRECT ----

  return (
    <>
      <Tab.Navigator
        id={undefined}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            const iconMap = {
              [Screen_Name.Home]: focused ? icons.home_focus : icons.home,
              [Screen_Name.Application_List]: focused
                ? icons.document_focus
                : icons.document,
              [Screen_Name.Application_Create]: focused
                ? icons.add_focus
                : icons.add,
              [Screen_Name.TimeSheet]: focused
                ? icons.calendar_focus
                : icons.calendar,
              abc: focused ? icons.apple : icons.apple,
            };

            return (
              <Image
                source={iconMap[route.name]}
                style={
                  route.name === Screen_Name.Application_Create
                    ? {
                        width: ms(45),
                        height: ms(45),
                        position: 'absolute',
                        bottom: '25%',
                      }
                    : { width: ms(24), height: ms(24) }
                }
              />
            );
          },
        })}
        initialRouteName={Screen_Name.Home}
      >
        <Tab.Screen name={Screen_Name.Home} component={Attendance} />
        <Tab.Screen
          name={Screen_Name.Application_List}
          component={ListApplicationStack}
        />

        <Tab.Screen
          name={Screen_Name.Application_Create}
          component={ApplicationCreateStack}
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
            tabPress: (e: any) => e.preventDefault(),
          }}
        />
        <Tab.Screen name={Screen_Name.TimeSheet} component={TimeSheetStack} />
        <Tab.Screen
          name="abc"
          component={View}
          listeners={{
            tabPress: (e: any) => e.preventDefault?.(),
          }}
        />
      </Tab.Navigator>
      <QuickPin
        visible={showQuick}
        onClose={() => setShowQuick(false)}
        items={form_application(t)}
        title="Chọn nhanh"
        onSelect={(screen, item) => {
          console.log('Selected Screen:', screen);
          console.log('Selected Item:', item);
          console.log('Item Title:', item.title);

          setShowQuick(false);
          navigate(Screen_Name.Application_Create, {
            screen: screen,
            params: { label: item.title, status: 'create' },
          }); // 👈 chỉ navigate Drawer thôi
        }}
      />
    </>
  );
}

export function EmployeeTabs() {
  return (
    <Tab.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <Tab.Screen name={Screen_Name.Employee} component={EmployeeStack} />

      <Tab.Screen name={Screen_Name.Contract} component={ContractStack} />
      {/* <Tab.Screen name={Screen_Name.Contract} component={ContractStack} /> */}
    </Tab.Navigator>
  );
}

export function ContractTabs() {
  return (
    <Tab.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <Tab.Screen name={Screen_Name.Contract} component={ContractStack} />
      {/* <Tab.Screen name={Screen_Name.Contract} component={ContractStack} /> */}
    </Tab.Navigator>
  );
}

export function PayrollTabs() {
  return (
    <Tab.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="PayrollHome" component={PayRoll} />
    </Tab.Navigator>
  );
}

export const EmployeeStack = () => (
  <Stack.Navigator
    id={undefined}
    screenOptions={{
      headerShown: false,
    }}
    initialRouteName={Screen_Name.Employee}
  >
    <Stack.Screen name={Screen_Name.Employee} component={Employee} />
    <Stack.Screen
      name={Screen_Name.Details_Employee}
      component={DetailEmployee}
    />
    <Stack.Screen name={Screen_Name.Detail_Field} component={Detail_Field} />
    <Stack.Screen name={Screen_Name.Child_Field} component={Child_Field} />
    <Stack.Screen name={Screen_Name.Detail_Group} component={DetailGroup} />
    <Stack.Screen name={Screen_Name.Group} component={Group} />
  </Stack.Navigator>
);

export const ContractStack = () => (
  <Stack.Navigator
    id={undefined}
    screenOptions={{ headerShown: false }}
    initialRouteName={Screen_Name.Contract}
  >
    <Stack.Screen name={Screen_Name.Contract} component={Contract} />
    <Stack.Screen
      name={Screen_Name.Details_Contract}
      component={DetailContract}
    />
    <Stack.Screen name={Screen_Name.Detail_Field} component={Detail_Field} />
    <Stack.Screen name={Screen_Name.Child_Field} component={Child_Field} />
    <Stack.Screen name={Screen_Name.Detail_Group} component={DetailGroup} />
    <Stack.Screen name={Screen_Name.Group} component={Group} />
  </Stack.Navigator>
);

export const ListApplicationStack = () => (
  <Stack.Navigator
    id={undefined}
    screenOptions={{ headerShown: false }}
    initialRouteName={Screen_Name.Application_List}
  >
    <Stack.Screen
      name={Screen_Name.Application_List}
      component={ListApplication}
    />
    <Stack.Screen
      name={Screen_Name.Attendance_Update}
      component={Attendance_Update}
    />
    <Stack.Screen name={Screen_Name.Business_Trip} component={Business_Trip} />
    <Stack.Screen name={Screen_Name.Late_Early} component={Late_Early} />
    <Stack.Screen name={Screen_Name.Leave} component={Leave} />
    <Stack.Screen name={Screen_Name.Overtime} component={Overtime} />
    <Stack.Screen name={Screen_Name.Remote} component={Remote} />
    <Stack.Screen name={Screen_Name.Shift_Update} component={Shift_Update} />
    <Stack.Screen
      name={Screen_Name.TimeKeeping_App}
      component={TimeKeeping_App}
    />
  </Stack.Navigator>
);

export const TimeSheetStack = () => (
  <Stack.Navigator
    id={undefined}
    screenOptions={{ headerShown: false }}
    initialRouteName={Screen_Name.TimeSheet}
  >
    <Stack.Screen name={Screen_Name.TimeSheet} component={TimeSheet} />
    <Stack.Screen
      name={Screen_Name.Detail_TimeSheet}
      component={DetailTimeSheet}
    />
  </Stack.Navigator>
);

export const ApplicationCreateStack = () => (
  <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
    <Stack.Screen name={Screen_Name.Leave} component={Leave} />
    <Stack.Screen name={Screen_Name.Overtime} component={Overtime} />
    <Stack.Screen name={Screen_Name.Business_Trip} component={Business_Trip} />
    <Stack.Screen name={Screen_Name.Late_Early} component={Late_Early} />
    <Stack.Screen name={Screen_Name.Remote} component={Remote} />
    <Stack.Screen name={Screen_Name.Shift_Update} component={Shift_Update} />
    <Stack.Screen
      name={Screen_Name.TimeKeeping_App}
      component={TimeKeeping_App}
    />
  </Stack.Navigator>
);

export const style = {
  addIcon: {
    width: ms(80),
    height: ms(80),
    position: 'absolute',
    top: -ms(15),
  },
};
