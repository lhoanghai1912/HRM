import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import CustomHeader from '../../../../../../components/CustomHeader';
import icons from '../../../../../../assets/icons';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';
import { navigate } from '../../../../../../navigation/RootNavigator';
import { Screen_Name } from '../../../../../../navigation/ScreenName';
import { border, fonts, weight } from '../../../../../../utils/fontSize';
import { ms, spacing } from '../../../../../../utils/spacing';
import { colors } from '../../../../../../utils/color';
import AppStyles from '../../../../../../components/AppStyle';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import styles from '../style';

export default function Late_Early({ navigation, route }) {
  const { t } = useTranslation();

  const { label, status } = route.params;
  const [mode, setMode] = useState(route.params.status);
  const [data, setData] = useState<any>({});
  const [form, setForm] = useState({
    employeeCode: data?.employeeCode || 'NV00001',
    employeeName: data?.employeeName || 'Phạm Quỳnh Anh',
    leaveType: '',
    remainDays: 0,
    maxDays: 0,
    fromShift: '',
    fromDate: '',
    toShift: '',
    toDate: '',
    days: '',
    reason: '',
  });

  const isView = mode === 'view';

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const renderLabelValue = (label, value, boldValue) => (
    <View style={styles.row}>
      <Text style={[AppStyles.text, styles.label]}>{label}</Text>
      <Text style={[styles.value, boldValue && styles.valueBold]}>{value}</Text>
    </View>
  );

  const renderLabelInput = (label, required, key, placeholder) => (
    <View style={styles.field}>
      <View style={styles.rowLabel}>
        <Text style={[AppStyles.text, styles.label]}>{label}</Text>
        {required && <Text style={[AppStyles.text, styles.required]}> *</Text>}
      </View>
      <TextInput
        style={styles.input}
        value={String(form[key] ?? '')}
        placeholder={placeholder}
        onChangeText={text => handleChange(key, text)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <CustomHeader
        label={label}
        leftIcon={icons.back}
        leftPress={() => navigate(Screen_Name.Application_List)}
        rightIcon={icons.add}
        rightPress={() => {
          setMode('create');
        }}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Mã NV + Tên NV (đều là text ở cả 2 mode) */}
        {renderLabelValue('Mã nhân viên', form.employeeCode, true)}
        {renderLabelValue('Tên nhân viên', form.employeeName, true)}

        {/* Loại chế độ */}
        {isView ? (
          renderLabelValue('Loại chế độ', data.leaveType || 'Nghỉ phép', true)
        ) : (
          <View style={styles.field}>
            <View style={styles.rowLabel}>
              <Text style={[AppStyles.text, styles.label]}>Loại chế độ</Text>
              <Text style={[AppStyles.text, styles.required]}> *</Text>
            </View>

            {/* Tạm thời dùng TextInput, bạn có thể thay bằng Picker / Dropdown */}
            <TextInput
              style={styles.input}
              placeholder="Chọn loại chế độ"
              value={form.leaveType}
              onChangeText={text => handleChange('leaveType', text)}
            />
          </View>
        )}

        {/* Các field riêng của màn create */}
        {!isView && (
          <>
            {renderLabelInput('Số ngày phép còn lại', false, 'remainDays', '0')}
            {renderLabelInput('Số ngày nghỉ tối đa', false, 'maxDays', '0')}

            {/* Từ */}
            <View style={styles.field}>
              <View style={styles.rowLabel}>
                <Text style={[AppStyles.text, styles.label]}>Từ</Text>
                <Text style={[AppStyles.text, styles.required]}> *</Text>
              </View>

              <View style={styles.row}>
                <TextInput
                  style={[
                    styles.input,
                    styles.flex1,
                    { marginRight: spacing.small },
                  ]}
                  placeholder="Ca sáng / Ca chiều..."
                  value={form.fromShift}
                  onChangeText={text => handleChange('fromShift', text)}
                />
                <TextInput
                  style={[styles.input, styles.flex1]}
                  placeholder="dd/MM/yyyy"
                  value={form.fromDate}
                  onChangeText={text => handleChange('fromDate', text)}
                />
              </View>
            </View>

            {/* Đến */}
            <View style={styles.field}>
              <View style={styles.rowLabel}>
                <Text style={[AppStyles.text, styles.label]}>Đến</Text>
                <Text style={[AppStyles.text, styles.required]}> *</Text>
              </View>

              <View style={styles.row}>
                <TextInput
                  style={[
                    styles.input,
                    styles.flex1,
                    { marginRight: spacing.small },
                  ]}
                  placeholder="Ca sáng / Ca chiều..."
                  value={form.toShift}
                  onChangeText={text => handleChange('toShift', text)}
                />
                <TextInput
                  style={[styles.input, styles.flex1]}
                  placeholder="dd/MM/yyyy"
                  value={form.toDate}
                  onChangeText={text => handleChange('toDate', text)}
                />
              </View>
            </View>

            {renderLabelInput('Số ngày nghỉ', false, 'days', '0')}
          </>
        )}

        {/* Phần Từ / Đến / Số ngày nghỉ ở màn view */}
        {isView && (
          <>
            {renderLabelValue(
              'Từ',
              `${data.fromShift || 'Ca sáng'}  ${
                data.fromDate || '16/05/2025'
              }`,
              true,
            )}
            {renderLabelValue(
              'Đến',
              `${data.toShift || 'Ca chiều'}  ${data.toDate || '16/05/2025'}`,
              true,
            )}
            {renderLabelValue('Số ngày nghỉ', data.days || '02', true)}
          </>
        )}

        {/* Trạng thái */}
        {isView && (
          <View style={styles.field}>
            <Text style={[AppStyles.text, styles.label]}>Trạng thái</Text>
            <View style={styles.statusBadge}>
              <Text style={[AppStyles.text, styles.statusText]}>Đã duyệt</Text>
            </View>
          </View>
        )}

        {/* Lý do */}
        <View style={styles.field}>
          <Text style={[AppStyles.text, styles.label]}>Lý do</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            editable={!isView}
            multiline
            value={isView ? data.reason || '' : form.reason}
            onChangeText={text => handleChange('reason', text)}
          />
        </View>

        {/* Đính kèm */}
        <View style={styles.field}>
          <Text style={[AppStyles.text, styles.label]}>Đính kèm</Text>
          {isView ? (
            <Text style={[AppStyles.text, styles.value]}>photo.png 🖼️</Text>
          ) : (
            <TouchableOpacity style={styles.attachBtn}>
              <Text style={[AppStyles.text, styles.attachText]}>Chọn file</Text>
            </TouchableOpacity>
          )}
        </View>

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
                  Ducpv 1border.radiusMedium/05/2025 spacing.medium:33
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
                  AnhPQ 1border.radiusMedium/05/2025 10:50
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Nút nộp đơn ở màn create */}
      </ScrollView>
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
              // Xử lý nộp đơn ở đây
              setMode('view');
            }}
          >
            <Text style={[AppStyles.text, styles.submitText]}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={() => {
              setMode('view');
            }}
          >
            <Text style={[AppStyles.text, styles.submitText]}>Nộp đơn</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
