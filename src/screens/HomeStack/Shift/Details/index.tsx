import React, { useEffect, useRef, useState } from 'react';
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
import {
  FlatList,
  RefreshControl,
  ScrollView,
} from 'react-native-gesture-handler';
import AppStyles from '../../../../components/AppStyle';
import AppInput from '../../../../components/AppInput';
import ModalPickDate from '../../../../components/modal/ModalPickDate';
import { getDetailShift } from '../../../../services/Shift';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { navigate } from '../../../../navigation/RootNavigator';
import { Screen_Name } from '../../../../navigation/ScreenName';
import { formatDate } from '../../../../utils/helper';

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

const targetType = [
  { label: 'All', value: 'All' },
  { label: 'Phòng ban', value: 'OrgStruct' },
  { label: 'Nhân viên', value: 'Employees' },
];

const COLUMN_MIN_WIDTHS = {
  checkBox: ms(40),
  id: ms(120),
  fullName: ms(200),
  struct: ms(150),
  position: ms(150),
};

const Details_Shift = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const onEndReachedCalledDuringMomentum = useRef(false);
  const [page, setPage] = useState(1);
  const [orderBy, setOderBy] = useState<string | undefined>('createdAt desc');
  const [filter, setFilter] = useState<string | undefined>();
  const [search, setSearch] = useState<string>(''); // tránh undefined gây re-render không cần
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const [shiftData, setShiftData] = useState<any>([]);
  const [allShift, setAllShift] = useState<any>([]);

  const { id } = route.params;
  console.log('Shift Details id:', id);
  const { t } = useTranslation();
  const [detailShift, setDetailShift] = useState<any>([]);
  const checkedDays = (detailShift.repeatWeek || '2,3,4')
    .split(',')
    .map(s => s.trim());
  const onSite = '2,3,4';
  const remote = '5,6';
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
  const handleLoadMore = () => {};
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

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View
          style={{
            backgroundColor: colors.background,
            borderTopWidth: 1,
            borderTopColor: '#ddd',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: spacing.small,
          }}
        >
          <Text>{t(`message.loadingMore`)}</Text>
          <ActivityIndicator size="small" color={colors.red} />
        </View>
      );
    }
  };

  const renderTable = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.tableRow}
        // onPress={() => {
        //   navigate(Screen_Name.Details_Shift, { id: item?.id });
        // }}
      >
        <View
          style={[styles.checkboxCell, { width: COLUMN_MIN_WIDTHS.checkBox }]}
        >
          <View style={styles.checkbox} />
        </View>
        <Text style={{ borderLeftWidth: 0.5 }} />
        <Text
          style={[styles.cell, { width: COLUMN_MIN_WIDTHS.id, flex: 1 }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.employee.employeeCode}
        </Text>
        <Text style={{ borderLeftWidth: 0.5 }} />
        <Text
          style={[styles.cell, { width: COLUMN_MIN_WIDTHS.fullName, flex: 1 }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.employee.fullName || ' - '}
        </Text>
        <Text style={{ borderLeftWidth: 0.5 }} />
        <Text
          style={[styles.cell, { width: COLUMN_MIN_WIDTHS.struct }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item?.employee?.employeeJobInfo?.orgStruct?.orgStructName || ' - '}
        </Text>
        <Text style={{ borderLeftWidth: 0.5 }} />
        <Text
          style={[styles.cell, { width: COLUMN_MIN_WIDTHS.position }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item?.employee?.employeeJobInfo?.jobPosition || ' - '}
        </Text>
      </TouchableOpacity>
    );
  };

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
          {detailShift.workType === 'Hybrid' && (
            // {/* {workType.map(type => ( */}
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
            /* ))} */
          )}
        </View>
        <Text style={AppStyles.label}>Đối tượng áp dụng</Text>

        <View style={styles.form}>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {targetType.map(type => (
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
                    detailShift.appliesTo === type.value
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
          {detailShift.appliesTo === 'Employees' && (
            // {/* {workType.map(type => ( */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.table}>
                {/* Table Header */}
                <View style={styles.tableRowHeader}>
                  <View
                    style={[
                      styles.checkboxCell,
                      { width: COLUMN_MIN_WIDTHS.checkBox },
                    ]}
                  >
                    <View style={styles.checkbox} />
                  </View>
                  <Text style={{ borderLeftWidth: 0.5 }} />
                  <Text
                    style={[
                      styles.headerCell,
                      { width: COLUMN_MIN_WIDTHS.id, flex: 2 },
                    ]}
                    // numberOfLines={1}
                  >
                    Mã nhân viên
                  </Text>
                  <Text style={{ borderLeftWidth: 0.5 }} />

                  <Text
                    style={[
                      styles.headerCell,
                      { width: COLUMN_MIN_WIDTHS.fullName, flex: 1 },
                    ]}
                    // numberOfLines={1}
                  >
                    Họ và tên
                  </Text>
                  <Text style={{ borderLeftWidth: 0.5 }} />
                  <Text
                    style={[
                      styles.headerCell,
                      { width: COLUMN_MIN_WIDTHS.struct, flex: 1 },
                    ]}
                    // numberOfLines={1}
                  >
                    Đơn vị công tác
                  </Text>
                  <Text style={{ borderLeftWidth: 0.5 }} />
                  <Text
                    style={[
                      styles.headerCell,
                      { width: COLUMN_MIN_WIDTHS.position, flex: 1 },
                    ]}
                    // numberOfLines={1}
                  >
                    Vị trí công việc
                  </Text>
                </View>

                {/* Table Body */}
                <FlatList
                  contentContainerStyle={{}}
                  data={detailShift?.shiftDetailEmployees}
                  keyExtractor={item => item.id}
                  style={styles.bodyScroll}
                  renderItem={renderTable}
                  ref={flatListRef}
                  ListEmptyComponent={
                    !isLoading &&
                    detailShift?.shiftDetailEmployees?.length === 0 ? (
                      <Text
                        style={[
                          AppStyles.text,
                          {
                            flex: 1,
                            textAlign: 'center',
                            justifyContent: 'center',
                            paddingVertical: spacing.small,
                          },
                        ]}
                      >
                        {t(`message.empty`)}
                      </Text>
                    ) : null
                  }
                  ListFooterComponent={renderFooter}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      // onRefresh={onRefresh}
                    />
                  }
                  onEndReached={() => {
                    if (!onEndReachedCalledDuringMomentum.current) {
                      console.log('abc');

                      handleLoadMore();
                      onEndReachedCalledDuringMomentum.current = true;
                    }
                  }}
                  onMomentumScrollBegin={() => {
                    onEndReachedCalledDuringMomentum.current = false;
                  }}
                  onEndReachedThreshold={0.2}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </ScrollView>
            /* ))} */
          )}
          {detailShift.appliesTo === 'OrgStruct' && (
            // {/* {workType.map(type => ( */}
            <View
              style={{
                marginVertical: spacing.small,
                paddingBottom: spacing.small,
                marginBottom: spacing.medium,
                borderWidth: 1,
                borderColor: colors.black,
                borderRadius: 10,
              }}
            >
              <Text
                style={[
                  AppStyles.text,
                  {
                    paddingHorizontal: spacing.medium,
                    backgroundColor: colors.background,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    borderColor: colors.black,
                    borderWidth: 0.1,
                  },
                ]}
              >
                {t('Tên đơn vị')}
              </Text>
              <View style={styles.structType}>
                {detailShift.shiftDetailOrgStructs.map((item, index) => (
                  <>
                    <View
                      style={[
                        AppStyles.line,
                        { marginVertical: 0, marginBottom: spacing.small },
                      ]}
                    />
                    <Text
                      key={index}
                      style={[
                        AppStyles.text,
                        { paddingHorizontal: spacing.medium },
                      ]}
                    >
                      {item.orgStruct.orgStructName}
                    </Text>
                  </>
                ))}
              </View>
            </View>
            /* ))} */
          )}
        </View>
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
  form: { padding: spacing.small, paddingBottom: spacing.medium },
  table: {
    flex: 1,
    backgroundColor: colors.background,
    marginBottom: spacing.medium,
    padding: spacing.small,
    paddingTop: 0,
  },
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    alignItems: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    alignItems: 'center',
  },
  checkboxCell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#9ca3af',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  cell: {
    color: '#222',
    paddingHorizontal: spacing.small,
    textAlign: 'center',
    paddingVertical: 4,
    minWidth: ms(100),
  },
  loadMoreText: {
    color: '#f97316',
    fontWeight: 'bold',
  },
  headerCell: {
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
    paddingVertical: 4,
    paddingHorizontal: spacing.small,
    minWidth: ms(100),
  },
  bodyScroll: { flex: 1 },
  loadMoreBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
    borderRadius: 6,
  },
  structType: {
    backgroundColor: colors.white,
  },
});

export default Details_Shift;
