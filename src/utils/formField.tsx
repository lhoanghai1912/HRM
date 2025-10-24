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
    case 1:
      return 'singleLine'; // Một dòng
    case 2:
      return 'multiLine'; // Nhiều dòng
    case 3:
      return 'selectOne'; // Chọn một
    case 4:
      return 'selectMulti'; // Chọn nhiều
    case 5:
      return 'date'; // Ngày
    case 6:
      return 'month'; // Tháng
    case 7:
      return 'int'; // Số nguyên
    case 8:
      return 'decimal'; // Số thập phân
    case 9:
      return 'currency'; // Tiền tệ
    case 10:
      return 'percent'; // Phần trăm
    case 11:
      return 'checkbox'; // Tích chọn
    case 12:
      return 'link'; // Đường dẫn
    case 13:
      return 'employee'; // Nhân viên
    case 14:
      return 'org'; // Tổ chức
    case 15:
      return 'file'; // Tải tệp
    case 16:
      return 'image'; // Hình ảnh
    case 17:
      return 'formula'; // Công thức
    case 18:
      return 'table'; // Bảng
    case 19:
      return 'line'; // Mục
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
