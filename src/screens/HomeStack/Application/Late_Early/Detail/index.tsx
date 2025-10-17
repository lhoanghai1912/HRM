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
import { form_detail_late_early } from '../../../../../utils/form';
import { useTranslation } from 'react-i18next';
import { spacing } from '../../../../../utils/spacing';
import { getDetail_Early_LateApplications } from '../../../../../services/application';
import { colors } from '../../../../../utils/color';

const Detail_Late_Early = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { id, mode: initialMode } = route.params || {};
  const [mode, setMode] = useState(
    initialMode === 'create' ? 'create' : 'view',
  );
  const fields = form_detail_late_early(t);
  const [loading, setLoading] = useState(false);
  // Khởi tạo state cho form data
  const [formData, setFormData] = useState({});

  console.log('route.params', route.params);

  useEffect(() => {
    if (mode === 'view' && id) {
      fetchData();
    }
    if (mode === 'create') {
      // Tất cả field rỗng khi tạo mới
      const emptyData = {};
      fields.forEach(f => {
        emptyData[f.key] = '';
      });
      setFormData(emptyData);
    }
  }, [mode, id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getDetail_Early_LateApplications(id);
      console.log('Detail Early Late Application res:', res);
      setFormData({ res });
      // Map dữ liệu từ API vào formData
      const mapped = {};
      fields.forEach(f => {
        switch (f.key) {
          // case 'createdBy':
          // mapped[f.key] = res?.createdBy || '';
          // break;
          case 'createdBy':
            mapped[f.key] = res?.employee?.fullName || '';
            break;
          case 'employeeAvatar':
            mapped[f.key] = res?.employee?.employeeAvatar || '';
            break;
          case 'struct':
            mapped[f.key] =
              res?.employee?.employeeJobInfo?.jobPosition?.orgStruct
                ?.orgStructName || '';
            break;
          case 'appliesShifts':
            mapped[f.key] = Array.isArray(res?.timeAdjustmentShiftRequestLines)
              ? res.timeAdjustmentShiftRequestLines
                  .map(item => item?.shift?.shiftName)
                  .filter(Boolean)
                  .join(', ')
              : '';
            break;
          case 'relativeEmployee':
            mapped[f.key] = Array.isArray(res?.timeAdjustmentRelEmpRequestLines)
              ? res.timeAdjustmentRelEmpRequestLines
                  .map(item => item?.employee?.fullName)
                  .filter(Boolean)
                  .join(', ')
              : '';
            break;
          default:
            mapped[f.key] = res?.[f.key] ?? '';
        }
      });
      setFormData(mapped);
    } catch (error) {
      console.error('Error fetching detail Early Late Application:', error);
    } finally {
      setLoading(false);
    }
  };

  console.log('formData:', formData);

  // Khi sửa field
  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Khi lưu
  const handleSave = () => {
    // TODO: Gọi API cập nhật với formData
    setMode('view');
  };

  const mid = Math.ceil(fields.length / 2);
  const leftFields = fields.slice(0, mid);
  const rightFields = fields.slice(mid);

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
          {/* Left column */}
          <View style={styles.column}>
            {leftFields.map((item, idx) => (
              <View key={idx} style={styles.fieldContainer}>
                <Text style={styles.label}>{item.label}</Text>
                {mode === 'edit' || mode === 'create' ? (
                  <TextInput
                    style={styles.input}
                    value={formData[item.key]}
                    onChangeText={val => handleChange(item.key, val)}
                    placeholder={item.label}
                  />
                ) : (
                  <Text style={styles.value}>{formData[item.key] || '-'}</Text>
                )}
              </View>
            ))}
          </View>
          {/* Right column */}
          <View style={styles.column}>
            {rightFields.map((item, idx) => (
              <View key={idx} style={styles.fieldContainer}>
                <Text style={styles.label}>{item.label}</Text>
                {mode === 'edit' || mode === 'create' ? (
                  <TextInput
                    style={styles.input}
                    value={formData[item.key]}
                    onChangeText={val => handleChange(item.key, val)}
                    placeholder={item.label}
                  />
                ) : (
                  <Text style={styles.value}>{formData[item.key] || '-'}</Text>
                )}
              </View>
            ))}
          </View>
        </View>
        {/* Tài liệu đính kèm */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{}</Text>
          <Text style={styles.sectionValue}>Chưa có dữ liệu</Text>
        </View>
        {/* Ghi chú */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ghi chú</Text>
          <View style={styles.noteBox}>
            <TextInput
              style={styles.input}
              value={formData.note || ''}
              onChangeText={val => handleChange('note', val)}
              placeholder="Nhập ghi chú"
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
    marginBottom: spacing.medium,
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
  sectionValue: { color: '#888', marginBottom: spacing.small },
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
