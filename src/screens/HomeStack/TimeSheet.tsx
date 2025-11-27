import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../../utils/color';
import { ms, spacing } from '../../utils/spacing';
import AppStyles from '../../components/AppStyle';
import CustomHeader from '../../components/CustomHeader';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import icons from '../../assets/icons';
import MonthPicker from 'react-native-month-year-picker';
import { border, fonts } from '../../utils/fontSize';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import moment from 'moment';

const timeSheetStatus = {
  full: colors.green,
  lack: colors.orange,
  unPaid: colors.darkGray,
  paid: colors.blue,
};

LocaleConfig.locales['vi'] = {
  monthNames: [
    'Tháng Một',
    'Tháng Hai',
    'Tháng Ba',
    'Tháng Tư',
    'Tháng Năm',
    'Tháng Sáu',
    'Tháng Bảy',
    'Tháng Tám',
    'Tháng Chín',
    'Tháng Mười',
    'Tháng Mười Một',
    'Tháng Mười Hai',
  ],
  monthNamesShort: [
    'T1',
    'T2',
    'T3',
    'T4',
    'T5',
    'T6',
    'T7',
    'T8',
    'T9',
    'T10',
    'T11',
    'T12',
  ],
  dayNames: [
    'Chủ Nhật',
    'Thứ Hai',
    'Thứ Ba',
    'Thứ Tư',
    'Thứ Năm',
    'Thứ Sáu',
    'Thứ Bảy',
  ],
  dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  today: 'Hôm nay',
};

// Set the default locale to Vietnamese
LocaleConfig.defaultLocale = 'vi';

