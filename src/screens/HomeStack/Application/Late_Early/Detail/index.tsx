import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
} from 'react-native';
import CustomHeader from '../../../../../navigation/CustomHeader';
import icons from '../../../../../assets/icons';
import { useTranslation } from 'react-i18next';
import { ms, spacing } from '../../../../../utils/spacing';
import {
  createEarly_LateApplication,
  getDetail_Early_LateApplications,
  updateEarly_LateApplication,
} from '../../../../../services/application';
import { colors } from '../../../../../utils/color';
import { pick } from '@react-native-documents/picker';
import ModalPickDate from '../../../../../components/modal/ModalPickDate';
import moment from 'moment';
import { employee_GetAll } from '../../../../../services/hr';
import {
  getAllDetailShifts,
  GetAllShifts,
} from '../../../../../services/Shift';
import { usePaginatedList } from '../../../../../components/Paginated';
import { lo } from '../../../../../language/Resource';
import ModalSelectList from '../../../../../components/modal/ModalSelectList';

const Detail_Late_Early = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { id, mode: initialMode } = route.params || {};
  const [mode, setMode] = useState(
    initialMode === 'create' ? 'create' : 'view',
  );
  const [loading, setLoading] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [date, setDate] = useState<Date>(moment().toDate());
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [selectedShiftIds, setSelectedShiftIds] = useState([]);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
  // State cố định các trường
  const [formData, setFormData] = useState({
    createdBy: '',
    struct: '',
    docDate: '',
    fromDate: '',
    toDate: '',
    appliesDays: '',
    appliesShifts: '',
    groupReason: '',
    reason: '',
    lateStartShift: '',
    soonMidShift: '',
    lateMidShift: '',
    soonEndShift: '',
    status: '',
    note: '',
    time: '',
    timeAdjustmentShiftRequestLines: [],
    timeAdjustmentRelEmpRequestLines: [],
    timeAdjustmentFileRequestLines: [],
  });
  const [attachedFile, setAttachedFile] = useState<any[]>([]);

  const employeePaginated = usePaginatedList(employee_GetAll, 20, {});
  const shiftPaginated = usePaginatedList(GetAllShifts, 20, {});

  // Thay đổi: lưu tạm selected items trong modal, cập nhật khi xác nhận
  const [tempSelectedShiftIds, setTempSelectedShiftIds] = useState([]);
  const [tempSelectedEmployeeIds, setTempSelectedEmployeeIds] = useState([]);

  useEffect(() => {
    if (mode === 'view' && id) {
      fetchData();
      employeePaginated.fetchData(1, true);

      shiftPaginated.fetchData(1, true);
    }
    if (mode === 'create') {
      setFormData({
        createdBy: '',
        struct: '',
        docDate: '',
        fromDate: '',
        toDate: '',
        appliesDays: '',
        appliesShifts: '',
        groupReason: '',
        reason: '',
        lateStartShift: '',
        soonMidShift: '',
        lateMidShift: '',
        soonEndShift: '',
        status: '',
        note: '',
        time: '',
        timeAdjustmentShiftRequestLines: [],
        timeAdjustmentRelEmpRequestLines: [],
        timeAdjustmentFileRequestLines: [],
      });
      setAttachedFile([]);
      employeePaginated.fetchData(1, true);
      shiftPaginated.fetchData(1, true);
    }
  }, [mode, id]);

  // Khi mở modal, đồng bộ selected ids từ formData (chỉ khi mở modal lần đầu)
  useEffect(() => {
    if (showShiftModal) {
      const ids = formData.timeAdjustmentShiftRequestLines.map(
        item => item.shiftId,
      );
      setSelectedShiftIds(ids);
      setTempSelectedShiftIds(ids);
    }
  }, [showShiftModal]); // chỉ phụ thuộc showShiftModal

  useEffect(() => {
    if (showEmployeeModal) {
      const ids = formData.timeAdjustmentRelEmpRequestLines.map(
        item => item.employeeId,
      );
      setSelectedEmployeeIds(ids);
      setTempSelectedEmployeeIds(ids);
    }
  }, [showEmployeeModal]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getDetail_Early_LateApplications(id);
      console.log('Detail Early Late Application data:', res);

      setFormData({
        createdBy: res.createdBy ?? '',
        struct: res.struct ?? '',
        docDate: moment(res.docDate).format('DD/MM/YYYY') ?? '',
        fromDate: moment(res.fromDate).format('DD/MM/YYYY') ?? '',
        toDate: moment(res.toDate).format('DD/MM/YYYY') ?? '',
        appliesDays: res.appliesDays ?? '',
        appliesShifts: res.appliesShifts ?? '',
        groupReason: res.groupReason ?? '',
        reason: res.reason ?? '',
        lateStartShift: res.lateStartShift?.toString() ?? '',
        soonMidShift: res.soonMidShift?.toString() ?? '',
        lateMidShift: res.lateMidShift?.toString() ?? '',
        soonEndShift: res.soonEndShift?.toString() ?? '',
        status: res.status ?? '',
        note: res.note ?? '',
        time: res.time ?? '',
        timeAdjustmentShiftRequestLines:
          res.timeAdjustmentShiftRequestLines ?? [],
        timeAdjustmentRelEmpRequestLines:
          res.timeAdjustmentRelEmpRequestLines ?? [],
        timeAdjustmentFileRequestLines:
          res.timeAdjustmentFileRequestLines ?? [],
      });
      if (res.attachedFiles && res.attachedFiles.length > 0) {
        setAttachedFile(res.attachedFiles);
      }
      console.log('formData', formData);
    } catch (error) {
      console.error('Error fetching detail Early Late Application:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    // Nếu trường là số
    if (
      [
        'lateStartShift',
        'soonMidShift',
        'lateMidShift',
        'soonEndShift',
      ].includes(key)
    ) {
      setFormData(prev => ({
        ...prev,
        [key]: value === '' ? '' : value.replace(/[^0-9]/g, ''),
      }));
    } else {
      setFormData(prev => ({ ...prev, [key]: value }));
    }
  };

  const handlePickFile = async () => {
    try {
      const res = await pick({
        mode: 'import',
        allowMultiSelection: true,
      });
      setAttachedFile(prev => [...prev, ...res]);
    } catch (err) {
      console.log('File pick error:', err);
    }
  };

  const handleSave = async () => {
    const form = new FormData();

    // Chỉ lấy mảng id cho shift và employee
    const shiftLines = Array.isArray(formData.timeAdjustmentShiftRequestLines)
      ? formData.timeAdjustmentShiftRequestLines
          .map(item => item.shiftId)
          .filter(Boolean)
      : [];

    const relEmpLines = Array.isArray(formData.timeAdjustmentRelEmpRequestLines)
      ? formData.timeAdjustmentRelEmpRequestLines
          .map(item => item.employeeId)
          .filter(Boolean)
      : [];

    // Chuyển ngày sang ISO string
    const toISO = v => {
      if (!v) return '';
      // Nếu đã là ISO thì giữ nguyên, nếu là 'DD/MM/YYYY' thì convert
      if (typeof v === 'string' && v.includes('T')) return v;
      return moment(v, 'DD/MM/YYYY').toISOString();
    };

    const payload = {
      docDate: toISO(formData.docDate),
      time: formData.time,
      fromDate: toISO(formData.fromDate),
      toDate: toISO(formData.toDate),
      appliesDays: formData.appliesDays,
      groupReason: formData.groupReason,
      reason: formData.reason,
      lateStartShift: Number(formData.lateStartShift) || 0,
      soonMidShift: Number(formData.soonMidShift) || 0,
      lateMidShift: Number(formData.lateMidShift) || 0,
      soonEndShift: Number(formData.soonEndShift) || 0,
      timeAdjustmentShiftRequestLines: shiftLines,
      timeAdjustmentRelEmpRequestLines: relEmpLines,
      timeAdjustmentFileRequestLines: [],
      // ...add other fields if needed...
    };

    form.append('Model', JSON.stringify(payload));
    if (attachedFile.length > 0) {
      attachedFile.forEach(file => {
        form.append('Files', {
          uri: file.uri,
          type: file.type,
          name: file.name,
        } as any);
      });
    }
    for (let pair of (form as any)._parts) {
      console.log(pair[0], ':', pair[1]);
    }
    try {
      if (mode === 'create') {
        await createEarly_LateApplication(form);
      } else {
        console.log(
          'Updating Early Late Application with id:',
          id,
          'form',
          form,
        );

        // await updateEarly_LateApplication(id, form);
      }
      setMode('view');
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (event?.type === 'dismissed') {
      console.log('Date picker dismissed');
      return;
    }

    if (!selectedDate) {
      console.error('Invalid selectedDate:', selectedDate);
      return;
    }

    console.log('Selected date:', selectedDate);

    setShowTimePicker(false);
    setDate(selectedDate);

    if (selectedField) {
      console.log('Updating field:', selectedField);
      setFormData(prev => ({
        ...prev,
        [selectedField]: moment(selectedDate).format('DD/MM/YYYY'),
      }));
    } else {
      console.error('No field selected for date update');
    }
  };

  // Khi xác nhận chọn shift
  const handleShiftSelected = items => {
    console.log('selected shifts: ', items);

    // Đảm bảo giữ lại tất cả các ca đã chọn trước đó + các ca vừa chọn ở trang hiện tại
    // Loại bỏ trùng lặp theo shiftId
    setSelectedShiftIds(items.map(item => item.id));
    console.log('selectedShiftIds: ', selectedShiftIds);

    // ];
    // const uniqueShifts = [];
    // const seen = new Set();
    // for (const item of allShifts) {
    //   if (!seen.has(item.shiftId)) {
    //     uniqueShifts.push(item);
    //     seen.add(item.shiftId);
    //   }
    // }
    // setFormData(prev => ({
    //   ...prev,
    //   timeAdjustmentShiftRequestLines: uniqueShifts,
    // }));
    // setSelectedShiftIds(tempSelectedShiftIds);
    // setShowShiftModal(false);
  };

  // Khi xác nhận chọn employee
  const handleEmployeeSelected = items => {
    console.log('selected ', items);

    const allEmployees = [
      ...formData.timeAdjustmentRelEmpRequestLines.filter(
        item => !tempSelectedEmployeeIds.includes(item.employeeId),
      ),
      ...employeePaginated.data.filter(item =>
        tempSelectedEmployeeIds.includes(item.employeeId),
      ),
    ];
    const uniqueEmployees = [];
    const seen = new Set();
    for (const item of allEmployees) {
      if (!seen.has(item.employeeId)) {
        uniqueEmployees.push(item);
        seen.add(item.employeeId);
      }
    }
    setFormData(prev => ({
      ...prev,
      timeAdjustmentRelEmpRequestLines: uniqueEmployees,
    }));
    setSelectedEmployeeIds(tempSelectedEmployeeIds);
    setShowEmployeeModal(false);
  };

  const renderSelectItem = ({
    item,
    selectedIds,
    displayKey,
    onSelect,
    idKey,
  }) => {
    const id = item[idKey];
    const selected = selectedIds.includes(id);
    return (
      <TouchableOpacity
        style={[
          styles.renderItem,
          {
            backgroundColor: selected ? colors.primary : colors.white,
            padding: spacing.small,
          },
        ]}
        onPress={() => onSelect(id)}
      >
        <Text style={{ flex: 1 }}>{item[displayKey]}</Text>
        {selected && (
          <Text style={{ color: 'green', fontWeight: 'bold' }}>✓</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        label={
          mode === 'create'
            ? 'Tạo đơn đi muộn/về sớm'
            : 'Chi tiết đi muộn/về sớm'
        }
        Home={false}
        rightIcon={icons.back}
        rightPress={() => navigation.goBack()}
      />
      <View style={styles.buttonRow}>
        {mode === 'view' && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => setMode('edit')}
          >
            <Text style={styles.buttonText}>Sửa</Text>
          </TouchableOpacity>
        )}
        {mode === 'edit' && (
          <>
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Lưu</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setMode('view')}
            >
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <ScrollView>
        <View style={styles.content}>
          {/* Cột trái */}
          <View style={styles.column}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Applicant</Text>
              <Text style={[styles.input, { backgroundColor: colors.Gray }]}>
                {formData.createdBy || '-'}
              </Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Org Struct</Text>
              <Text style={[styles.input, { backgroundColor: colors.Gray }]}>
                {formData.struct || '-'}
              </Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Application date</Text>
              <TouchableOpacity
                disabled={mode === 'view'}
                onPress={() => {
                  setSelectedField('docDate');
                  setDate(
                    formData.docDate
                      ? moment(formData.docDate, 'DD/MM/YYYY').toDate()
                      : new Date(),
                  );
                  setShowTimePicker(true);
                }}
              >
                <TextInput
                  style={styles.input}
                  value={
                    formData.docDate
                      ? moment(formData.docDate, 'DD/MM/YYYY').isValid()
                        ? moment(formData.docDate, 'DD/MM/YYYY').format(
                            'DD/MM/YYYY',
                          )
                        : ''
                      : ''
                  }
                  placeholder="Application date"
                  editable={false}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>From date</Text>
              <TouchableOpacity
                disabled={mode === 'view'}
                onPress={() => {
                  setSelectedField('fromDate');
                  setDate(
                    formData.fromDate
                      ? moment(formData.fromDate, 'DD/MM/YYYY').toDate()
                      : new Date(),
                  );
                  setShowTimePicker(true);
                }}
              >
                <TextInput
                  style={styles.input}
                  value={
                    formData.fromDate
                      ? moment(formData.fromDate, 'DD/MM/YYYY').isValid()
                        ? moment(formData.fromDate, 'DD/MM/YYYY').format(
                            'DD/MM/YYYY',
                          )
                        : ''
                      : ''
                  }
                  placeholder="From date"
                  editable={false}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>To date</Text>
              <TouchableOpacity
                disabled={mode === 'view'}
                onPress={() => {
                  setSelectedField('toDate');
                  setDate(
                    formData.toDate
                      ? moment(formData.toDate, 'DD/MM/YYYY').toDate()
                      : new Date(),
                  );
                  setShowTimePicker(true);
                }}
              >
                <TextInput
                  style={styles.input}
                  value={
                    formData.toDate
                      ? moment(formData.toDate, 'DD/MM/YYYY').isValid()
                        ? moment(formData.toDate, 'DD/MM/YYYY').format(
                            'DD/MM/YYYY',
                          )
                        : ''
                      : ''
                  }
                  placeholder="To date"
                  editable={false}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Applies days</Text>
              <TextInput
                style={styles.input}
                value={formData.appliesDays}
                onChangeText={val => handleChange('appliesDays', val)}
                placeholder="Applies days"
                editable={mode !== 'view'}
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Applies shifts</Text>
              <TouchableOpacity
                disabled={mode === 'view'}
                onPress={() => setShowShiftModal(true)}
              >
                <TextInput
                  style={styles.input}
                  value={
                    Array.isArray(formData.timeAdjustmentShiftRequestLines)
                      ? formData.timeAdjustmentShiftRequestLines
                          .map(
                            item =>
                              item.shiftName ||
                              item.name ||
                              item.shift?.shiftName,
                          )
                          .filter(Boolean)
                          .join(', ')
                      : ''
                  }
                  placeholder="Applies shifts"
                  editable={false}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Reason group</Text>
              <TextInput
                style={styles.input}
                value={formData.groupReason}
                onChangeText={val => handleChange('groupReason', val)}
                placeholder="Reason group"
                editable={mode !== 'view'}
              />
            </View>
          </View>
          {/* Cột phải */}
          <View style={styles.column}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Reaon</Text>
              <TextInput
                style={styles.input}
                value={formData.reason}
                onChangeText={val => handleChange('reason', val)}
                placeholder="Reason"
                editable={mode !== 'view'}
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Start shift late</Text>
              <TextInput
                style={styles.input}
                value={formData.lateStartShift}
                onChangeText={val => handleChange('lateStartShift', val)}
                placeholder="Start shift late"
                editable={mode !== 'view'}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Early mid shift</Text>
              <TextInput
                style={styles.input}
                value={formData.soonMidShift}
                onChangeText={val => handleChange('soonMidShift', val)}
                placeholder="Early mid shift"
                editable={mode !== 'view'}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Late mid shift</Text>
              <TextInput
                style={styles.input}
                value={formData.lateMidShift}
                onChangeText={val => handleChange('lateMidShift', val)}
                placeholder="Late mid shift"
                editable={mode !== 'view'}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Early end shift</Text>
              <TextInput
                style={styles.input}
                value={formData.soonEndShift}
                onChangeText={val => handleChange('soonEndShift', val)}
                placeholder="Early end shift"
                editable={mode !== 'view'}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Người duyệt</Text>
              <TextInput
                style={styles.input}
                value={formData.status}
                onChangeText={val => handleChange('status', val)}
                placeholder="Người duyệt"
                editable={mode !== 'view'}
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Người liên quan</Text>
              <TouchableOpacity
                disabled={mode === 'view'}
                onPress={() => setShowEmployeeModal(true)}
              >
                <TextInput
                  style={[styles.input, { flexShrink: 1 }]}
                  value={
                    Array.isArray(formData.timeAdjustmentRelEmpRequestLines)
                      ? formData.timeAdjustmentRelEmpRequestLines
                          .map(
                            item =>
                              item.fullName ||
                              item.name ||
                              item.employee?.fullName,
                          )
                          .filter(Boolean)
                          .join(', ')
                      : ''
                  }
                  placeholder="Người liên quan"
                  editable={false}
                  multiline={false}
                  scrollEnabled={true}
                  numberOfLines={1}
                  textAlignVertical="center"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Status</Text>
              <TextInput
                style={styles.input}
                value={formData.status}
                onChangeText={val => handleChange('status', val)}
                placeholder="Status"
                editable={mode !== 'view'}
              />
            </View>
          </View>
        </View>
        {/* Tài liệu đính kèm */}
        <TouchableOpacity
          disabled={!(mode === 'edit' || mode === 'create')}
          style={styles.section}
          onPress={handlePickFile}
        >
          <Text style={styles.sectionTitle}>Tài liệu đính kèm</Text>
          {attachedFile.length > 0 ? (
            attachedFile.map((file, idx) => (
              <View
                key={idx}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: spacing.small,
                }}
              >
                <Text style={styles.sectionValue}>{file.name}</Text>
                <TouchableOpacity
                  onPress={() => {
                    setAttachedFile(prev => prev.filter((_, i) => i !== idx));
                  }}
                  style={{
                    marginLeft: spacing.small,
                    paddingHorizontal: spacing.small,
                    backgroundColor: '#eee',
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ color: 'red', fontWeight: 'bold' }}>X</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.sectionValue}>Chưa có dữ liệu</Text>
          )}
        </TouchableOpacity>
        {/* Ghi chú */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ghi chú</Text>
          <View style={styles.noteBox}>
            <TextInput
              style={[styles.input]}
              value={formData.note || ''}
              onChangeText={val => handleChange('note', val)}
              placeholder="Nhập ghi chú"
              editable={mode !== 'view'}
            />
          </View>
        </View>
      </ScrollView>
      {/* Modal chọn ca làm việc */}
      <ModalSelectList
        visible={showShiftModal}
        title="Chọn ca làm việc"
        data={shiftPaginated.data}
        keyExtractor={item => item.shiftId}
        refreshing={shiftPaginated.refreshing}
        onRefresh={shiftPaginated.handleRefresh}
        onEndReached={shiftPaginated.handleLoadMore}
        onSearch={search =>
          shiftPaginated.fetchData(1, true, { Search: search })
        }
        onClose={() => setShowShiftModal(false)}
        selectedIds={tempSelectedShiftIds}
        onSelected={handleShiftSelected}
        renderItem={({ item }) =>
          renderSelectItem({
            item,
            selectedIds: tempSelectedShiftIds,
            displayKey: 'shiftName',
            onSelect: shiftId => {
              setTempSelectedShiftIds(prev =>
                prev.includes(shiftId)
                  ? prev.filter(i => i !== shiftId)
                  : [...prev, shiftId],
              );
            },
            idKey: 'id',
          })
        }
      />
      {/* Modal chọn nhân viên liên quan */}
      <ModalSelectList
        visible={showEmployeeModal}
        title="Chọn nhân viên liên quan"
        data={employeePaginated.data}
        keyExtractor={item => item.employeeId}
        refreshing={employeePaginated.refreshing}
        onRefresh={employeePaginated.handleRefresh}
        onEndReached={employeePaginated.handleLoadMore}
        onSearch={search =>
          employeePaginated.fetchData(1, true, { Search: search })
        }
        onClose={() => setShowEmployeeModal(false)}
        selectedIds={tempSelectedEmployeeIds}
        onSelected={handleEmployeeSelected}
        renderItem={({ item }) =>
          renderSelectItem({
            item,
            selectedIds: tempSelectedEmployeeIds,
            displayKey: 'fullName',
            onSelect: employeeId => {
              setTempSelectedEmployeeIds(prev =>
                prev.includes(employeeId)
                  ? prev.filter(i => i !== employeeId)
                  : [...prev, employeeId],
              );
            },
            idKey: 'id',
          })
        }
      />
      <ModalPickDate
        visible={showTimePicker}
        value={date}
        onChange={handleDateChange}
        onClose={() => setShowTimePicker(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: spacing.medium,
    paddingTop: 0,
  },
  button: {
    backgroundColor: '#ff5722',
    paddingHorizontal: 20,
    paddingVertical: spacing.small,
    borderRadius: 6,
    marginLeft: spacing.small,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  content: {
    flexDirection: 'row',
    padding: spacing.medium,
    gap: 16,
    backgroundColor: colors.white,
    marginHorizontal: spacing.medium,
  },
  column: { flex: 1, gap: 12 },
  fieldContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 4,
  },
  label: { fontWeight: 'bold', color: '#333', marginBottom: 2 },
  value: { color: '#222' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: spacing.small,
    marginTop: 4,
    color: '#222',
    backgroundColor: '#fff',
  },
  section: {
    marginTop: 24,
    marginHorizontal: spacing.medium,
    padding: spacing.medium,
    backgroundColor: colors.white,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: spacing.small,
  },
  sectionValue: { color: '#888' },
  noteBox: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: spacing.small,
    padding: 12,
    backgroundColor: '#fafafa',
    marginBottom: spacing.small,
  },
  renderItem: {
    flex: 1,
    borderWidth: 0.5,
    marginBottom: spacing.small,
    padding: spacing.small,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Detail_Late_Early;
