import React from 'react';
import { TextInput, TouchableOpacity, Text } from 'react-native';
import AppInput from '../components/AppInput';
import { Picker } from '@react-native-picker/picker';
import { View } from 'react-native';
import { colors } from './color';

type RenderFieldExtraProps = {
  onPickDate?: (fieldName: string) => void;
  onPickMonth?: (fieldName: string) => void;
  onPickSelectOne?: (fieldName: string) => void;
  onPickSelectMulti?: (fieldName: string) => void;
};

// Ánh xạ DataType hoặc TypeControl từ API sang loại trường đã định nghĩa
export const mapFieldType = TypeControl => {
  // Ưu tiên typeControl nếu có, nếu không thì dùng dataType
  const type = TypeControl;
  switch (type) {
    case 'TextOne':
      return 'singleLine'; // Một dòng
    case 'TextMany':
      return 'multiLine'; // Nhiều dòng
    case 'SelectOne':
      return 'selectOne'; // Chọn một
    case 'SelectMany':
      return 'selectMulti'; // Chọn nhiều
    case 'Day':
      return 'date'; // Ngày
    case 'Month':
      return 'month'; // Tháng
    case 'Integer':
      return 'int'; // Số nguyên
    case 'Decimal':
      return 'decimal'; // Số thập phân
    case 'Currency':
      return 'currency'; // Tiền tệ
    case 'Percent':
      return 'percent'; // Phần trăm
    case 'Checkbox':
      return 'checkbox'; // Tích chọn
    case 'Image':
      return 'image'; // Hình ảnh
    case 'Link':
      return 'link'; // Đường dẫn
    case 'FileUpload':
      return 'file'; // File
    case 'Formula':
      return 'formula';
    default:
      return 'singleLine';
  }
};
// Hàm render từng trường theo kiểu đã ánh xạ
export const renderField = (
  data,
  value,
  onChange,
  mode = 'edit',
  extraProps: RenderFieldExtraProps = {},
) => {
  const fieldType = mapFieldType(data.typeControl);

  switch (fieldType) {
    case 'singleLine':
      return (
        <AppInput
          value={value ?? ''}
          onChangeText={val => onChange(data.fieldName, val)}
          placeholder={`${data.fieldName} - ${fieldType} `}
          editable={mode !== 'view' && !data.IsReadOnly}
          numberOfLines={1}
          multiline={false}
          scrollEnabled={true}
        />
      );
    case 'multiLine':
      return (
        <AppInput
          value={value ?? ''}
          onChangeText={val => onChange(data.fieldName, val)}
          placeholder={`${data.fieldName} - ${fieldType} `}
          editable={mode !== 'view' && !data.IsReadOnly}
          multiline={true}
          scrollEnabled={true}
        />
      );
    case 'selectOne':
      return (
        <View style={{ borderWidth: 1, borderRadius: 10, padding: 0 }}>
          <Picker
            enabled={mode !== 'view'}
            selectedValue={value}
            onValueChange={val => onChange(data.fieldName, val)}
            style={{}}
          >
            {(data.pickerData || []).map(item => (
              <Picker.Item
                key={item.value}
                label={item.label}
                value={item.value}
              />
            ))}
          </Picker>
        </View>
      );
    case 'selectMulti':
      // Picker mặc định không hỗ trợ multi, nên dùng FlatList với Checkbox
      return (
        <View style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}>
          {(data.pickerData || []).map(item => {
            const itemValue = item.value ?? item.id;
            const checked = Array.isArray(value) && value.includes(itemValue);
            return (
              <TouchableOpacity
                key={itemValue}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 4,
                }}
                onPress={() => {
                  let newValue = Array.isArray(value) ? [...value] : [];
                  if (checked) {
                    newValue = newValue.filter(v => v !== itemValue);
                  } else {
                    newValue.push(itemValue);
                  }
                  onChange(data.fieldName, newValue);
                }}
                disabled={mode === 'view'}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: '#888',
                    backgroundColor: checked ? '#007AFF' : '#fff',
                    marginRight: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {checked && (
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>✓</Text>
                  )}
                </View>
                <Text>{item.label ?? item.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    case 'date':
      return (
        <TouchableOpacity
          disabled={mode === 'view'}
          style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
          onPress={() => {
            if (extraProps.onPickDate) extraProps.onPickDate(data.fieldName);
          }}
        >
          <Text>{value ? value.toLocaleDateString() : data.fieldName}</Text>
        </TouchableOpacity>
      );
    case 'month':
      return (
        <TouchableOpacity
          disabled={mode === 'view'}
          style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
          onPress={() => {
            if (extraProps.onPickMonth) extraProps.onPickMonth(data.fieldName);
          }}
        >
          <Text>{value ? `${value.month}/${value.year}` : data.fieldName}</Text>
        </TouchableOpacity>
      );
    case 'int':
      return (
        <AppInput
          value={value?.toString() ?? ''}
          onChangeText={val => onChange(data.fieldName, val)}
          placeholder={`${data.fieldName} - ${fieldType} `}
          editable={mode !== 'view' && !data.IsReadOnly}
          keyboardType="numeric"
          numberOfLines={1}
          multiline={false}
          scrollEnabled={true}
        />
      );
    case 'decimal':
      return (
        <AppInput
          value={value?.toString() ?? ''}
          onChangeText={val => onChange(data.fieldName, val)}
          placeholder={`${data.fieldName} - ${fieldType} `}
          editable={mode !== 'view' && !data.IsReadOnly}
          keyboardType="decimal-pad"
          numberOfLines={1}
          multiline={false}
          scrollEnabled={true}
        />
      );
    case 'file':
      return (
        <TouchableOpacity
          disabled={mode === 'view'}
          style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
          onPress={() => {
            /* show file picker */
          }}
        >
          <Text>{value ? value.name : data.fieldName}</Text>
        </TouchableOpacity>
      );
    case 'image':
      return (
        <TouchableOpacity
          disabled={mode === 'view'}
          style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
          onPress={() => {
            /* show image picker */
          }}
        >
          <Text>{value ? 'Đã chọn ảnh' : data.fieldName}</Text>
        </TouchableOpacity>
      );
    // Các kiểu khác có thể bổ sung thêm
    default:
      return (
        <AppInput
          value={value ?? ''}
          onChangeText={val => onChange(data.fieldName, val)}
          placeholder={`${data.fieldName} - ${fieldType} `}
          editable={mode !== 'view' && !data.IsReadOnly}
          numberOfLines={1}
          multiline={false}
          scrollEnabled={true}
        />
      );
  }
};
