import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomHeader from '../../../navigation/CustomHeader';
import { ScrollView } from 'react-native-gesture-handler';
import { spacing } from '../../../utils/spacing';
import { mapFieldType, renderField } from '../../../utils/formField';
import { groupConfig } from '../../../utils/data';
import AppStyles from '../../../components/AppStyle';
import DatePicker from 'react-native-date-picker';

const Test = () => {
  const fields = groupConfig.GroupFieldConfigs;
  const [formData, setFormData] = useState({});
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [datePickerField, setDatePickerField] = useState(null);

  const handleChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handlePickDate = fieldName => {
    setDatePickerField(fieldName);
    setOpen(true); // Thêm dòng này để mở DatePicker
  };

  const handlePickMonth = fieldName => {
    setDatePickerField(fieldName);
    // Mở MonthPicker ở đây
  };

  return (
    <View style={styles.container}>
      <CustomHeader label="Test Screen" />
      <ScrollView style={styles.scrollView}>
        <View>
          {fields
            .filter(f => f.IsVisible)
            .map(field => (
              <View key={field.FieldName} style={{ marginBottom: 12 }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>
                  {field.Caption}
                </Text>
                <Text>
                  {field.DataType} - {mapFieldType(field.DataType)}
                </Text>
                {renderField(
                  field,
                  formData[field.FieldName],
                  handleChange,
                  'edit',
                  { onPickDate: handlePickDate, onPickMonth: handlePickMonth },
                )}
              </View>
            ))}
        </View>
      </ScrollView>

      <DatePicker
        modal
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

export default Test;