const TimeSheet = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const { t } = useTranslation();
  const [selectedDate, setDate] = useState(moment()); // Store the selected date as a moment object
  const [show, setShow] = useState(false); // Control the visibility of the MonthPicker
  const [state, setState] = useState('List'); // Track whether to show List or Calendar
  const [calendarKey, setCalendarKey] = useState(
    selectedDate.format('YYYY-MM'),
  );

  // Show/Hide the MonthPicker
  const showPicker = useCallback(value => setShow(value), []);

  // Handle selectedDate from the MonthPicker
  const onValueChange = useCallback(
    (event, newDate) => {
      if (newDate) {
        const selectedDate = moment(newDate || Date); // Use moment.js to handle the newDate
        setDate(selectedDate); // Update the selectedDate state
        showPicker(false); // Hide the picker
      } else {
        showPicker(false); // If the user cancels, just close the picker
      }
    },
    [showPicker],
  );

  // Log selectedDate when it changes

  // Format the selectedDate to show month and year in MM/YYYY format
  const formattedDate = selectedDate.format('MM/YYYY');
  // Example of marked dates for the calendar
  // const markedDates = {
  //   '2025-11-10': { marked: true, dotColor: timeSheetStatus.lack },
  //   '2025-11-15': { marked: true, dotColor: timeSheetStatus.full },
  //   '2025-11-18': { marked: true, dotColor: timeSheetStatus.paid },
  //   '2025-11-20': { marked: true, dotColor: timeSheetStatus.unPaid },
  // };
  // Build marked dates per month so each status renders a colored dot
  const markedDates = useMemo(() => {
    // Dữ liệu ngày và trạng thái trong tháng 11 năm 2024 và tháng 12 năm 2025
    const dayConfigs = [
      // Tháng 11 năm 2024
      { day: 3, month: 11, year: 2024, statuses: ['lack'] },
      { day: 6, month: 11, year: 2024, statuses: ['full'] },
      { day: 9, month: 11, year: 2024, statuses: ['paid', 'lack'] },
      { day: 12, month: 11, year: 2024, statuses: ['unPaid'] },
      { day: 18, month: 11, year: 2024, statuses: ['full', 'paid'] },
      { day: 22, month: 11, year: 2024, statuses: ['lack', 'unPaid'] },
      { day: 26, month: 11, year: 2024, statuses: ['paid'] },

      // Tháng 12 năm 2025
      { day: 2, month: 11, year: 2025, statuses: ['lack'] },
      { day: 3, month: 11, year: 2025, statuses: ['full'] },
      { day: 4, month: 11, year: 2025, statuses: ['paid'] },
      { day: 15, month: 11, year: 2025, statuses: ['unPaid'] },
      { day: 6, month: 11, year: 2025, statuses: ['full', 'paid'] },
      { day: 7, month: 11, year: 2025, statuses: ['lack', 'unPaid'] },
      { day: 28, month: 11, year: 2025, statuses: ['paid'] },
    ];

    // Tạo đối tượng markedDates từ dayConfigs
    return dayConfigs.reduce((acc, { day, month, year, statuses }) => {
      const targetDate = moment({ year, month: month - 1, day }); // Sử dụng moment để tạo ngày từ year, month, và day
      acc[targetDate.format('YYYY-MM-DD')] = {
        marked: true, // Đánh dấu ngày này
        dots: statuses.map(status => ({
          key: status, // Trạng thái của ngày
          color: timeSheetStatus[status], // Màu sắc cho trạng thái
        })),
      };
      return acc;
    }, {});
  }, []); // Chạy lại khi selectedDate thay đổi

  useEffect(() => {
    // Force Calendar to re-mount so that the library picks up the new `current` month.
    setCalendarKey(selectedDate.format('YYYY-MM'));
  }, [selectedDate]);

  const onDayPress = day => {
    const selectedDay = moment(day.dateString); // Format the selected day using moment
    setDate(selectedDay); // Update the selectedDate state
    console.log('Selected day:', selectedDay.format('DD-MM-YYYY')); // Log the selected date in 'YYYY-MM-DD' format
  };

  // Render Calendar component
  const renderCalendar = () => {
    return (
      <Calendar
        key={calendarKey}
        current={selectedDate.format('YYYY-MM-DD')}
        hideExtraDays={true} // This hides extra days from the previous/next month
        // disableMonthChange={selectedDate.isSame(moment(), 'month')} // Disable month change if the selected month is the same as the current month
        disableArrowRight={selectedDate.isSame(moment(), 'month')}
        onMonthChange={month => {
          const newDate = moment(month.dateString); // Get the new selected date
          setDate(newDate); // Update the selectedDate
        }}
        monthFormat="MMM yyyy"
        markingType="multi-dot"
        markedDates={markedDates}
        onDayPress={onDayPress}
        theme={{
          todayTextColor: '#00ADF5',
          arrowColor: '#007AFF',
          textMonthFontSize: 20,
          textDayFontSize: 14,
          textDayHeaderFontSize: 13,
          dotStyle: {
            width: ms(12),
            height: ms(12),
            borderRadius: border.radiusCircle,
            marginHorizontal: 2,
            marginTop: 2,
          },
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        label="TimeSheet"
        leftIcon={icons.menu}
        leftPress={() => navigation.openDrawer()}
        style={{ marginBottom: 0, backgroundColor: colors.blue }}
      />
      <TouchableOpacity
        style={{
          backgroundColor: colors.blue,
          flexDirection: 'row',
          justifyContent: 'center',
          alignContent: 'center',
        }}
        onPress={() => showPicker(true)} // Open the month picker when pressed
      >
        <Text style={styles.text}>{`${formattedDate || 'Open'}`}</Text>
        <Image source={icons.down} style={AppStyles.icon} />
      </TouchableOpacity>

      <View style={styles.body}>
        <View
          style={[styles.row, styles.section, { justifyContent: 'center' }]}
        >
          <TouchableOpacity
            style={{
              paddingHorizontal: spacing.large,
              paddingVertical: spacing.small,
              borderBottomWidth: state === 'List' ? 1 : 0,
              borderBottomColor: state === 'List' ? colors.blue : null,
            }}
            onPress={() => setState('List')}
          >
            <Text style={{ color: state === 'List' ? colors.blue : null }}>
              Danh sách
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingHorizontal: spacing.large,
              paddingVertical: spacing.small,
              borderBottomWidth: state === 'Calendar' ? 1 : 0,
              borderBottomColor: state === 'Calendar' ? colors.blue : null,
            }}
            onPress={() => setState('Calendar')}
          >
            <Text style={{ color: state === 'Calendar' ? colors.blue : null }}>
              Bảng công
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.row, styles.section]}>
          <View style={[styles.row, { marginTop: 0 }]}>
            <View
              style={[styles.dot, { backgroundColor: timeSheetStatus.full }]}
            />
            <Text>{t(`label.timeSheet_full`)}</Text>
          </View>
          <View style={[styles.row, { marginTop: 0 }]}>
            <View
              style={[styles.dot, { backgroundColor: timeSheetStatus.lack }]}
            />
            <Text>{t(`label.timeSheet_lack`)}</Text>
          </View>
          <View style={[styles.row, { marginTop: 0 }]}>
            <View
              style={[styles.dot, { backgroundColor: timeSheetStatus.unPaid }]}
            />
            <Text>{t(`label.timeSheet_unPaid`)}</Text>
          </View>
          <View style={[styles.row, { marginTop: 0 }]}>
            <View
              style={[styles.dot, { backgroundColor: timeSheetStatus.paid }]}
            />
            <Text>{t(`label.timeSheet_paid`)}</Text>
          </View>
        </View>
        <View style={styles.section}>
          {
            <>
              {state === 'List' && (
                <>
                  <Text>List</Text>
                </>
              )}
              {state === 'Calendar' && (
                <>
                  <Text>{selectedDate.format('MMMM YYYY')}</Text>
                  <Text>{selectedDate.format('YYYY-MM-DD')}</Text>
                  <Text>{`${moment().format('YYYY-MM-DD')}`}</Text>
                  <Text>{` abc ${selectedDate.isSame(
                    moment().format('YYYY-MM-DD'),
                    'month',
                  )}`}</Text>

                  {renderCalendar()}
                </>
              )}
            </>
          }
        </View>
      </View>

      {show && (
        <MonthPicker
          onChange={onValueChange}
          value={selectedDate.toDate()} // Convert moment to native Date object
          maximumDate={new Date()} // Limit the picker to the current month/year
          locale="vi"
        />
      )}
    </View>
  );
};

export default TimeSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dot: {
    width: ms(10),
    height: ms(10),
    borderRadius: border.radiusCircle,
    marginRight: spacing.small,
  },
  body: {
    flex: 1,
    margin: spacing.small,
    marginTop: spacing.medium,
  },
  section: {
    marginTop: spacing.medium,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
