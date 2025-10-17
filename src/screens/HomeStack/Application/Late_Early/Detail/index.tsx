import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import CustomHeader from '../../../../../navigation/CustomHeader';
import icons from '../../../../../assets/icons';
import { useTranslation } from 'react-i18next';
import { spacing } from '../../../../../utils/spacing';
import {
  createEarly_LateApplication,
  getDetail_Early_LateApplications,
  updateEarly_LateApplication,
} from '../../../../../services/application';
import { colors } from '../../../../../utils/color';
import { pick } from '@react-native-documents/picker';

const Detail_Late_Early = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { id, mode: initialMode } = route.params || {};
  const [mode, setMode] = useState(
    initialMode === 'create' ? 'create' : 'view',
  );
  const [loading, setLoading] = useState(false);

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
    relativeEmployee: '',
    note: '',
    timeAdjustmentShiftRequestLines: [],
    timeAdjustmentRelEmpRequestLines: [],
    timeAdjustmentFileRequestLines: [],
  });
  const [attachedFile, setAttachedFile] = useState<any[]>([]);

  useEffect(() => {
    if (mode === 'view' && id) {
      fetchData();
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
        relativeEmployee: '',
        note: '',
        timeAdjustmentShiftRequestLines: [],
        timeAdjustmentRelEmpRequestLines: [],
        timeAdjustmentFileRequestLines: [],
      });
      setAttachedFile([]);
    }
  }, [mode, id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getDetail_Early_LateApplications(id);
      console.log('Detail Early Late Application data:', res);

      setFormData({
        createdBy: res.createdBy ?? '',
        struct: res.struct ?? '',
        docDate: res.docDate ?? '',
        fromDate: res.fromDate ?? '',
        toDate: res.toDate ?? '',
        appliesDays: res.appliesDays ?? '',
        appliesShifts: res.appliesShifts ?? '',
        groupReason: res.groupReason ?? '',
        reason: res.reason ?? '',
        lateStartShift: res.lateStartShift?.toString() ?? '',
        soonMidShift: res.soonMidShift?.toString() ?? '',
        lateMidShift: res.lateMidShift?.toString() ?? '',
        soonEndShift: res.soonEndShift?.toString() ?? '',
        status: res.status ?? '',
        relativeEmployee: res.relativeEmployee ?? '',
        note: res.note ?? '',
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
    form.append('Model', JSON.stringify(formData));
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
              <TextInput
                style={styles.input}
                value={formData.docDate}
                onChangeText={val => handleChange('docDate', val)}
                placeholder="Application date"
                editable={mode !== 'view'}
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>From date</Text>
              <TextInput
                style={styles.input}
                value={formData.fromDate}
                onChangeText={val => handleChange('fromDate', val)}
                placeholder="From date"
                editable={mode !== 'view'}
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>To date</Text>
              <TextInput
                style={styles.input}
                value={formData.toDate}
                onChangeText={val => handleChange('toDate', val)}
                placeholder="To date"
                editable={mode !== 'view'}
              />
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
              <TextInput
                style={styles.input}
                value={
                  Array.isArray(formData.timeAdjustmentShiftRequestLines)
                    ? formData.timeAdjustmentShiftRequestLines
                        .map(item => item.shift?.shiftName)
                        .filter(Boolean)
                        .join(', ')
                    : ''
                }
                onChangeText={val =>
                  handleChange('timeAdjustmentShiftRequestLines', val)
                }
                placeholder="Applies shifts"
                editable={mode !== 'view'}
              />
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
              <TextInput
                style={[styles.input, { flexShrink: 1 }]}
                value={
                  Array.isArray(formData.timeAdjustmentRelEmpRequestLines)
                    ? formData.timeAdjustmentRelEmpRequestLines
                        .map(item => item.employee?.fullName)
                        .filter(Boolean)
                        .join(', ')
                    : ''
                }
                onChangeText={val => handleChange('relativeEmployee', val)}
                placeholder="Người liên quan"
                editable={mode !== 'view'}
                multiline={false}
                scrollEnabled={true}
                numberOfLines={1}
                textAlignVertical="center"
              />
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
});

export default Detail_Late_Early;
