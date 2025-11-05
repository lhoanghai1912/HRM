import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DatePicker from 'react-native-date-picker';
import MonthPicker from 'react-native-month-year-picker';
import {
  dataTest,
  getData,
  getEmployee,
  getPickerData,
  updateEmployee,
  uploadFile,
} from '../../../../services/data';

import * as ImagePicker from 'react-native-image-picker';
import { pick } from '@react-native-documents/picker';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import Toast from 'react-native-toast-message';
import AppStyles from '../../../../components/AppStyle';
import icons from '../../../../assets/icons';
import ModalPicker from '../../../../components/modal/ModalPicker';
import { renderField } from '../../../../utils/formField';
import CustomHeader from '../../../../components/CustomHeader';
import { spacing } from '../../../../utils/spacing';

const GroupDetail = ({ route }) => {
  const [field, setField] = useState<any>();
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const {
    parent,
    employeeId,
    formData: initialFormData,
    customConfigs: initialCustomConfigs,
  } = route?.params || {};
  const [formData, setFormData] = useState(initialFormData || {});
  const [customConfigs, setCustomConfigs] = useState(
    initialCustomConfigs || [],
  );
  const [testData, setTestData] = useState(dataTest);
  const [date, setDate] = useState(new Date());
  const [openMonth, setOpenMonth] = useState(false);
  const [open, setOpen] = useState(false);
  const [pickerField, setPickerField] = useState<string | null>(null);
  const [displayField, setDisplayField] = useState<string | null>(null);
  const [pickerData, setPickerData] = useState<any>({ pageData: [] });
  const [openPicker, setOpenPicker] = useState(false);
  const [datePickerField, setDatePickerField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{
    [key: number]: boolean;
  }>({});
  const [pickerType, setPickerType] = useState<'SelectOne' | 'SelectMany'>(
    'SelectOne',
  );
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [pickerConfig, setPickerConfig] = useState(null);
  const [pickerPage, setPickerPage] = useState(1);
  const [changedFields, setChangedFields] = useState<
    { fieldName: string; fieldValue: any }[]
  >([]);
  const [pickedFiles, setPickedFiles] = useState<
    { fieldName: string; file: {} }[]
  >([]);
  const [employeeData, setEmployeeData] = useState();
  console.log('route', route.params);

  useFocusEffect(
    useCallback(() => {
      if (parent) {
        fetchParentData();
      }
    }, [parent]),
  );

  useEffect(() => {
    if (employeeData) {
      fetchAllData();
    }
  }, [employeeData]);

  useEffect(() => {
    console.log('Form data updated:', formData);
    console.log('layout:', field);
  }, [formData]);
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
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      const data = await getEmployee(employeeId);
      setEmployeeData(data);
    } catch (error) {
      console.log('Error fetching employee data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const layout = await getData('profile');
      if (employeeData) {
        const formData = mapEmployeeToFormData(layout, employeeData);

        // Fetch display values cho các field select
        for (const parent of layout?.pageData || []) {
          for (const cfg of parent.groupFieldConfigs || []) {
            if (cfg.displayField && cfg.tableNameSource === 'PickList') {
              const fieldValue = formData[cfg.fieldName];

              if (fieldValue && !formData[cfg.displayField]) {
                try {
                  const pickerData = await getPickerData(
                    {
                      page: 1,
                      pageSize: 100,
                      filter: '',
                      orderBy: '',
                      search: '',
                    },
                    cfg,
                  );

                  const item = pickerData.pageData?.find(
                    i => i.value === fieldValue,
                  );
                  if (item) {
                    formData[cfg.displayField] = item.label;
                  }
                } catch (e) {
                  console.error(
                    `Error fetching display value for ${cfg.fieldName}:`,
                    e,
                  );
                }
              }
            }
          }
        }

        // Parse customConfig
        const configs: { fieldName: string; config: any }[] = [];
        layout?.pageData?.forEach(parent => {
          parent.groupFieldConfigs?.forEach(cfg => {
            if (cfg.customConfig && typeof cfg.customConfig === 'string') {
              try {
                const parsedConfig = JSON.parse(cfg.customConfig);
                configs.push({
                  fieldName: cfg.fieldName,
                  config: parsedConfig,
                });
              } catch (e) {
                console.error('Error parsing customConfig:', e);
              }
            }
          });
        });

        setField(layout);
        setFormData(formData);
        setCustomConfigs(configs);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchParentData = async () => {
    try {
      setLoading(true);
      const layout = await getData('profile');

      // Tìm parent và children từ layout
      const parentConfig = layout?.pageData?.find(p => p.id === parent.id);
      const childrenConfigs =
        layout?.pageData?.filter(c => c.parentId === parent.id) || [];

      setField({
        pageData: [parentConfig, ...childrenConfigs],
      });
    } catch (error) {
      console.error('Error fetching parent data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePickDate = fieldName => {
    setDatePickerField(fieldName);
    setOpen(true); // Thêm dòng này để mở DatePicker
  };

  const handlePickMonth = fieldName => {
    setDatePickerField(fieldName);
    setOpenMonth(true);
  };

  const handlePickFile = async fieldName => {
    try {
      const res = await pick({
        allowMultiSelection: false, // Chỉ chọn 1 file
        type: ['*/*'],
      });
      if (res && res.length > 0) {
        const file = {
          uri: res[0].uri,
          name: res[0].name,
          type: res[0].type,
          size: res[0].size,
        };

        // Cập nhật formData để hiển thị
        setFormData(prev => ({
          ...prev,
          [fieldName]: file,
        }));

        // Lưu vào pickedFiles

        setPickedFiles(prev => {
          const idx = prev.findIndex(f => f.fieldName === fieldName);
          if (idx !== -1) {
            const updated = [...prev];
            updated[idx] = { fieldName, file };
            return updated;
          }
          return [...prev, { fieldName, file }];
        });

        console.log('Picked file:', res);
      }
    } catch (err) {
      console.error('Error picking file:', err);
    }
  };
  const handlePickImage = async fieldName => {
    const result = await ImagePicker.launchImageLibrary({ mediaType: 'photo' });
    if (result.assets && result.assets.length > 0) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: { uri: result.assets[0].uri },
      }));
    }
  };

  const handleChange = (fieldName: string, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));

    setChangedFields(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const idx = safePrev.findIndex(f => f.fieldName === fieldName);
      if (idx !== -1) {
        const updated = [...safePrev];
        updated[idx] = { fieldName, fieldValue: value };
        return updated;
      }
      return [...safePrev, { fieldName, fieldValue: value }];
    });
  };

  // Hàm validate các trường bắt buộc
  const validateRequiredFields = () => {
    const missingFields: string[] = [];

    customConfigs.forEach(({ fieldName, config }) => {
      if (config?.isRequired === true) {
        const value = formData[fieldName];
        // Kiểm tra giá trị rỗng
        if (
          value === undefined ||
          value === null ||
          value === '' ||
          (Array.isArray(value) && value.length === 0)
        ) {
          // Tìm label của field để hiển thị
          const fieldConfig = field?.pageData
            ?.flatMap(parent => parent.groupFieldConfigs || [])
            .find(cfg => cfg.fieldName === fieldName);
          missingFields.push(fieldConfig?.label || fieldName);
        }
      }
    });

    return missingFields;
  };

  const handlePickSelect = async (fieldName, cfg) => {
    setPickerField(fieldName);
    // Lấy displayField từ config
    console.log('Picker config:', cfg);

    const display = cfg.displayField;
    setDisplayField(display);
    setPickerConfig(cfg);
    setPickerPage(1);
    setPickerType(cfg.typeControl); // Cập nhật kiểu picker
    // Mở modal ngay lập tức với dữ liệu rỗng
    setPickerData({ pageData: [] });
    setOpenPicker(true);

    // Load dữ liệu trong background
    try {
      let data = [];

      data = await getPickerData(
        { page: 1, pageSize: 10, filter: '', orderBy: '', search: '' },
        cfg,
        // cfg.tableNameSource,
      );
      setHasMore(data.length === 10);
      setPickerData(data);
    } catch (error) {
      console.error('Error loading picker data:', error);
      setPickerData({ pageData: [] });
    }
  };

  const handleSave = async () => {
    try {
      // Validate trước khi save
      const missingFields = validateRequiredFields();
      if (missingFields.length > 0) {
        Alert.alert(
          'Lỗi',
          `Vui lòng nhập các trường bắt buộc:\n- ${missingFields.join('\n- ')}`,
        );
        return;
      }
      setLoading(true);
      console.log('changedFields to save:', changedFields);

      // Kiểm tra có thay đổi không
      if (Object.keys(changedFields).length > 0) {
        console.log('Updating employee fields:', changedFields);
        await updateEmployee(employeeId, changedFields);
      }

      // 2. Upload các file đã chọn
      if (pickedFiles.length > 0) {
        console.log('Uploading files:', pickedFiles);
        await uploadFile({
          id: employeeId,
          type: 'Employee',
          files: pickedFiles,
        });
      }

      // Reset sau khi save thành công
      setChangedFields(changedFields);
      setPickedFiles([]);
      fetchData();
      fetchEmployeeData();
      fetchAllData();
      Toast.show({
        type: 'success',
        text1: 'Lưu dữ liệu thành công',
      });
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Lỗi', 'Lỗi khi lưu dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!pickerConfig) return;
    const nextPage = pickerPage + 1;
    setLoadingMore(true);
    const moreData = await getPickerData(
      { page: nextPage, pageSize: 10, filter: '', orderBy: '', search: '' },
      pickerConfig,
    );
    setPickerData(prev => ({
      pageData: [...(prev.pageData || []), ...moreData],
    }));
    setHasMore(moreData.length === 10);
    setPickerPage(nextPage);
    setLoadingMore(false);
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
        // Map field chính
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

        // Map displayField nếu có
        if (cfg.displayField && employeeData.hasOwnProperty(cfg.displayField)) {
          formData[cfg.displayField] = employeeData[cfg.displayField];
        }
      });
    });

    return formData;
  };

  const sortFields = fields => {
    return [...fields].sort((a, b) => {
      if ((a.sortOrder || 0) !== (b.sortOrder || 0)) {
        return (a.sortOrder || 0) - (b.sortOrder || 0);
      }
      return (a.columnIndex || 0) - (b.columnIndex || 0);
    });
  };

  const renderFields = () => {
    try {
      if (!field || !field.pageData || !parent) return null;

      const parentConfig = field.pageData.find(p => p.id === parent.id);
      const children = field.pageData.filter(c => c.parentId === parent.id);

      if (!parentConfig) return null;

      return (
        <View
          style={{
            marginBottom: 24,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
          }}
        >
          {/* Header của parent */}
          <View style={{ padding: 16, backgroundColor: '#f5f5f5' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
              {parentConfig.name}
            </Text>
          </View>

          {/* Render groupFieldConfigs của parent */}
          {parentConfig.groupFieldConfigs &&
            parentConfig.groupFieldConfigs.length > 0 && (
              <View
                style={{ marginHorizontal: 16, marginTop: 16, marginBottom: 8 }}
              >
                {sortFields(parentConfig.groupFieldConfigs).map(cfg => {
                  const customConfig =
                    customConfigs.find(c => c.fieldName === cfg.fieldName)
                      ?.config || null;

                  return (
                    <View key={cfg.id} style={{ marginBottom: 12 }}>
                      <Text style={AppStyles.label}>
                        {cfg.label}
                        {customConfig?.isRequired && (
                          <Text style={{ color: 'red' }}> *</Text>
                        )}
                      </Text>
                      {renderField(
                        cfg,
                        formData[cfg.fieldName],
                        handleChange,
                        'edit',
                        {
                          formData,
                          onPickDate: fieldName => handlePickDate(fieldName),
                          onPickMonth: fieldName => handlePickMonth(fieldName),
                          onPickSelectOne: (fieldName, pickerData) =>
                            handlePickSelect(fieldName, cfg),
                          onPickSelectMulti: (fieldName, pickerData) =>
                            handlePickSelect(fieldName, cfg),
                          onPickFile: fieldName => handlePickFile(fieldName),
                          onPickImage: fieldName => handlePickImage(fieldName),
                        },
                      )}
                    </View>
                  );
                })}
              </View>
            )}

          {/* Render children */}
          {children.map(child => (
            <View
              key={child.id}
              style={{ marginHorizontal: 16, marginBottom: 16 }}
            >
              <Text
                style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}
              >
                {child.name}
              </Text>
              {child.groupFieldConfigs &&
                sortFields(child.groupFieldConfigs).map(cfg => {
                  const customConfig =
                    customConfigs.find(c => c.fieldName === cfg.fieldName)
                      ?.config || null;

                  return (
                    <View key={cfg.id} style={{ marginBottom: 12 }}>
                      <Text style={AppStyles.label}>
                        {cfg.label}
                        {customConfig?.isRequired && (
                          <Text style={{ color: 'red' }}> *</Text>
                        )}
                      </Text>
                      {renderField(
                        cfg,
                        formData[cfg.fieldName],
                        handleChange,
                        'edit',
                        {
                          formData,
                          onPickDate: fieldName => handlePickDate(fieldName),
                          onPickMonth: fieldName => handlePickMonth(fieldName),
                          onPickSelectOne: (fieldName, pickerData) =>
                            handlePickSelect(fieldName, cfg),
                          onPickSelectMulti: (fieldName, pickerData) =>
                            handlePickSelect(fieldName, cfg),
                          onPickFile: fieldName => handlePickFile(fieldName),
                          onPickImage: fieldName => handlePickImage(fieldName),
                        },
                      )}
                    </View>
                  );
                })}
            </View>
          ))}
        </View>
      );
    } catch (error) {
      console.error('Error rendering fields:', error);
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        label={parent?.name || 'Chi tiết'}
        leftIcon={icons.back}
        leftPress={() => navigation.goBack()}
        rightIcon={icons.document_focus}
        rightPress={() => handleSave()}
      />
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
        <ModalPicker
          visible={openPicker}
          data={pickerData}
          selectedValue={formData[pickerField]}
          onSelect={selected => {
            if (Array.isArray(selected)) {
              // Multi select
              const values = selected.map(i => i.value);
              const labels = selected.map(i => i.label);

              // Cập nhật formData
              setFormData(prev => ({
                ...prev,
                [pickerField]: values,
                [displayField]: labels,
              }));

              // Cập nhật changedFields
              setChangedFields(prev => {
                const safePrev = Array.isArray(prev) ? prev : [];
                const filtered = safePrev.filter(
                  f =>
                    f.fieldName !== pickerField && f.fieldName !== displayField,
                );
                return [
                  ...filtered,
                  { fieldName: pickerField, fieldValue: values.join(';') },
                  { fieldName: displayField, fieldValue: labels.join(';') },
                ];
              });
              console.log('Multi select:', {
                field: pickerField,
                displayField,
                values,
                labels,
              });

              setFormData(prev => ({
                ...prev,
                [pickerField]: values.join(';'),
                // [displayField]: labels,
              }));
              console.log('Updated formData:', formData);
            } else {
              // Single select
              console.log('Single select:', {
                field: pickerField,
                value: selected.value,
                displayField,
                label: selected.label,
              });

              // Cập nhật formData
              setFormData(prev => ({
                ...prev,
                [pickerField]: selected.value,
                [displayField]: selected.label,
              }));
              console.log('Updated formData:', formData);

              // Cập nhật changedFields
              setChangedFields(prev => {
                const safePrev = Array.isArray(prev) ? prev : [];
                const filtered = safePrev.filter(
                  f =>
                    f.fieldName !== pickerField && f.fieldName !== displayField,
                );
                return [
                  ...filtered,
                  { fieldName: pickerField, fieldValue: selected.value },
                  { fieldName: displayField, fieldValue: selected.label },
                ];
              });
            }

            setOpenPicker(false);
          }}
          onClose={() => setOpenPicker(false)}
          multi={pickerType === 'SelectMany'}
          onLoadMore={handleLoadMore}
          loadingMore={loadingMore}
          hasMore={hasMore}
          fieldLabel={pickerConfig?.label || ''}
        />
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

export default GroupDetail;
