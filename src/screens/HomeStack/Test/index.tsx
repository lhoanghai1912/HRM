import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import CustomHeader from '../../../navigation/CustomHeader';
import { ScrollView } from 'react-native-gesture-handler';
import { spacing } from '../../../utils/spacing';
import { mapFieldType, renderField } from '../../../utils/formField';
import DatePicker from 'react-native-date-picker';
import MonthPicker from 'react-native-month-year-picker';
import { dataTest, getData, getEmployee } from '../../../services/data';
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
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{
    [key: number]: boolean;
  }>({});

  // console.log('test render', testData);

  useEffect(() => {
    fetchData();
    fetchAllData();
  }, []); // Chỉ gọi API khi mount

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getData('profile');
      setField(data);

      // Khởi tạo expandedSections cho tất cả parentId
      if (data && data.pageData) {
        const parents = data.pageData.filter(item => item.parentId === null);
        const expandedInit = {};
        parents.forEach(parent => {
          expandedInit[parent.id] = false; // hoặc false nếu muốn mặc định thu gọn
        });
        setExpandedSections(expandedInit);
      }

      console.log('Fetched data:', data);
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const layout = testData; // hoặc await getData('profile');
      const employeeData = await getEmployee(6);
      const formData = mapEmployeeToFormData(layout, employeeData);
      setField(layout);
      setFormData(formData);
    } catch (error) {
      console.error(error);
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

  const mapEmployeeToFormData = (layout, employeeData) => {
    const formData = {};
    layout?.pageData?.forEach(parent => {
      parent.groupFieldConfigs?.forEach(cfg => {
        if (employeeData.hasOwnProperty(cfg.fieldName)) {
          formData[cfg.fieldName] = employeeData[cfg.fieldName];
        } else if (cfg.defaultValue) {
          try {
            const def =
              typeof cfg.defaultValue === 'string'
                ? JSON.parse(cfg.defaultValue)
                : cfg.defaultValue;
            formData[cfg.fieldName] = def.id ?? def;
          } catch (e) {
            formData[cfg.fieldName] = cfg.defaultValue;
          }
        } else {
          formData[cfg.fieldName] = '';
        }
      });
    });
    return formData;
  };

  const getDefaultId = cfg => {
    if (!cfg.defaultValue) return undefined;
    try {
      const def =
        typeof cfg.defaultValue === 'string'
          ? JSON.parse(cfg.defaultValue)
          : cfg.defaultValue;

      // Chọn 1
      if (mapFieldType(cfg.typeControl) === 'selectOne') {
        return def.id;
      }
      // Chọn nhiều
      if (mapFieldType(cfg.typeControl) === 'selectMulti') {
        const arr = Array.isArray(def) ? def : [def];
        return arr.map(item => item.id);
      }
    } catch (e) {
      return undefined;
    }
  };

  const renderFields = () => {
    try {
      if (!field || !field.pageData) return null;
      const parents = field.pageData.filter(item => item.parentId === null);
      return parents.map(parent => {
        const children = field.pageData.filter(
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
                style={[AppStyles.icon]}
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
                          // onPickSelectOne: fieldName =>
                          //   handlePickSelect(fieldName, cfg.pickerData),
                          // onPickSelectMulti: fieldName =>
                          //   handlePickSelect(fieldName, cfg.pickerData),
                        },
                      )}
                    </View>
                  ))}
                </View>
              ))}
          </View>
        );
      });
    } catch (error) {}
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
              {/* {pickerType === 'selectOne' && (
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
              )} */}

              {/* Chọn nhiều */}
              {/* {pickerType === 'selectMulti' && (
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
              )} */}
            </View>
          </TouchableOpacity>
        </Modal>
      )}
      {loading && (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <ActivityIndicator size="large" color="#E53935" />
        </View>
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
    paddingHorizontal: spacing.small,
  },
});

export default Test;
