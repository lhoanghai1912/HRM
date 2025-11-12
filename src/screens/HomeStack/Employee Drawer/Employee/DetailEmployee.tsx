import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DatePicker from 'react-native-date-picker';
import MonthPicker from 'react-native-month-year-picker';
import {
  dataTest,
  getData,
  getEmployee,
  updateEmployee,
  uploadFile,
  getPickerData,
} from '../../../../services/data';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import Toast from 'react-native-toast-message';
import icons from '../../../../assets/icons';
import ModalPicker from '../../../../components/modal/ModalPicker';
import ModalLocation from '../../../../components/modal/ModalLocation';
import CustomHeader from '../../../../components/CustomHeader';
import { spacing } from '../../../../utils/spacing';
import { RenderFields } from '../../../../components/RenderFields';
import {
  useDatePicker,
  useMonthPicker,
  useFilePicker,
  useImagePicker,
} from '../../../../components/hooks/useFieldHandlers';
import {
  useSelectPicker,
  useLocationPicker,
} from '../../../../components/hooks/useSelectPicker';

const DetailEmployee = ({ route }) => {
  console.log('DetailEmployee route params:', route?.params);

  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const employeeId = route?.params?.id;

  // Basic states
  const [field, setField] = useState<any>();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{
    [key: number]: boolean;
  }>({});
  const [changedFields, setChangedFields] = useState<
    { fieldName: string; fieldValue: any }[]
  >([]);
  const [pickedFiles, setPickedFiles] = useState<
    { fieldName: string; file: {} }[]
  >([]);
  const [customConfigs, setCustomConfigs] = useState<
    { fieldName: string; config: any }[]
  >([]);
  const [employeeData, setEmployeeData] = useState();

  // Handle change function
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

  // Use custom hooks (after handleChange declaration)
  const datePicker = useDatePicker(handleChange);
  const monthPicker = useMonthPicker(handleChange);
  const filePicker = useFilePicker(
    field,
    setFormData,
    setPickedFiles,
    setChangedFields,
  );
  const imagePicker = useImagePicker(setFormData);
  const selectPicker = useSelectPicker();
  const locationPicker = useLocationPicker(field, formData);

  // Fetch functions
  useFocusEffect(
    useCallback(() => {
      fetchData();
      fetchEmployeeData();
    }, [employeeId]),
  );

  useEffect(() => {
    if (employeeData) {
      fetchAllData();
    }
  }, [employeeData]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getData('profile');
      setField(data);

      if (data && data.pageData) {
        const parents = data.pageData.filter(item => item.parentId === null);
        const expandedInit = {};
        parents.forEach(parent => {
          expandedInit[parent.id] = false;
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
        console.log('layout', layout);
        console.log('formData', formData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
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

        if (cfg.displayField && employeeData.hasOwnProperty(cfg.displayField)) {
          formData[cfg.displayField] = employeeData[cfg.displayField];
        }
      });
    });

    return formData;
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const filesToUpload = [...pickedFiles];

      if (filesToUpload.length > 0) {
        try {
          const uploadResult = await uploadFile({
            id: employeeId,
            type: 'Employee',
            files: filesToUpload,
          });
          console.log('Upload file result:', uploadResult);

          Toast.show({
            type: 'success',
            text1: 'Upload file thành công',
          });
        } catch (uploadError) {
          console.error('Error uploading files:', uploadError);
          Alert.alert('Lỗi', 'Lỗi khi upload file');
          return;
        }
      }

      if (changedFields.length > 0) {
        await updateEmployee(employeeId, changedFields);
      }

      setChangedFields([]);
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

  const toggleSection = (id: number) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Handlers object for RenderFields
  const handlers = {
    handlePickDate: datePicker.handlePickDate,
    handlePickMonth: monthPicker.handlePickMonth,
    handlePickFile: filePicker.handlePickFile,
    handlePickImage: imagePicker.handlePickImage,
    handleClearFile: filePicker.handleClearFile,
    handlePickSelect: selectPicker.handlePickSelect,
    handlePickLocation: locationPicker.handlePickLocation,
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        label="DetailEmployee Screen"
        leftIcon={icons.menu}
        leftPress={() => navigation.openDrawer()}
        rightIcon={icons.document_focus}
        rightPress={handleSave}
      />

      <ScrollView style={styles.scrollView}>
        <RenderFields
          field={field}
          formData={formData}
          expandedSections={expandedSections}
          customConfigs={customConfigs}
          toggleSection={toggleSection}
          handleChange={handleChange}
          handlers={handlers}
          employeeId={employeeId} // <-- truyền vào đây
        />
      </ScrollView>

      {/* Date Picker */}
      <DatePicker
        modal
        mode="date"
        open={datePicker.open}
        date={datePicker.date}
        onConfirm={datePicker.onConfirmDate}
        onCancel={datePicker.onCancelDate}
      />

      {/* Month Picker */}
      {monthPicker.openMonth && (
        <MonthPicker
          onChange={monthPicker.onChangeMonth}
          value={monthPicker.date}
          locale="vi"
        />
      )}

      {/* Select Picker Modal */}
      {selectPicker.openPicker && (
        <ModalPicker
          visible={selectPicker.openPicker}
          data={selectPicker.pickerData}
          selectedValue={formData[selectPicker.pickerField]}
          onSelect={(selected, labelString) => {
            if (Array.isArray(selected)) {
              const valuesString = JSON.stringify(selected.map(i => i.id));
              setFormData(prev => ({
                ...prev,
                [selectPicker.pickerField]: valuesString,
                [selectPicker.displayField]: labelString,
              }));
              setChangedFields(prev => {
                const safePrev = Array.isArray(prev) ? prev : [];
                const filtered = safePrev.filter(
                  f =>
                    f.fieldName !== selectPicker.pickerField &&
                    f.fieldName !== selectPicker.displayField,
                );
                return [
                  ...filtered,
                  {
                    fieldName: selectPicker.pickerField,
                    fieldValue: valuesString,
                  },
                  {
                    fieldName: selectPicker.displayField,
                    fieldValue: labelString,
                  },
                ];
              });
            } else {
              const value = selected.value ?? selected.id;
              const label =
                selected.label ?? selected.pickListValue ?? selected.name ?? '';

              setFormData(prev => ({
                ...prev,
                [selectPicker.pickerField]: value,
                [selectPicker.displayField]: label,
              }));
              setChangedFields(prev => {
                const safePrev = Array.isArray(prev) ? prev : [];
                const filtered = safePrev.filter(
                  f =>
                    f.fieldName !== selectPicker.pickerField &&
                    f.fieldName !== selectPicker.displayField,
                );
                return [
                  ...filtered,
                  { fieldName: selectPicker.pickerField, fieldValue: value },
                  { fieldName: selectPicker.displayField, fieldValue: label },
                ];
              });
            }
            selectPicker.setOpenPicker(false);
          }}
          onClose={() => selectPicker.setOpenPicker(false)}
          multi={selectPicker.pickerType === 'SelectMany'}
          onLoadMore={selectPicker.handleLoadMore}
          loadingMore={selectPicker.loadingMore}
          hasMore={selectPicker.hasMore}
          fieldLabel={selectPicker.pickerConfig?.label || ''}
        />
      )}

      {/* Location Picker Modal */}
      {locationPicker.openLocationModal && (
        <ModalLocation
          visible={locationPicker.openLocationModal}
          data={locationPicker.locationData || []}
          onSelect={selected => {
            setFormData(prev => ({
              ...prev,
              [locationPicker.pickerField]: selected.value,
              [locationPicker.displayField]: selected.label,
            }));
            setChangedFields(prev => {
              const safePrev = Array.isArray(prev) ? prev : [];
              const filtered = safePrev.filter(
                f =>
                  f.fieldName !== locationPicker.pickerField &&
                  f.fieldName !== locationPicker.displayField,
              );
              return [
                ...filtered,
                {
                  fieldName: locationPicker.pickerField,
                  fieldValue: selected.value,
                },
                {
                  fieldName: locationPicker.displayField,
                  fieldValue: selected.label,
                },
              ];
            });
            locationPicker.setOpenLocationModal(false);
          }}
          onClose={() => locationPicker.setOpenLocationModal(false)}
          title="Chọn địa điểm"
        />
      )}

      {/* Loading Overlay */}
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
});

export default DetailEmployee;
