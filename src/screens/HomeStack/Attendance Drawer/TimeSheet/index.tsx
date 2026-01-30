import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ms, spacing } from '../../../../utils/spacing';
import AppStyles from '../../../../components/AppStyle';
import CustomHeader from '../../../../components/CustomHeader';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import icons from '../../../../assets/icons';
import MonthPicker from 'react-native-month-year-picker';
import { border, fonts } from '../../../../utils/fontSize';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import moment, { now } from 'moment';
import 'moment/locale/vi';

import { navigate } from '../../../../navigation/RootNavigator';
import { Screen_Name } from '../../../../navigation/ScreenName';
import { FlatList } from 'react-native-gesture-handler';
import images from '../../../../assets/images';
import { useColors } from '../../../../hooks/useColors';

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

LocaleConfig.defaultLocale = 'vi';

const TimeSheet = () => {
  moment.locale('vi');
  moment.updateLocale('vi', {
    weekdays: [
      'Chủ nhật', // 0
      'Thứ 2', // 1
      'Thứ 3', // 2
      'Thứ 4', // 3
      'Thứ 5', // 4
      'Thứ 6', // 5
      'Thứ 7', // 6
    ],
  });
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const { t } = useTranslation();
  const colors = useColors();

  const timeSheetStatus = {
    full: colors.success,
    lack: colors.warning,
    unPaid: colors.gray500 || colors.gray,
    paid: colors.primary,
  };
  const [selectedDate, setDate] = useState(moment());
  const [show, setShow] = useState(false);
  const [state, setState] = useState('List');
  const [calendarKey, setCalendarKey] = useState(
    selectedDate.format('YYYY-MM'),
  );

  const showPicker = useCallback(value => setShow(value), []);

  const onValueChange = useCallback(
    (event, newDate) => {
      if (newDate) {
        const selectedDate = moment(newDate || Date);
        setDate(selectedDate);
        showPicker(false);
      } else {
        showPicker(false);
      }
    },
    [showPicker],
  );

  const formattedDate = selectedDate.format('MM/YYYY');

  const legendItems = useMemo(
    () => [
      {
        key: 'full',
        label: t(`label.timeSheet_full`),
        color: timeSheetStatus.full,
      },
      {
        key: 'lack',
        label: t(`label.timeSheet_lack`),
        color: timeSheetStatus.lack,
      },
      {
        key: 'unPaid',
        label: t(`label.timeSheet_unPaid`),
        color: timeSheetStatus.unPaid,
      },
      {
        key: 'paid',
        label: t(`label.timeSheet_paid`),
        color: timeSheetStatus.paid,
      },
    ],
    [t, colors],
  );

  const dayConfigs = [
    {
      day: 4,
      month: 11,
      year: 2024,
      statuses: ['lack'],
      type: 'Ca hành chính (08:15 - 18:00)',
      timeIn: '09:00 03-11-2024',
      timeOut: '12:00 03-11-2024',
    },
    {
      day: 6,
      month: 11,
      year: 2024,
      statuses: ['full'],
      type: 'Ca hành chính (08:15 - 18:00)',
      timeIn: '08:10 06-11-2024',
      timeOut: '18:05 06-11-2024',
    },
    {
      day: 9,
      month: 11,
      year: 2024,
      statuses: ['paid'],
      type: 'Ca hành chính (08:15 - 18:00)',
      timeIn: '08:20 09-11-2024',
      timeOut: '18:00 09-11-2024',
    },
    {
      day: 12,
      month: 11,
      year: 2024,
      statuses: ['unPaid'],
      type: 'Ca hành chính (08:15 - 18:00)',
      timeIn: '08:30 12-11-2024',
      timeOut: '17:45 12-11-2024',
    },
    {
      day: 18,
      month: 11,
      year: 2024,
      statuses: ['full'],
      type: 'Ca hành chính (08:15 - 18:00)',
      timeIn: '08:05 18-11-2024',
      timeOut: '18:10 18-11-2024',
    },
    {
      day: 22,
      month: 11,
      year: 2024,
      statuses: ['lack'],
      type: 'Ca hành chính (08:15 - 18:00)',
      timeIn: '08:55 22-11-2024',
      timeOut: '17:20 22-11-2024',
    },
    {
      day: 26,
      month: 11,
      year: 2024,
      statuses: ['paid'],
      type: 'Ca hành chính (08:15 - 18:00)',
      timeIn: '08:25 26-11-2024',
      timeOut: '18:02 26-11-2024',
    },

    {
      day: 2,
      month: 11,
      year: 2025,
      statuses: ['lack'],
      type: 'Ca hành chính (08:15 - 18:00)',
      timeIn: '09:05 02-11-2025',
      timeOut: '14:00 02-11-2025',
    },
    {
      day: 3,
      month: 11,
      year: 2025,
      statuses: ['full'],
      type: 'Ca hành chính (08:15 - 18:00)',
      timeIn: '08:12 03-11-2025',
      timeOut: '18:06 03-11-2025',
    },
    {
      day: 4,
      month: 11,
      year: 2025,
      statuses: ['paid'],
      type: 'Ca hành chính (08:15 - 18:00)',
      timeIn: '08:18 04-11-2025',
      timeOut: '18:01 04-11-2025',
    },
    {
      day: 5,
      month: 11,
      year: 2025,
      statuses: ['unPaid'],
      type: 'Ca hành chính (08:15 - 18:00)',
      timeIn: '08:35 05-11-2025',
      timeOut: '17:50 05-11-2025',
    },
    {
      day: 6,
      month: 11,
      year: 2025,
      statuses: ['full'],
      type: 'Ca hành chính (08:15 - 18:00)',
      timeIn: '08:08 06-11-2025',
      timeOut: '18:04 06-11-2025',
    },
    {
      day: 7,
      month: 11,
      year: 2025,
      statuses: ['lack'],
      type: 'Ca hành chính (08:15 - 18:00)',
      timeIn: '09:02 07-11-2025',
      timeOut: '17:05 07-11-2025',
    },
    {
      day: 8,
      month: 11,
      year: 2025,
      statuses: ['lack'],
      type: 'Ca hành chính (08:15 - 18:00)',
      timeIn: '09:05 08-11-2025',
      timeOut: '14:00 08-11-2025',
    },
    {
      day: 9,
      month: 11,
      year: 2025,
      statuses: ['full'],
      type: 'Ca hành chính (08:15 - 18:00)',
      timeIn: '08:12 09-11-2025',
      timeOut: '18:06 09-11-2025',
    },
    {
      day: 10,
      month: 11,
      year: 2025,
      statuses: ['paid'],
      type: 'Ca hành chính (08:15 - 18:00)',
      timeIn: '08:18 10-11-2025',
      timeOut: '18:01 10-11-2025',
    },
    {
      day: 11,
      month: 11,
      year: 2025,
      statuses: ['unPaid'],
      type: 'Ca hành chính (08:15 - 18:00)',
      timeIn: '08:35 11-11-2025',
      timeOut: '17:50 11-11-2025',
    },
    {
      day: 12,
      month: 11,
      year: 2025,
      statuses: ['full'],
      type: 'Ca hành chính (08:15 - 18:00)',
      timeIn: '08:08 12-11-2025',
      timeOut: '18:04 12-11-2025',
    },
    {
      day: 13,
      month: 11,
      year: 2025,
      statuses: ['lack'],
      type: 'Ca hành chính (08:15 - 18:00)',
      timeIn: '09:02 13-11-2025',
      timeOut: '17:05 13-11-2025',
    },
    {
      day: 14,
      month: 11,
      year: 2025,
      statuses: ['paid'],
      type: 'Ca hành chính (08:15 - 18:00)',
      timeIn: '08:22 14-11-2025',
      timeOut: '18:03 14-11-2025',
    },
  ];

  const getProgressRatio = (timeIn: string, timeOut: string) => {
    if (!timeIn || !timeOut) return 0;

    const start = moment(timeIn, 'HH:mm DD-MM-YYYY');
    const end = moment(timeOut, 'HH:mm DD-MM-YYYY');

    let diffHours = moment.duration(end.diff(start)).asHours();
    if (diffHours < 0) diffHours += 24;

    const ratio = diffHours / 8; // 8 tiếng = full
    const clamped = Math.max(0, Math.min(ratio, 1)); // 0–1

    return clamped; // number
  };

  const markedDates = useMemo(() => {
    return dayConfigs.reduce(
      (acc, { day, month, year, statuses, type, timeIn, timeOut }) => {
        const targetDate = moment({ year, month: month - 1, day });
        acc[targetDate.format('YYYY-MM-DD')] = {
          marked: true,
          dots: statuses.map(status => ({
            key: status,
            color: timeSheetStatus[status],
          })),
          day: moment({ day, month, year }).format('DD-MM-YYYY'),
          statuses,
          type,
          timeIn,
          timeOut,
        };
        return acc;
      },
      {},
    );
  }, []);

  useEffect(() => {
    setCalendarKey(selectedDate.format('YYYY-MM'));
  }, [selectedDate]);

  const filteredDayConfigs = useMemo(() => {
    const month = selectedDate.month() + 1; // moment: 0-11
    const year = selectedDate.year();

    return dayConfigs
      .filter(item => item.year === year && item.month === month)
      .sort((a, b) => a.day - b.day); // sắp xếp tăng dần theo ngày
  }, [selectedDate]);

  const handleSelectDate = useCallback(
    (selectedMoment: moment.Moment) => {
      const dateKey = selectedMoment.format('YYYY-MM-DD');
      const dayInfo = markedDates[dateKey];

      const dots = dayInfo?.dots?.[0] ?? null;

      navigate(Screen_Name.Detail_TimeSheet, {
        selectedDay: selectedMoment.format('dddd - DD/MM/YYYY'),
        dots,
        type: dayInfo?.type,
        timeIn: dayInfo?.timeIn,
        timeOut: dayInfo?.timeOut,
        statuses: dayInfo?.statuses,
      });
    },
    [markedDates],
  );

  const onDayPress = (day: { dateString: string }) => {
    const selectedMoment = moment(day.dateString);
    handleSelectDate(selectedMoment);
  };

  const renderCalendar = () => {
    return (
      <Calendar
        key={calendarKey}
        current={selectedDate.format('YYYY-MM-DD')}
        hideExtraDays={true}
        disableArrowRight={selectedDate.isSame(moment(), 'month')}
        onMonthChange={month => {
          const newDate = moment(month.dateString);
          setDate(newDate);
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
  const renderList = useCallback(
    ({ item }) => {
      const { day, month, year, statuses, type, timeIn, timeOut } = item;

      const dateMoment = moment({ year, month: month - 1, day });
      const dayLabel = dateMoment.format('dddd');
      const statusKey = statuses?.[0];
      const statusColor = statusKey
        ? timeSheetStatus[statusKey]
        : colors.border;
      const ratio = getProgressRatio(timeIn, timeOut);

      return (
        <TouchableOpacity
          style={[styles.listCard, AppStyles.row]}
          onPress={() => handleSelectDate(dateMoment)}
        >
          <View style={styles.listDate}>
            <Text style={{ fontFamily: 'InterVariable' }}>
              {dateMoment.format('DD/MM/YYYY')}
            </Text>
            <Text style={{ fontFamily: 'InterVariable' }}>{dayLabel}</Text>
          </View>
          <View style={styles.listContentWrapper}>
            <Text>{type}</Text>
            <Text>
              {`Chấm công ${moment(timeIn, 'HH:mm DD-MM-YYYY').format(
                'HH:mm',
              )} - ${moment(timeOut, 'HH:mm DD-MM-YYYY').format('HH:mm')}`}
            </Text>
            <View
              style={[
                styles.statusBar,
                {
                  borderColor: statusColor,
                  width: `${ratio * 100}%` as any, // ép type
                },
              ]}
            />
          </View>
        </TouchableOpacity>
      );
    },
    [handleSelectDate],
  );
  // console.log(`${selectedDate.format('MMMM YYYY')}`);
  // console.log(`${selectedDate.format('YYYY-MM-DD')}`);
  // console.log(`${`${moment().format('YYYY-MM-DD')}`}`);
  // console.log(
  //   `${` abc ${selectedDate.isSame(moment().format('YYYY-MM-DD'), 'month')}`}`,
  // );
  return (
    <View style={styles.container}>
      <CustomHeader
        label="TimeSheet"
        leftIcon={icons.menu}
        leftPress={() => navigation.openDrawer()}
        style={{ marginBottom: 0, backgroundColor: colors.white }}
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
        <Image
          source={icons.down}
          style={[AppStyles.icon, { tintColor: colors.text }]}
        />
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
        <View
          style={[
            styles.row,
            styles.section,
            styles.legendRow,
            { paddingHorizontal: spacing.medium },
          ]}
        >
          {legendItems.map(item => (
            <View style={[styles.row, styles.legendItem]} key={item.key}>
              <View style={[styles.dot, { backgroundColor: item.color }]} />
              <Text>{item.label}</Text>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          {
            <>
              {state === 'List' && (
                <View
                  style={{
                    marginTop: spacing.small,
                    height: '90%',
                    paddingBottom: spacing.medium,
                  }}
                >
                  <FlatList
                    data={filteredDayConfigs}
                    renderItem={renderList}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{}}
                  />
                </View>
              )}
              {state === 'Calendar' && <>{renderCalendar()}</>}
            </>
          }
        </View>
      </View>

      {show && (
        <MonthPicker
          onChange={onValueChange}
          value={selectedDate.toDate()}
          maximumDate={new Date()}
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
    backgroundColor: '#FFFFFF',
    margin: spacing.small,
    marginTop: spacing.medium,
  },
  listCard: {
    borderRadius: border.radiusSmall,
    marginTop: spacing.medium,
    padding: spacing.medium,
    borderWidth: 1,
    marginHorizontal: spacing.small,
    borderColor: '#D1D5DB',
  },
  listDate: {
    backgroundColor: '#D1D5DB',
    alignItems: 'center',
    padding: spacing.small,
    alignContent: 'center',
  },
  listContentWrapper: {
    flex: 1,
    marginHorizontal: spacing.medium,
    alignItems: 'flex-start',
  },
  section: {
    marginTop: spacing.medium,
  },
  legendRow: {
    flexWrap: 'wrap',
    rowGap: spacing.small,
  },
  legendItem: {
    marginTop: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: fonts.normal,
    textAlign: 'center',
  },
  selectedDate: {
    marginTop: 20,
    fontSize: 18,
    color: '#EF4444',
    textAlign: 'center',
  },
  statusBar: {
    marginTop: spacing.small,
    borderBottomWidth: 5,
    borderRadius: border.radiusSmall,
    alignSelf: 'flex-start',
  },
  listContent: {
    paddingBottom: spacing.xxlarge * 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxlarge,
  },
  emptyStateText: {
    marginTop: spacing.small,
    color: '#6B7280',
  },
  listBottomSpacer: {
    height: spacing.xxlarge,
  },
});
