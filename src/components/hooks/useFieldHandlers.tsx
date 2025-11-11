import { useState } from 'react';
import { Alert } from 'react-native';
import { pick } from '@react-native-documents/picker';
import * as ImagePicker from 'react-native-image-picker';

export const useDatePicker = handleChange => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [datePickerField, setDatePickerField] = useState(null);

  const handlePickDate = (fieldName: string) => {
    setDatePickerField(fieldName);
    setOpen(true);
  };

  const onConfirmDate = (selectedDate: Date) => {
    setOpen(false);
    setDate(selectedDate);
    if (datePickerField) {
      handleChange(datePickerField, selectedDate);
    }
  };

  const onCancelDate = () => {
    setOpen(false);
  };

  return {
    open,
    date,
    datePickerField,
    handlePickDate,
    onConfirmDate,
    onCancelDate,
  };
};

export const useMonthPicker = handleChange => {
  const [openMonth, setOpenMonth] = useState(false);
  const [date, setDate] = useState(new Date());
  const [datePickerField, setDatePickerField] = useState(null);

  const handlePickMonth = (fieldName: string) => {
    setDatePickerField(fieldName);
    setOpenMonth(true);
  };

  const onChangeMonth = (event: string, selectedDate?: Date) => {
    setOpenMonth(false);
    if (event === 'dateSetAction' && selectedDate && datePickerField) {
      handleChange(datePickerField, {
        month: selectedDate.getMonth() + 1,
        year: selectedDate.getFullYear(),
      });
    }
  };

  return {
    openMonth,
    date,
    handlePickMonth,
    onChangeMonth,
  };
};

export const useFilePicker = (
  field: any,
  setFormData: any,
  setPickedFiles: any,
  setChangedFields: any,
) => {
  const handlePickFile = async (fieldName: string) => {
    try {
      const res = await pick({
        allowMultiSelection: false,
        type: ['*/*'],
      });

      if (res && res.length > 0) {
        const file = res[0];

        // Tìm displayField
        const allConfigs =
          field?.pageData?.flatMap(parent => parent.groupFieldConfigs || []) ||
          [];
        const fieldConfig = allConfigs.find(cfg => cfg.fieldName === fieldName);
        const displayFieldName = fieldConfig?.displayField;

        // Xóa file cũ trong pickedFiles nếu có
        setPickedFiles(prev => {
          const updated = [
            ...prev.filter(f => f.fieldName !== fieldName),
            { fieldName, file: { ...file } },
          ];
          console.log('pickedFiles after select:', updated);
          return updated;
        });

        // Cập nhật formData để hiển thị tên file
        setFormData(prev => {
          const updated = {
            ...prev,
            [fieldName]: file,
          };
          if (displayFieldName) {
            updated[displayFieldName] = file.name;
          }
          return updated;
        });

        // Cập nhật changedFields
        setChangedFields(prev => {
          const safePrev = Array.isArray(prev) ? prev : [];
          const filtered = safePrev.filter(
            f => f.fieldName !== fieldName && f.fieldName !== displayFieldName,
          );
          return [
            ...filtered,
            { fieldName, fieldValue: file.uri },
            ...(displayFieldName
              ? [{ fieldName: displayFieldName, fieldValue: file.name }]
              : []),
          ];
        });
      }
    } catch (err) {
      console.error('Error picking file:', err);
      Alert.alert('Lỗi', 'Không thể chọn file');
    }
  };

  const handleClearFile = (fieldName: string) => {
    // Tìm config của field để lấy displayField
    const allConfigs =
      field?.pageData?.flatMap(parent => parent.groupFieldConfigs || []) || [];
    const fieldConfig = allConfigs.find(cfg => cfg.fieldName === fieldName);
    const displayFieldName = fieldConfig?.displayField;

    // Xóa khỏi pickedFiles
    setPickedFiles(prev => prev.filter(f => f.fieldName !== fieldName));

    // Xóa khỏi formData
    setFormData(prev => {
      const updated = { ...prev, [fieldName]: null };
      if (displayFieldName) {
        updated[displayFieldName] = null;
      }
      return updated;
    });

    // Xóa khỏi changedFields
    setChangedFields(prev =>
      prev.filter(
        f => f.fieldName !== fieldName && f.fieldName !== displayFieldName,
      ),
    );
  };

  return {
    handlePickFile,
    handleClearFile,
  };
};

export const useImagePicker = (setFormData: any) => {
  const handlePickImage = async (fieldName: string) => {
    const result = await ImagePicker.launchImageLibrary({ mediaType: 'photo' });
    if (result.assets && result.assets.length > 0) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: { uri: result.assets[0].uri },
      }));
    }
  };

  return {
    handlePickImage,
  };
};
