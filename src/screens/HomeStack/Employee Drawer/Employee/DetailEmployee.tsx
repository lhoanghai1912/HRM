import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import DatePicker from 'react-native-date-picker';
import MonthPicker from 'react-native-month-year-picker';
import {
  getSettingLayout,
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
  useOrganizationPicker,
  useEmployeePicker,
  useProcedurePicker,
} from '../../../../components/hooks/useSelectPicker';
import ModalTreeView from '../../../../components/modal/ModalTreeView';
import ModalEmployeePicker from '../../../../components/modal/ModalEmployeePicker';
import ModalProcedurePicker from '../../../../components/modal/ModalProcedurePicker';
import AppButton from '../../../../components/AppButton';
import { colors } from '../../../../utils/color';
import { validateLayoutForm } from '../../../../utils/helper';
import { useTranslation } from 'react-i18next';

const DetailEmployee = ({ route }) => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const employeeId = route?.params?.id;
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  const [field, setField] = useState<any>();
  const [formData, setFormData] = useState<any>({});
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
  const [employeeData, setEmployeeData] = useState<any>();

  // 🔹 trạng thái view / edit
  const [isEditMode, setIsEditMode] = useState(false);

  const handleChange = (fieldName: string, value: any) => {
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
  const organizationPicker = useOrganizationPicker();
  const employeePicker = useEmployeePicker();
  const procedurePicker = useProcedurePicker();
  const { t } = useTranslation();
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
      const data = await getSettingLayout('profile');
      setField(data);

      if (data && data.pageData) {
        const parents = data.pageData.filter(
          (item: any) => item.parentId === null,
        );
        const expandedInit: { [key: number]: boolean } = {};
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
      console.log('employeeData', data);

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
      const layout = await getSettingLayout('profile');

      if (employeeData) {
        const mappedFormData = mapEmployeeToFormData(layout, employeeData);

        for (const parent of layout?.pageData || []) {
          for (const cfg of parent.groupFieldConfigs || []) {
            if (cfg.displayField && cfg.tableNameSource === 'PickList') {
              const fieldValue = mappedFormData[cfg.fieldName];

              if (fieldValue && !mappedFormData[cfg.displayField]) {
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
                    (i: any) => i.value === fieldValue,
                  );
                  if (item) {
                    mappedFormData[cfg.displayField] = item.label;
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

        const configs: { fieldName: string; config: any }[] = [];
        layout?.pageData?.forEach((parent: any) => {
          parent.groupFieldConfigs?.forEach((cfg: any) => {
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
        setFormData(mappedFormData);
        setCustomConfigs(configs);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const mapEmployeeToFormData = (layout: any, employee: any) => {
    const mapped: any = {};

    layout?.pageData?.forEach((parent: any) => {
      parent.groupFieldConfigs?.forEach((cfg: any) => {
        if (employee.hasOwnProperty(cfg.fieldName)) {
          mapped[cfg.fieldName] = employee[cfg.fieldName];
        } else if (cfg.defaultValue) {
          try {
            const def =
              typeof cfg.defaultValue === 'string'
                ? JSON.parse(cfg.defaultValue)
                : cfg.defaultValue;
            mapped[cfg.fieldName] = def.id ?? def;
          } catch (e) {
            mapped[cfg.fieldName] = cfg.defaultValue;
          }
        } else {
          mapped[cfg.fieldName] = '';
        }

        if (cfg.displayField && employee.hasOwnProperty(cfg.displayField)) {
          mapped[cfg.displayField] = employee[cfg.displayField];
        }
      });
    });

    return mapped;
  };

  const handleSelectOrganization = (node: any) => {
    const fieldName = organizationPicker.orgFieldName;
    const displayField = organizationPicker.orgDisplayField;

    setFormData(prev => ({
      ...prev,
      [fieldName]: node,
      [displayField]: node.orgStructName || node.name,
    }));
    setChangedFields(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const filtered = safePrev.filter(
        f => f.fieldName !== fieldName && f.fieldName !== displayField,
      );
      return [
        ...filtered,
        { fieldName: fieldName, fieldValue: node.id },
        {
          fieldName: displayField,
          fieldValue: node.orgStructName || node.name,
        },
      ];
    });
    organizationPicker.setShowOrgTree(false);
  };

  const handleSelectEmployee = (employee: any) => {
    const fieldName = employeePicker.pickerField;
    const displayField = employeePicker.displayField;

    setFormData(prev => ({
      ...prev,
      [fieldName]: employee.EmployeeID,
      [displayField]: employee.fullName,
    }));
    setChangedFields(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const filtered = safePrev.filter(
        f => f.fieldName !== fieldName && f.fieldName !== displayField,
      );
      return [
        ...filtered,
        { fieldName: fieldName, fieldValue: employee.EmployeeID },
        {
          fieldName: displayField,
          fieldValue: employee.fullName,
        },
      ];
    });
    employeePicker.setShowEmployeePicker(false);
  };

  const handleSave = async () => {
    if (!isEditMode) {
      const { isValid, errors } = validateLayoutForm(
        field,
        formData,
        customConfigs,
        {},
      );
      setValidationErrors(errors);

      if (!isValid) {
        Toast.show({
          type: 'error',
          text1: 'Vui lòng nhập đầy đủ các trường bắt buộc',
        });
        return;
      }

      // ✔ đúng logic: không có thay đổi gì
      if (changedFields.length === 0 && pickedFiles.length === 0) {
        Toast.show({
          type: 'info',
          text1: 'Không có thay đổi để lưu',
        });
        return;
      }

      return;
    }

    try {
      setLoading(true);

      const filesToUpload = [...pickedFiles];

      // Upload file
      if (filesToUpload.length > 0) {
        try {
          await uploadFile({
            id: employeeId,
            type: 'Employee',
            files: filesToUpload,
          });

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

      // Update field thay đổi
      if (changedFields.length > 0) {
        await updateEmployee(employeeId, changedFields);
        Toast.show({
          type: 'success',
          text1: 'Lưu dữ liệu thành công',
        });
      }

      if (changedFields.length === 0 && pickedFiles.length === 0) {
        Toast.show({
          type: 'info',
          text1: 'Không có thay đổi để lưu',
        });
        setIsEditMode(false);
        return;
      }

      setChangedFields([]);
      setPickedFiles([]);
      fetchData();
      fetchEmployeeData();
      fetchAllData();

      setIsEditMode(false);
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

  // 🔹 right icon: nếu đang view → chuyển sang edit; nếu đang edit → gọi save
  const handleRightPress = () => {
    if (isEditMode) {
      // 🔥 chạy validate trước khi save
      const { isValid, errors } = validateLayoutForm(
        field,
        formData,
        customConfigs,
        {},
      );

      setValidationErrors(errors);

      if (!isValid) {
        Toast.show({
          type: 'error',
          text1: 'Vui lòng nhập đầy đủ các trường bắt buộc',
        });
        return; // ❗ KHÔNG SAVE KHI LỖI
      }

      handleSave(); // ❗ Save thật sự
      return;
    }

    // Chuyển sang edit
    setIsEditMode(true);
  };

  const handlers = {
    handlePickDate: datePicker.handlePickDate,
    handlePickMonth: monthPicker.handlePickMonth,
    handlePickFile: filePicker.handlePickFile,
    handlePickImage: imagePicker.handlePickImage,
    handleClearFile: filePicker.handleClearFile,
    handlePickSelect: selectPicker.handlePickSelect,
    handlePickLocation: locationPicker.handlePickLocation,
    handlePickProcedure: procedurePicker.handlePickProcedure,
    handlePickOrganization: organizationPicker.handlePickOrganization,
    handlePickEmployee: employeePicker.handlePickEmployee,
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        // label={`${t('employee.employee_detail')}`}
        label={`Chi tiết nhân viên`}
        leftIcon={icons.menu}
        leftPress={() => navigation.openDrawer()}
        // ví dụ: dùng icon edit khi view, icon document_focus khi edit
        rightIcon={isEditMode ? icons.document_focus : icons.edit}
        rightPress={handleRightPress}
      />

      <View
        style={{
          flex: 1,
          paddingVertical: spacing.small,
          backgroundColor: colors.background,
        }}
      >
        <RenderFields
          field={field}
          formData={formData}
          expandedSections={expandedSections}
          customConfigs={customConfigs}
          toggleSection={toggleSection}
          handleChange={handleChange}
          handlers={handlers}
          id={employeeId}
          isGroupDetail={true}
          isEditMode={isEditMode}
          validationErrors={validationErrors}
        />
      </View>

      {/* Nếu muốn khi view thì ẩn button update dưới: */}
      {isEditMode && (
        <View
          style={{
            alignItems: 'center',
            marginBottom: spacing.medium,
          }}
        >
          <AppButton
            title="update"
            onPress={handleRightPress}
            customStyle={{
              width: '50%',
              padding: spacing.medium,
              justifyContent: 'center',
            }}
          />
        </View>
      )}

      <DatePicker
        modal
        mode="date"
        open={datePicker.open}
        date={datePicker.date}
        onConfirm={datePicker.onConfirmDate}
        onCancel={datePicker.onCancelDate}
      />

      {monthPicker.openMonth && (
        <MonthPicker
          onChange={monthPicker.onChangeMonth}
          value={monthPicker.date}
          locale="vi"
        />
      )}

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

      <ModalTreeView
        visible={organizationPicker.showOrgTree}
        data={organizationPicker.orgTreeData}
        selectedId={formData[organizationPicker.orgFieldName]}
        onSelect={handleSelectOrganization}
        onClose={() => organizationPicker.setShowOrgTree(false)}
        onSearch={keyword => organizationPicker.handleSearch(keyword)}
      />

      <ModalEmployeePicker
        visible={employeePicker.showEmployeePicker}
        data={employeePicker.employeeData}
        loading={employeePicker.loading}
        loadingMore={employeePicker.loadingMore}
        hasMore={employeePicker.hasMore}
        onLoadMore={employeePicker.handleLoadMore}
        onSearch={employeePicker.handleSearch}
        onSelect={handleSelectEmployee}
        onClose={() => employeePicker.setShowEmployeePicker(false)}
        selectedId={formData[employeePicker.pickerField]?.EmployeeID}
      />

      <ModalProcedurePicker
        visible={procedurePicker.showProcedurePicker}
        data={procedurePicker.procedureData}
        loading={procedurePicker.loading}
        loadingMore={procedurePicker.loadingMore}
        hasMore={procedurePicker.hasMore}
        onLoadMore={procedurePicker.handleLoadMore}
        onSearch={procedurePicker.handleSearch}
        onSelect={handleSelectEmployee}
        onClose={() => procedurePicker.setShowProcedurePicker(false)}
        selectedId={formData[procedurePicker.pickerField]?.EmployeeID}
      />

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
});

export default DetailEmployee;
