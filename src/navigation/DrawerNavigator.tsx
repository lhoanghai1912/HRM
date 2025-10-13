import {
  DrawerContentScrollView,
  DrawerItem,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import { Screen_Name } from './ScreenName';
import Details_Shift from '../screens/HomeStack/Check_InOut/Shift';
import Profile from '../screens/HomeStack/Profile';
import { Image, Text, View } from 'react-native';
import Attendance from '../screens/HomeStack/Check_InOut';
import { use } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../utils/color';
import { ms } from '../utils/spacing';
import icons from '../assets/icons';

const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
  const inits = useSafeAreaInsets();
  return (
    <Drawer.Navigator
      id={undefined}
      screenOptions={({ route }) => ({
        headerShown: false,
        drawerStyle: { width: '60%' },
        drawerActiveTintColor: colors.blue,
        // drawerActiveBackgroundColor: colors.blue,
        // drawerInactiveBackgroundColor: colors.Gray,
        // drawerLabelStyle: {
        //   color: 'black',
        // },
        drawerIcon: ({ focused }) => {
          const iconMap = {
            [Screen_Name.Attendance]: focused ? icons.home_focus : icons.home,
            [Screen_Name.Profile]: focused ? icons.list_focus : icons.list,
          };
          return (
            <Image
              source={iconMap[route.name]}
              style={{ width: ms(24), height: ms(24) }}
              resizeMode="contain"
            />
          );
        },
      })}
      initialRouteName={Screen_Name.Attendance}

      // drawerContent={() => (
      //   <View>
      //     <Text>Drawer Content</Text>
      //   </View>
      // )}
    >
      <Drawer.Screen name={Screen_Name.Attendance} component={Attendance} />
      <Drawer.Screen name={Screen_Name.Profile} component={Profile} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

// import {
//   DrawerContentScrollView,
//   DrawerItem,
//   createDrawerNavigator,
// } from '@react-navigation/drawer';
// import { Screen_Name } from './ScreenName';
// import Profile from '../screens/HomeStack/Profile';
// import Attendance from '../screens/HomeStack/Check_InOut';
// import Setting from '../screens/HomeStack/Setting';
// import { useNavigation, DrawerActions } from '@react-navigation/native';
// import { Image, Text, View } from 'react-native';
// import { colors } from '../utils/color';
// import { ms } from '../utils/spacing';
// import icons from '../assets/icons';
// import AddEmployee from '../screens/HomeStack/AddEmployee';
// import Details_Shift from '../screens/HomeStack/Check_InOut/Shift';

// const Drawer = createDrawerNavigator();

// const CustomDrawerContent = (props: any) => {
//   const { state, navigation } = props;
//   const currentRoute = state.routeNames[state.index];

//   return (
//     <DrawerContentScrollView {...props}>
//       {currentRoute === Screen_Name.Attendance && (
//         <>
//           <DrawerItem
//             label="Attendance"
//             icon={({ focused }) => (
//               <Image
//                 source={focused ? icons.home_focus : icons.home}
//                 style={{ width: ms(24), height: ms(24) }}
//               />
//             )}
//             onPress={() => navigation.navigate(Screen_Name.Attendance)}
//           />
//           <DrawerItem
//             label="Profile"
//             icon={({ focused }) => (
//               <Image
//                 source={focused ? icons.list_focus : icons.list}
//                 style={{ width: ms(24), height: ms(24) }}
//               />
//             )}
//             onPress={() => navigation.navigate(Screen_Name.Profile)}
//           />
//         </>
//       )}
//       {currentRoute === Screen_Name.Details_Shift && (
//         <>
//           <DrawerItem
//             label="Shift Details"
//             icon={({ focused }) => (
//               <Image
//                 source={focused ? icons.home_focus : icons.home}
//                 style={{ width: ms(24), height: ms(24) }}
//               />
//             )}
//             onPress={() => navigation.navigate(Screen_Name.Details_Shift)}
//           />
//           <DrawerItem
//             label="Setting"
//             icon={({ focused }) => (
//               <Image
//                 source={icons.settings}
//                 style={{ width: ms(24), height: ms(24) }}
//               />
//             )}
//             onPress={() => navigation.navigate(Screen_Name.Setting)}
//           />
//         </>
//       )}
//     </DrawerContentScrollView>
//   );
// };

// const DrawerNavigator = () => {
//   return (
//     <Drawer.Navigator
//       id={undefined}
//       // initialRouteName={Screen_Name.Attendance}
//       drawerContent={props => <CustomDrawerContent {...props} />}
//       screenOptions={{
//         headerShown: false,
//         drawerStyle: { width: '60%' },
//         drawerActiveTintColor: colors.blue,
//       }}
//     >
//       <Drawer.Screen name={Screen_Name.Attendance} component={Attendance} />
//       <Drawer.Screen name={Screen_Name.Profile} component={Profile} />
//       <Drawer.Screen
//         name={Screen_Name.Details_Shift}
//         component={Details_Shift}
//       />
//       <Drawer.Screen name={Screen_Name.Setting} component={Setting} />
//     </Drawer.Navigator>
//   );
// };

// export default DrawerNavigator;
