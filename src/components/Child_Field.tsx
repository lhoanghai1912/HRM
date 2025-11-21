import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppStyles from './AppStyle';
import icons from '../assets/icons';
import { navigate } from '../navigation/RootNavigator';
import { Screen_Name } from '../navigation/ScreenName';
import CustomHeader from './CustomHeader';
import { border, weight } from '../utils/fontSize';
import { colors } from '../utils/color';

const Child_Field = ({ route }) => {
  const navigation = useNavigation();
  const { children, formData, handleChange, handlers, customConfigs } =
    route.params;

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <CustomHeader
        label="Detail Appointment"
        leftIcon={icons.back}
        leftPress={() => navigation.goBack()}
      />
      <ScrollView style={{ flex: 1 }}>
        {children.map(child => (
          <TouchableOpacity
            key={child.id}
            style={{
              marginHorizontal: 16,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: border.radiusMedium,
              padding: 12,
              backgroundColor: '#f9f9f9',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            onPress={() => {
              // Nếu muốn đi sâu tiếp, có thể navigate tiếp sang Child_Field hoặc Detail_Field
              navigate(Screen_Name.Detail_Field, {
                parent: child,
                formData,
                handleChange,
                handlers,
                customConfigs,
              });
            }}
          >
            <Text style={{ fontWeight: weight.bold, fontSize: 16 }}>
              {child.name}
            </Text>
            <Image style={[AppStyles.icon]} source={icons.arrow} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Child_Field;
