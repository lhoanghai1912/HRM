import React, { act, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import CustomHeader from '../../../../../../components/CustomHeader';
import icons from '../../../../../../assets/icons';
import AppStyles from '../../../../../../components/AppStyle';
import { spacing } from '../../../../../../utils/spacing';
import { useTranslation } from 'react-i18next';
import { navigate } from '../../../../../../navigation/RootNavigator';
import { Screen_Name } from '../../../../../../navigation/ScreenName';
import ModalPicker from '../../../../../../components/modal/ModalPicker';
import ModalCalendar from '../../../../../../components/modal/ModalCalendar';
import { createStyles } from './styles';
import useColors from '../../../../../../hooks/useColors';

export default function Leave({ navigation, route }) {
  const { t } = useTranslation();
  const colors = useColors();
  const styles = createStyles(colors);

  const { label, status } = route.params;
  const [mode, setMode] = useState(route.params.status);
  const [data, setData] = useState<any>({});
  const [form, setForm] = useState({
    employeeCode: data?.employeeCode || 'NV00001',
    employeeName: data?.employeeName || 'Phạm Quỳnh Anh',
    leaveType: {
      id: null,
      value: '',
    },
    remainDays: 0,
    maxDays: 0,
    fromShift: {
      id: null,
      value: '',
    },
    fromDate: '',
    toShift: {
      id: null,
      value: '',
    },
    toDate: '',
    days: '',
    reason: '',
  });

  const [leaveTypeData] = useState({
    pageData: [
      { id: 1, pickListValue: 'Nghỉ phép năm' },
      { id: 2, pickListValue: 'Nghỉ không lương' },
      { id: 3, pickListValue: 'Nghỉ ốm' },
    ],
  });

  const [leaveShiftData] = useState({
    pageData: [
      { id: 1, pickListValue: 'Ca sáng' },
      { id: 2, pickListValue: 'Ca chiều' },
      { id: 3, pickListValue: 'Ca tối' },
    ],
  });

  const [pickerVisible, setPickerVisible] = useState(false);
  const [activePicker, setActivePicker] = useState('');
  const [labelPicker, setLabelPicker] = useState('');
  const [pickerData, setPickerData] = useState({ pageData: [] as any[] });
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [calendarField, setCalendarField] = useState(null);
  const [calendarValue, setCalendarValue] = useState<string>(''); // yyyy-MM-dd
  const isView = mode === 'view';

  const handleChange = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const renderLabelValue = (label, value, boldValue) => (
    <View style={styles.row}>
      <Text style={[AppStyles.text, styles.label]}>{label}</Text>
      <Text style={[styles.value, boldValue && styles.valueBold]}>{value}</Text>
    </View>
  );

  const renderLabelInput = (label, required, key, placeholder) => (
    <View style={[styles.field]}>
      <View style={styles.rowLabel}>
        <Text style={[AppStyles.text, styles.label]}>{label}</Text>
        {required && <Text style={[AppStyles.text, styles.required]}> *</Text>}
      </View>
      <TextInput
        style={[styles.input]}
        value={String(form[key] ?? '')}
        placeholder={placeholder}
        onChangeText={text => handleChange(key, text)}
        multiline={key === 'reason'} // và dòng này
        textAlignVertical={key === 'reason' ? 'top' : 'center'} // cho chữ bắt đầu từ trên
        numberOfLines={key === 'reason' ? 99 : 1} // tùy, có thể bỏ
      />
    </View>
  );

  const renderSelectPicker = (
    label: string,
    required: boolean,
    onPress: () => void,
    value?: string,
  ) => (
    <TouchableOpacity style={[styles.field]} onPress={onPress}>
      <View style={styles.rowLabel}>
        <Text style={[AppStyles.text, styles.label]}>{label}</Text>
        {required && <Text style={[AppStyles.text, styles.required]}> *</Text>}
      </View>
      {/* <View pointerEvents="none">
        <TextInput
          style={[styles.input]}
          placeholder={`Chọn ${label.toLowerCase()}`}
          value={value}
          editable={false}
        />
      </View> */}
      <View
        style={[
          styles.input,
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
          },
        ]}
      >
        <Text style={[styles.value]}>
          {value || `Chọn ${label.toLowerCase()}`}
        </Text>
        <Image
          style={[AppStyles.icon, { tintColor: colors.text }]}
          source={icons.down}
        />
      </View>
    </TouchableOpacity>
  );

  const handleSave = () => {
    if (mode === 'create') {
      setMode('view');
    } else if (mode === 'view') {
      setMode('create');
    }
  };

  const handleSelectedItem = (activePicker, value, label) => {
    if (!activePicker) return;
    else {
      console.log('selected item:', activePicker, value, label);

      setForm(prev => ({
        ...prev,
        [activePicker]: { id: value, value: label },
      }));
    }
  };

  const toIsoDate = (d: string) => {
    if (!d) return '';
    const [day, month, year] = d.split('/');
    if (!day || !month || !year) return '';
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const todayIso = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const handleOpenCalendar = field => {
    setCalendarField(field);
    const currentDisplay = form[field]; // dd/MM/yyyy

    const iso = currentDisplay ? toIsoDate(currentDisplay) : todayIso();
    setCalendarValue(iso);

    setCalendarVisible(true);
  };

  const handleSelectedDate = dateString => {
    console.log('calendarField', calendarField);

    // dateString ví dụ: "2025-06-10"
    const [y, m, d] = dateString.split('-');
    const formatted = `${d}/${m}/${y}`;

    setForm(prev => ({
      ...prev,
      [calendarField]: formatted,
    }));
    setCalendarValue(dateString);
  };

  const handleReset = () => {
    setForm({
      employeeCode: data?.employeeCode || 'NV00001',
      employeeName: data?.employeeName || 'Phạm Quỳnh Anh',
      leaveType: {
        id: null,
        value: '',
      },
      remainDays: 0,
      maxDays: 0,
      fromShift: {
        id: null,
        value: '',
      },
      fromDate: '',
      toShift: {
        id: null,
        value: '',
      },
      toDate: '',
      days: '',
      reason: '',
    });
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        label={` ${isView ? t(`Detail`) : t(`Create`)} ${label.toLowerCase()}`}
        leftIcon={icons.back}
        leftPress={() => navigate(Screen_Name.Application_List)}
        rightIcon={mode === 'create' ? null : icons.add}
        rightPress={() => handleSave()}
        profileIcon={icons.username}
      />
      <View>
        <ScrollView contentContainerStyle={styles.content}>
          {/* Mã NV + Tên NV (đều là text ở cả 2 mode) */}
          {/* {renderLabelValue('Mã nhân viên', form.employeeCode, true)}
        {renderLabelValue('Tên nhân viên', form.employeeName, true)} */}

          {/* Loại chế độ */}
          {isView
            ? renderLabelValue(
                'Loại chế độ',
                data.leaveType || 'Nghỉ phép',
                true,
              )
            : renderSelectPicker(
                'Loại chế độ',
                true,
                () => {
                  setPickerVisible(true);
                  setActivePicker('leaveType');
                  setLabelPicker('Loại chế độ');
                  setPickerData(leaveTypeData);
                },
                form.leaveType?.value || '',
              )}
          {/* <View style={{ marginTop: spacing.medium }}> */}
          {!isView ? (
            <>
              {renderLabelValue('Số ngày phép còn lại', form.remainDays, true)}
              {renderLabelValue('Số ngày nghỉ tối đa', form.maxDays, true)}
            </>
          ) : (
            <></>
          )}
          {/* </View> */}

          {/* Các field riêng của màn create */}
          {!isView && (
            <>
              {/* Từ */}
              <>
                <View style={styles.rowLabel}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[AppStyles.text, styles.label]}
                  >
                    Từ
                  </Text>
                  <Text style={[AppStyles.text, styles.required]}> *</Text>
                </View>

                <View style={styles.row}>
                  <TouchableOpacity
                    onPress={() => {
                      setPickerVisible(true);
                      setActivePicker('fromShift');

                      setLabelPicker('Ca làm việc');
                      setPickerData(leaveShiftData);
                    }}
                    style={[
                      styles.input,
                      {
                        marginRight: spacing.small,
                        flex: 0.4,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      },
                    ]}
                  >
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[styles.value]}
                    >
                      {form.fromShift.value || 'Chọn ca'}
                    </Text>
                    <Image
                      style={[AppStyles.icon, { tintColor: colors.text }]}
                      source={icons.down}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.input,
                      { marginRight: spacing.small, flex: 1 },
                    ]}
                    onPress={() => {
                      handleOpenCalendar('fromDate'),
                        console.log('calenDarField', calendarField);
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[AppStyles.text]}
                    >
                      {form.fromDate || 'Chọn ngày ...'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>

              {/* Đến */}
              <>
                <View style={styles.rowLabel}>
                  <Text style={[AppStyles.text, styles.label]}>Đến</Text>
                  <Text style={[AppStyles.text, styles.required]}> *</Text>
                </View>

                <View style={styles.row}>
                  <TouchableOpacity
                    onPress={() => {
                      setPickerVisible(true);
                      setActivePicker('toShift');

                      setLabelPicker('Ca làm việc');
                      setPickerData(leaveShiftData);
                    }}
                    style={[
                      styles.input,
                      {
                        marginRight: spacing.small,
                        flex: 0.4,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      },
                    ]}
                  >
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[styles.value]}
                    >
                      {form.toShift.value || 'Chọn ca'}
                    </Text>
                    <Image
                      style={[AppStyles.icon, { tintColor: colors.text }]}
                      source={icons.down}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.input,
                      { marginRight: spacing.small, flex: 1 },
                    ]}
                    onPress={() => {
                      handleOpenCalendar('toDate'),
                        console.log('calenDarField', calendarField);
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[AppStyles.text]}
                    >
                      {form.toDate || 'Chọn ngày ...'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            </>
          )}
          {renderLabelValue('Số ngày nghỉ', form.days || '0', true)}

          {/* Phần Từ / Đến / Số ngày nghỉ ở màn view */}
          {isView && (
            <>
              {renderLabelValue(
                'Từ',
                `${data.fromShift?.value || 'Ca sáng'}  ${
                  data.fromDate || '16/05/2025'
                }`,
                true,
              )}
              {renderLabelValue(
                'Đến',
                `${data.toShift?.value || 'Ca chiều'}  ${
                  data.toDate || '16/05/2025'
                }`,
                true,
              )}
              {renderLabelValue('Số ngày nghỉ', data.days || '02', true)}
            </>
          )}

          {/* Trạng thái */}
          {isView && (
            <View style={[styles.field, styles.row]}>
              <Text style={[AppStyles.text, styles.label]}>Trạng thái</Text>
              <View style={styles.statusBadge}>
                <Text style={[AppStyles.text, styles.statusText]}>
                  Đã duyệt
                </Text>
              </View>
            </View>
          )}

          {/* Lý do */}
          {isView ? (
            renderLabelValue('Lý do', data.reason || 'Không lí do ', true)
          ) : (
            <View style={{ marginBottom: spacing.medium }}>
              {renderLabelInput('Lý do', true, 'reason', 'Nhập lý do...')}
            </View>
          )}

          {/* Đính kèm */}
          {isView ? (
            <View>
              {renderLabelValue(
                'Đính kèm',
                data.reason || 'Tệp đính kèm',
                true,
              )}
            </View>
          ) : (
            <>
              <View style={[styles.field, styles.row]}>
                <Text style={[AppStyles.text, styles.label]}>Đính kèm</Text>
                <TouchableOpacity style={styles.attachBtn}>
                  <Text style={[AppStyles.text, styles.attachText]}>
                    Chọn file
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Timeline ở dưới màn view */}
          {isView && (
            <View style={styles.timeline}>
              <View style={styles.timelineItem}>
                <View style={styles.iconCircle} />
                <View style={styles.timelineText}>
                  <Text style={[AppStyles.text, styles.timelineTitle]}>
                    Phê duyệt
                  </Text>
                  <Text style={[AppStyles.text, styles.timelineDesc]}>
                    Ducpv 18/05/2025 8:33
                  </Text>
                </View>
              </View>

              <View style={styles.timelineItem}>
                <View style={styles.iconCircle} />
                <View style={styles.timelineText}>
                  <Text style={[AppStyles.text, styles.timelineTitle]}>
                    Gửi đơn
                  </Text>
                  <Text style={[AppStyles.text, styles.timelineDesc]}>
                    AnhPQ 18/05/2025 10:50
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Nút nộp đơn ở màn create */}
          {!isView && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: spacing.medium,
                paddingBottom: spacing.medium,
              }}
            >
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={() => {
                  handleReset();
                  // setMode('view');
                }}
              >
                <Text style={[AppStyles.text, styles.submitText]}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitBtn}
                onPress={() => {
                  handleSave();
                  setMode('view');
                }}
              >
                <Text style={[AppStyles.text, styles.submitText]}>Nộp đơn</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>

      <ModalPicker
        visible={pickerVisible}
        data={pickerData}
        fieldLabel={labelPicker.toLocaleLowerCase()}
        multi={false}
        selectedValue={form}
        onSelect={({ value, label }) => {
          // console.log(item);
          handleSelectedItem(activePicker, value, label);
        }}
        onClose={() => setPickerVisible(false)}
        onLoadMore={() => {}}
        loadingMore={false}
      />
      <ModalCalendar
        visible={calendarVisible}
        value={calendarValue} // yyyy-MM-dd
        selectedDate={calendarValue} // ngày đang chọn
        onSelect={handleSelectedDate}
        onClose={() => setCalendarVisible(false)}
      />
    </View>
  );
}
