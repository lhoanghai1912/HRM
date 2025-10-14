import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import CustomHeader from '../../../../navigation/CustomHeader';
import icons from '../../../../assets/icons';
import { ms, spacing } from '../../../../utils/spacing';
import { colors } from '../../../../utils/color';
import { ScrollView } from 'react-native-gesture-handler';
import AppStyles from '../../../../components/AppStyle';
import AppInput from '../../../../components/AppInput';
import ModalPickDate from '../../../../components/modal/ModalPickDate';
import { getDetailShift } from '../../../../services/Shift';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

const weekDays = [
  { label: 'Thứ 2', value: '2' },
  { label: 'Thứ 3', value: '3' },
  { label: 'Thứ 4', value: '4' },
  { label: 'Thứ 5', value: '5' },
  { label: 'Thứ 6', value: '6' },
  { label: 'Thứ 7', value: '7' },
  { label: 'Chủ nhật', value: '8' },
];

const workType = [
  { label: 'Office', value: 'InOffice' },
  { label: 'Remote', value: 'Remote' },
  { label: 'Hybrid', value: 'Hybrid' },
];

const Details_Shift = ({ navigation, route }) => {
  const { id } = route.params;
  console.log('Shift Details id:', id);
  const { t } = useTranslation();
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [date, setDate] = useState<Date>();
  const [pickerType, setPickerType] = useState<'start' | 'end' | null>(null);
  const [loading, setLoading] = useState(false);
  const [detailShift, setDetailShift] = useState<any>([]);
  const checkedDays = (detailShift.repeatWeek || '2,3,4')
    .split(',')
    .map(s => s.trim());

  useEffect(() => {
    fetchShiftDetails();
  }, [id]);

  const fetchShiftDetails = async () => {
    try {
      setLoading(true);
      const response = await getDetailShift(id);
      console.log('Shift Details response:', response);
      setDetailShift(response);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  // const handleDateChange = (event, selectedDate) => {
  //   const currentDate = selectedDate || date;
  //   setShowTimePicker(false);
  //   setDate(currentDate);

  //   if (pickerType === 'start') {
  //     setDetailShift(prev => ({
  //       ...prev,
  //       startDate: currentDate,
  //     }));
  //   } else if (pickerType === 'end') {
  //     setDetailShift(prev => ({
  //       ...prev,
  //       endDate: currentDate,
  //     }));
  //   }
  //   setPickerType(null);
  // };

  return (
    <View style={styles.container}>
      <CustomHeader
        label="Shift Details"
        rightIcon={icons.back}
        rightPress={() => navigation.goBack()}
      />
      <ScrollView style={styles.body}>
        <Text style={AppStyles.label}>Basic Information</Text>
        <View style={styles.form}>
          <AppInput
            editable={false}
            style={AppStyles.text}
            label={`Tên bảng phân ca: `}
            placeholder={`${t('message.empty')}`}
            value={detailShift?.name}
          />
          <AppInput
            editable={false}
            style={AppStyles.text}
            label={`Đơn vị áp dụng: `}
            placeholder={`${t('message.empty')}`}
            value={
              detailShift.shiftDetailOrgStructs &&
              detailShift.shiftDetailOrgStructs.length > 0
                ? detailShift.shiftDetailOrgStructs
                    .map(org => org.orgStruct?.orgStructName)
                    .filter(Boolean)
                    .join('; ')
                : '-'
            }
          />
          <AppInput
            editable={false}
            style={AppStyles.text}
            label={`Ca làm việc: `}
            placeholder={`${t('message.empty')}`}
            value={
              detailShift.shiftLines && detailShift.shiftLines.length > 0
                ? detailShift.shiftLines
                    .map(line => line.shift?.shiftName)
                    .filter(Boolean)
                    .join('; ')
                : '-'
            }
          />
          <AppInput
            editable={false}
            style={AppStyles.text}
            label={`Địa chỉ làm việc: `}
            placeholder={`${t('message.empty')}`}
            value={
              detailShift.location && detailShift.location.length > 0
                ? detailShift.location
                    .map(loc => loc.location?.locationName)
                    .filter(Boolean)
                    .join('; ')
                : null
            }
          />
        </View>
        <Text style={AppStyles.label}>Apply Time</Text>
        <View
          style={[
            styles.form,
            { flexDirection: 'row', justifyContent: 'space-between' },
          ]}
        >
          <View style={{ flexDirection: 'row' }}>
            <Text style={AppStyles.text}>From: </Text>
            {/* <TouchableOpacity
                onPress={() => {
                  setShowTimePicker(true);
                  setPickerType('start');
                  setDate(detailShift.startDate);
                }}
              > */}
            <Text style={AppStyles.text}>
              {moment(detailShift.startDate).format('DD-MM-YYYY')}
            </Text>
            {/* </TouchableOpacity> */}
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={AppStyles.text}>To: </Text>
            {/* <TouchableOpacity
                onPress={() => {
                  setShowTimePicker(true);
                  setPickerType('end');
                  setDate(detailShift.endDate);
                }}
              > */}
            <Text style={AppStyles.text}>
              {moment(detailShift.endDate).format('DD-MM-YYYY')}
            </Text>
            {/* </TouchableOpacity> */}
          </View>
        </View>
        <View
          style={[
            styles.form,
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
            },
          ]}
        >
          <Text style={[AppStyles.text, { width: '10%' }]}>Lặp</Text>
          <View
            style={{
              width: '85%',
              backgroundColor: colors.background,
              padding: spacing.small,
              borderRadius: 10,
              borderWidth: 0.5,
              borderColor: colors.Gray,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: spacing.medium,
              }}
            >
              <Text style={[AppStyles.text, { width: '20%' }]}>
                {detailShift.repeatBy}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '70%',
                }}
              >
                <Text style={AppStyles.text}>{`Chu kì lặp:`}</Text>
                <Text style={AppStyles.text}>{detailShift.repeatCycle} </Text>
                <Text style={AppStyles.text}>{detailShift.repeatBy}</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: spacing.small,
              }}
            >
              {weekDays.map(day => (
                <View
                  key={day.value}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: spacing.small,
                    marginBottom: spacing.small,
                  }}
                >
                  <Image
                    source={
                      checkedDays.includes(day.value)
                        ? icons.checkedBox
                        : icons.uncheckedBox
                    }
                    style={AppStyles.icon}
                    resizeMode="contain"
                  />
                  <Text style={AppStyles.text}>{day.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <Text style={AppStyles.label}>Hình thức làm việc</Text>
        <View style={styles.form}>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {workType.map(type => (
              <View
                key={type.value}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: spacing.medium,
                  marginBottom: spacing.small,
                }}
              >
                <Image
                  source={
                    detailShift.workType === type.value
                      ? icons.checkedRadio
                      : icons.uncheckedRadio
                  }
                  style={AppStyles.icon}
                  resizeMode="contain"
                />
                <Text style={AppStyles.text}>{type.label}</Text>
              </View>
            ))}
          </View>
          {/* {detailShift.workType === 'Hybrid' && ( */}
          {/* {workType.map(type => ( */}
          <View style={{}}>
            <Text style={[AppStyles.text, { marginTop: spacing.small }]}>
              {`Office: ${
                detailShift.onSite
                  ? detailShift.onSite
                      .split(',')
                      .map(s => s.trim())
                      .map(
                        val => weekDays.find(day => day.value === val)?.label,
                      )
                      .filter(Boolean)
                      .join(', ')
                  : ''
              }`}
            </Text>
            <Text style={[AppStyles.text, { marginTop: spacing.small }]}>
              {`Remote: ${
                detailShift.remote
                  ? detailShift.remote
                      .split(',')
                      .map(s => s.trim())
                      .map(
                        val => weekDays.find(day => day.value === val)?.label,
                      )
                      .filter(Boolean)
                      .join(', ')
                  : ''
              }`}
            </Text>
          </View>
          {/* ))} */}
          {/* )} */}
          {<View></View>}
        </View>
        <View style={styles.form}></View>
      </ScrollView>
      {/* <Text>Details about the shift will be displayed here.</Text> */}
      {/* <ModalPickDate
        visible={showTimePicker}
        value={date}
        onChange={handleDateChange}
        onClose={() => {
          setShowTimePicker(false);
          setPickerType(null);
        }}
      /> */}
      {loading && (
        <View style={{ paddingVertical: 24 }}>
          <ActivityIndicator />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    marginHorizontal: spacing.medium,
    marginBottom: spacing.medium,
    backgroundColor: colors.white,
    padding: spacing.medium,
  },
  form: { padding: spacing.small },
});

export default Details_Shift;
