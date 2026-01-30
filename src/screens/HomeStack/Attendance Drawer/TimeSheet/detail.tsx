import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import CustomHeader from '../../../../components/CustomHeader';
import icons from '../../../../assets/icons';
import moment from 'moment';
import 'moment/locale/vi';
import { border, fonts, weight } from '../../../../utils/fontSize';
import { Image } from 'react-native';
import AppStyles from '../../../../components/AppStyle';
import { ms, spacing } from '../../../../utils/spacing';
import { useColors } from '../../../../hooks/useColors';

moment.locale('vi');

const DetailTimeSheet = ({ route, navigation }) => {
  const colors = useColors();
  const { selectedDay, dots } = route.params;
  const [expand, setExpand] = useState(false);
  const detailTimesheetData = [
    {
      status: 'Giờ vào',
      time: '07:58',
      location: 'Máy 1',
    },
    {
      status: 'Giờ ra',
      time: '12:44',
      location: 'Máy 2',
    },
    {
      status: 'Giờ vào',
      time: '',
      location: '',
    },
    {
      status: 'Giờ ra',
      time: '17:10',
      location: 'Máy 2',
    },
  ];

  console.log('route', route.params);

  const [currentDate, setCurrentDate] = React.useState(() => {
    const parts = selectedDay.split(' - ');
    const datePart = parts[1];
    return moment(datePart, 'DD/MM/YYYY');
  });

  // Hàm format lại theo tiếng Việt: "Thứ 3 - 04/11/2025"
  const formatDisplay = (date: moment.Moment) => {
    const dayLabel = date.format('dddd'); // "thứ 3"
    const cap = dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1); // "Thứ 3"
    return `${cap} - ${date.format('DD/MM/YYYY')}`;
  };

  const handlePrevDay = () => {
    setCurrentDate(prev => moment(prev).subtract(1, 'day'));
  };

  const handleNextDay = () => {
    setCurrentDate(prev => moment(prev).add(1, 'day'));
  };
  const renderDetail = ({ item }) => {
    return (
      <View style={AppStyles.row}>
        <View style={{ width: '30%' }}>
          <Text
            style={[styles.text, { textAlign: 'left', color: colors.text }]}
          >
            {item.status || ' - '}
          </Text>
        </View>
        <View style={{ width: '30%' }}>
          <Text
            style={[
              styles.text,
              { fontWeight: weight.bold, color: colors.text },
            ]}
          >
            {item.time || ' - '}
          </Text>
        </View>
        <View style={{ width: '30%' }}>
          <Text
            style={[
              styles.text,
              { fontWeight: weight.bold, color: colors.text },
            ]}
          >
            {item.location || ' - '}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader
        label={'Chi tiết Công'}
        leftIcon={icons.back}
        leftPress={() => navigation.goBack()}
        style={{ marginBottom: 0 }}
      />
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={[AppStyles.row, { marginTop: 0 }]}>
          <TouchableOpacity onPress={handlePrevDay}>
            <View style={styles.iconWrap}>
              <Image source={icons.back} style={styles.icon} />
            </View>
          </TouchableOpacity>
          <Text style={styles.dateText}>{formatDisplay(currentDate)}</Text>
          <TouchableOpacity onPress={handleNextDay}>
            <View style={styles.iconWrap}>
              <Image source={icons.arrow} style={styles.icon} />
            </View>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            marginTop: spacing.small,
            paddingVertical: spacing.small,
            paddingHorizontal: spacing.xxlarge,
            backgroundColor: dots?.color || colors.textSecondary,
            borderRadius: border.radiusSmall,
            color: colors.textInverse,
          }}
        >
          {dots?.key || 'Trạng thái'}
        </Text>
      </View>

      <View style={styles.body}>
        <View style={AppStyles.row}>
          <Text>Số công tính lương</Text>
          <Text>1</Text>
        </View>
        <TouchableOpacity
          style={AppStyles.row}
          onPress={() => setExpand(!expand)}
        >
          <View style={[AppStyles.row, { justifyContent: null, marginTop: 0 }]}>
            <Image
              source={expand ? icons.down : icons.up}
              style={[AppStyles.icon, { tintColor: colors.text }]}
            />
            <Text>Số công tính lương</Text>
          </View>
          <Text>1</Text>
        </TouchableOpacity>
        {expand && (
          <View style={{ paddingLeft: ms(25) }}>
            <FlatList
              data={detailTimesheetData}
              renderItem={renderDetail}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        )}
        <View style={AppStyles.row}>
          <Text style={[AppStyles.text, { color: colors.text }]}>
            Đi muộn (phút)
          </Text>
          <Text style={[styles.text, { fontWeight: weight.bold }]}>0</Text>
        </View>
        <View style={AppStyles.row}>
          <Text style={[AppStyles.text, { color: colors.text }]}>
            Về sớm (phút)
          </Text>
          <Text style={[styles.text, { fontWeight: weight.bold }]}>0</Text>
        </View>
        <View style={AppStyles.row}>
          <Text style={[AppStyles.text, { color: colors.text }]}>
            Làm thêm giờ (giờ)
          </Text>
          <Text style={[styles.text, { fontWeight: weight.bold }]}>0</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dateText: {
    fontSize: fonts.normal,
  },
  header: {
    alignItems: 'center',
  },
  body: {
    flex: 1,
    marginTop: spacing.medium,
    padding: spacing.medium,
    marginBottom: spacing.large,
  },
  iconWrap: {
    padding: ms(2),
    borderRadius: border.radiusCircle,
    borderWidth: 0.8,
    marginHorizontal: spacing.small,
  },
  icon: {
    width: ms(12),
    height: ms(12),
    fontWeight: weight.bold,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1976D2',
  },
  text: { fontSize: fonts.normal, textAlign: 'right' },
});

export default DetailTimeSheet;
