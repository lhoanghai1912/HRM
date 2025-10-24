import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  Image,
} from 'react-native';
import CustomHeader from '../../../navigation/CustomHeader';
import { ScrollView } from 'react-native-gesture-handler';
import { spacing } from '../../../utils/spacing';
import { mapFieldType, renderField } from '../../../utils/formField';
import DatePicker from 'react-native-date-picker';
import MonthPicker from 'react-native-month-year-picker';
import { setLoading } from '../../../store/reducers/loadingSlice';
import { dataTest, getData } from '../../../services/data';
import AppStyles from '../../../components/AppStyle';
import { Picker } from '@react-native-picker/picker';
import icons from '../../../assets/icons';
import { Modal } from 'react-native';

const Test = () => {
  const [field, setField] = useState<any>();
  const [formData, setFormData] = useState({});
  const [testData, setTestData] = useState(dataTest);
  const [date, setDate] = useState(new Date());
  const [openMonth, setOpenMonth] = useState(false);
  const [open, setOpen] = useState(false);
  const [pickerField, setPickerField] = useState<string | null>(null);
  const [pickerData, setPickerData] = useState<any[]>([]);
  const [openPicker, setOpenPicker] = useState(false);
  const [datePickerField, setDatePickerField] = useState(null);
  const [expandedSections, setExpandedSections] = useState<{
    [key: number]: boolean;
  }>({});

  useEffect(() => {
    fetchData();
  }, []); // Chỉ gọi API khi mount

  useEffect(() => {
    if (field) {
      console.log('field data:', field);
    }
  }, [field]); // Log mỗi khi field thay đổi

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getData('profile');
      setField(data); // set data vào field
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handlePickDate = fieldName => {
    setDatePickerField(fieldName);
    setOpen(true); // Thêm dòng này để mở DatePicker
  };

  const handlePickMonth = fieldName => {
    setDatePickerField(fieldName);
    setOpenMonth(true);
  };

  const getDatePickerMode = () => {
    if (!datePickerField) return 'date';
    if (!field) return 'date';
    if (field.DataType === 6) return 'month';
    return 'date';
  };

  const handlePickSelect = (fieldName, pickerData) => {
    console.log('Picker selected:', fieldName, pickerData);

    setPickerField(fieldName);
    setPickerData(pickerData);
    setOpenPicker(true); // phải có dòng này để mở picker
  };

  const toggleSection = (id: number) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Hàm lấy config của field đang chọn
  const getPickerConfig = () => {
    for (const parent of testData.data) {
      if (parent.groupFieldConfigs) {
        const cfg = parent.groupFieldConfigs.find(
          c => c.fieldName === pickerField,
        );
        if (cfg) return cfg;
      }
    }
    return null;
  };

  const pickerConfig = getPickerConfig();
  const pickerType = pickerConfig
    ? mapFieldType(pickerConfig.typeControl)
    : null;

  const renderFields = () => {
    if (!testData || !testData.data) return null;
    const parents = testData.data.filter(item => item.parentId === null);
    return parents.map(parent => {
      const children = testData.data.filter(
        child => child.parentId === parent.id,
      );
      const expanded = expandedSections[parent.id] ?? true;
      return (
        <View
          key={parent.id}
          style={{
            marginBottom: 24,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
          }}
        >
          <TouchableOpacity
            style={styles.section}
            onPress={() => toggleSection(parent.id)}
          >
            <Text style={{ fontWeight: 'bold', fontSize: 16, margin: 8 }}>
              {parent.name}
            </Text>
            <Image
              style={AppStyles.icon}
              source={expanded ? icons.down : icons.up}
            />
          </TouchableOpacity>
          {expanded &&
            children.map(child => (
              <View
                key={child.id}
                style={{ marginHorizontal: 16, marginBottom: 8 }}
              >
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                  {child.name}
                </Text>
                {child.groupFieldConfigs?.map(cfg => (
                  <View
                    key={cfg.id}
                    style={{ marginHorizontal: 16, marginBottom: 4 }}
                  >
                    <Text style={AppStyles.label}>{cfg.label}</Text>
                    <Text>{`${cfg.typeControl}- ${mapFieldType(
                      cfg.typeControl,
                    )}`}</Text>
                    {renderField(
                      cfg,
                      formData[cfg.fieldName],
                      handleChange,
                      'edit',
                      {
                        onPickDate: fieldName => handlePickDate(fieldName),
                        onPickMonth: fieldName => handlePickMonth(fieldName),
                        onPickSelectOne: fieldName =>
                          handlePickSelect(fieldName, cfg.pickerData),
                        onPickSelectMulti: fieldName =>
                          handlePickSelect(fieldName, cfg.pickerData),
                      },
                    )}
                  </View>
                ))}
              </View>
            ))}
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <CustomHeader label="Test Screen" />
      <ScrollView style={styles.scrollView}>{renderFields()}</ScrollView>

      {/* Date Picker cho kiểu ngày */}
      <DatePicker
        modal
        mode="date"
        open={open}
        date={date}
        onConfirm={selectedDate => {
          setOpen(false);
          setDate(selectedDate);
          if (datePickerField) {
            handleChange(datePickerField, selectedDate);
          }
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />

      {/* Month Picker cho kiểu tháng */}
      {openMonth && (
        <MonthPicker
          onChange={(event, selectedDate) => {
            setOpenMonth(false);
            if (event === 'dateSetAction' && selectedDate && datePickerField) {
              handleChange(datePickerField, {
                month: selectedDate.getMonth() + 1,
                year: selectedDate.getFullYear(),
              });
            }
          }}
          value={date}
          locale="vi"
        />
      )}
      {openPicker && (
        <Modal
          transparent
          animationType="fade"
          visible={openPicker}
          onRequestClose={() => setOpenPicker(false)}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.2)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            activeOpacity={1}
            onPress={() => setOpenPicker(false)}
          >
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 8,
                padding: 16,
                minWidth: 250,
              }}
            >
              {/* Chọn 1 */}
              {pickerType === 'selectOne' && (
                <Picker
                  selectedValue={formData[pickerField]}
                  onValueChange={value => {
                    handleChange(pickerField, value);
                    setOpenPicker(false);
                  }}
                >
                  {pickerData.map(item => (
                    <Picker.Item
                      key={item.value}
                      label={item.label}
                      value={item.value}
                    />
                  ))}
                </Picker>
              )}

              {/* Chọn nhiều */}
              {pickerType === 'selectMulti' && (
                <View>
                  {pickerData.map(item => {
                    const value = item.value ?? item.id;
                    const checked =
                      Array.isArray(formData[pickerField]) &&
                      formData[pickerField].includes(value);
                    return (
                      <TouchableOpacity
                        key={value}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginVertical: 8,
                        }}
                        onPress={() => {
                          let newValue = Array.isArray(formData[pickerField])
                            ? [...formData[pickerField]]
                            : [];
                          if (checked) {
                            newValue = newValue.filter(v => v !== value);
                          } else {
                            newValue.push(value);
                          }
                          handleChange(pickerField, newValue);
                        }}
                      >
                        <View
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 4,
                            borderWidth: 1,
                            borderColor: '#888',
                            backgroundColor: checked ? '#007AFF' : '#fff',
                            marginRight: 8,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          {checked && (
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                              ✓
                            </Text>
                          )}
                        </View>
                        <Text>{item.label ?? item.name}</Text>
                      </TouchableOpacity>
                    );
                  })}
                  <TouchableOpacity
                    style={{
                      marginTop: 16,
                      alignSelf: 'flex-end',
                      padding: 8,
                      backgroundColor: '#007AFF',
                      borderRadius: 4,
                    }}
                    onPress={() => setOpenPicker(false)}
                  >
                    <Text style={{ color: '#fff' }}>Xong</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
    marginBottom: spacing.medium,
    padding: spacing.medium,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default Test;
