import React, { useCallback, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../../utils/color';
import { spacing } from '../../utils/spacing';
import AppStyles from '../../components/AppStyle';
import CustomHeader from '../../components/CustomHeader';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import icons from '../../assets/icons';
import MonthPicker from 'react-native-month-year-picker';
import { fonts } from '../../utils/fontSize';

const TimeSheet = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const { t } = useTranslation();
  const [date, setDate] = useState(new Date()); // Stores the selected date
  const [show, setShow] = useState(false); // Controls the visibility of the picker

  // Show/Hide the MonthPicker
  const showPicker = useCallback(value => setShow(value), []);

  // Handle date selection
  const onValueChange = useCallback(
    (event, newDate) => {
      const selectedDate = newDate || date; // If no newDate, fall back to the current date
      showPicker(false); // Hide the picker
      setDate(selectedDate); // Update the state with the selected date
    },
    [date, showPicker],
  );

  // Log selected date when it changes
  useEffect(() => {
    console.log('Selected Date:', date);
  }, [date]);

  // Format the selected date to show month and year
  const formattedDate = `${date.getMonth() + 1}/${date.getFullYear()}`;

  return (
    <View style={styles.container}>
      <CustomHeader
        label="TimeSheet"
        leftIcon={icons.menu}
        leftPress={() => navigation.openDrawer()}
        style={{ marginBottom: 0 }}
      />
      <TouchableOpacity
        style={{
          backgroundColor: colors.white,
          flexDirection: 'row',
          justifyContent: 'center',
          alignContent: 'center',
        }}
        onPress={() => showPicker(true)}
      >
        <Text style={styles.text}>{`${formattedDate || 'Open'}`}</Text>
        <Image source={icons.down} style={AppStyles.icon} />
      </TouchableOpacity>

      <View style={styles.body}>
        {/* Button to trigger MonthPicker */}

        {/* Display the selected month and year */}
        <Text
          style={styles.selectedDate}
        >{`Selected Date: ${formattedDate}`}</Text>

        {/* Month Picker */}
        {show && (
          <MonthPicker
            onChange={onValueChange}
            value={date}
            maximumDate={new Date()} // Limit the picker to the current month/year
            locale="en"
          />
        )}
      </View>
    </View>
  );
};

export default TimeSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    // justifyContent: 'center',
    margin: spacing.small,
    backgroundColor: colors.white,
  },
  text: {
    fontSize: fonts.normal,
    color: colors.primary,
    textAlign: 'center',
  },
  selectedDate: {
    marginTop: 20,
    fontSize: 18,
    color: colors.red,
    textAlign: 'center',
  },
});
