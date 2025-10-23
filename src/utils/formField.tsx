import React from 'react';
import { TextInput, TouchableOpacity, Text } from 'react-native';

type RenderFieldExtraProps = {
  onPickDate?: (fieldName: string) => void;
  onPickMonth?: (fieldName: string) => void;
};

// Ánh xạ DataType hoặc TypeControl từ API sang loại trường đã định nghĩa
export const mapFieldType = dataType => {
  // Ưu tiên typeControl nếu có, nếu không thì dùng dataType
  const type = dataType;
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
  fieldConfig,
  value,
  onChange,
  mode = 'edit',
  extraProps: RenderFieldExtraProps = {},
) => {
  const fieldType = mapFieldType(fieldConfig.DataType);

  switch (fieldType) {
    case 'singleLine':
      return (
        <TextInput
          style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
          value={value ?? ''}
          onChangeText={val => onChange(fieldConfig.FieldName, val)}
          placeholder={fieldConfig.Caption}
          editable={mode !== 'view' && !fieldConfig.IsReadOnly}
          numberOfLines={1}
          multiline={false}
          scrollEnabled={true}
        />
      );
    case 'multiLine':
      return (
        <TextInput
          style={{ borderWidth: 1, marginBottom: 8, padding: 8, minHeight: 60 }}
          value={value ?? ''}
          onChangeText={val => onChange(fieldConfig.FieldName, val)}
          placeholder={fieldConfig.Caption}
          editable={mode !== 'view' && !fieldConfig.IsReadOnly}
          multiline={true}
          scrollEnabled={true}
        />
      );
    case 'selectOne':
      return (
        <TouchableOpacity
          disabled={mode === 'view'}
          style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
          onPress={() => {
            /* show select modal */
          }}
        >
          <Text>{value ?? fieldConfig.Caption}</Text>
        </TouchableOpacity>
      );
    case 'selectMulti':
      return (
        <TouchableOpacity
          disabled={mode === 'view'}
          style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
          onPress={() => {
            /* show multi select modal */
          }}
        >
          <Text>
            {Array.isArray(value) ? value.join(', ') : fieldConfig.Caption}
          </Text>
        </TouchableOpacity>
      );
    case 'date':
      return (
        <TouchableOpacity
          disabled={mode === 'view'}
          style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
          onPress={() => {
            if (extraProps.onPickDate)
              extraProps.onPickDate(fieldConfig.FieldName);
          }}
        >
          <Text>{value ?? fieldConfig.Caption}</Text>
        </TouchableOpacity>
      );
    case 'month':
      return (
        <TouchableOpacity
          disabled={mode === 'view'}
          style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
          onPress={() => {
            if (extraProps.onPickMonth)
              extraProps.onPickMonth(fieldConfig.FieldName);
          }}
        >
          <Text>{value ?? fieldConfig.Caption}</Text>
        </TouchableOpacity>
      );
    case 'int':
      return (
        <TextInput
          style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
          value={value?.toString() ?? ''}
          onChangeText={val => onChange(fieldConfig.FieldName, val)}
          placeholder={fieldConfig.Caption}
          editable={mode !== 'view' && !fieldConfig.IsReadOnly}
          keyboardType="numeric"
          numberOfLines={1}
          multiline={false}
          scrollEnabled={true}
        />
      );
    case 'decimal':
      return (
        <TextInput
          style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
          value={value?.toString() ?? ''}
          onChangeText={val => onChange(fieldConfig.FieldName, val)}
          placeholder={fieldConfig.Caption}
          editable={mode !== 'view' && !fieldConfig.IsReadOnly}
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
          <Text>{value ? value.name : fieldConfig.Caption}</Text>
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
          <Text>{value ? 'Đã chọn ảnh' : fieldConfig.Caption}</Text>
        </TouchableOpacity>
      );
    // Các kiểu khác có thể bổ sung thêm
    default:
      return (
        <TextInput
          style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
          value={value ?? ''}
          onChangeText={val => onChange(fieldConfig.FieldName, val)}
          placeholder={fieldConfig.Caption}
          editable={mode !== 'view' && !fieldConfig.IsReadOnly}
          numberOfLines={1}
          multiline={false}
          scrollEnabled={true}
        />
      );
  }
};
