import React from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import AppInput from '../components/AppInput';
import icons from '../assets/icons';
import AppStyles from '../components/AppStyle';
import { lo } from '../language/Resource';
import { joinString, splitString } from '../components/stringHelper';

type RenderFieldExtraProps = {
  onPickDate?: (fieldName: string) => void;
  onPickMonth?: (fieldName: string) => void;
  onPickSelectOne?: (
    fieldName: string,
    displayField: string,
    pickerData: any,
  ) => void;
  onPickSelectMulti?: (
    fieldName: string,
    displayField: string,
    pickerData: any,
    selectedValues?: string[],
  ) => void;
  pickerData?: any[];
  formData?: Record<string, any>;
  onPickFile?: (fieldName: string) => void;
  onPickImage?: (fieldName: string) => void;
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
      //Check displayFieldSource: LocationName
      if (
        data.displayFieldSource &&
        data.displayFieldSource === 'LocationName'
      ) {
        return (
          <TouchableOpacity
            disabled={mode === 'view'}
            style={{
              borderWidth: 1,
              borderRadius: 10,
              padding: 8,
              marginBottom: 8,
              backgroundColor: '#e6f7ff', // màu khác biệt
            }}
            onPress={() => {
              if (extraProps.onPickSelectOne)
                extraProps.onPickSelectOne(
                  data.fieldName,
                  data.displayField,
                  extraProps.pickerData,
                );
              console.log('extraProps', extraProps.formData);
            }}
          >
            <Text>
              {(() => {
                // 1. Nếu value là object có label
                if (value && typeof value === 'object' && value.label) {
                  return value.label;
                }
                // 2. Tìm trong pickerData
                const found = (extraProps.pickerData || []).find(
                  item => item.value === value || item.id === value,
                );
                if (found && (found.label || found.name)) {
                  return found.label ?? found.name;
                }
                // 3. Nếu không có thì lấy từ formData[displayField]
                if (
                  extraProps.formData &&
                  extraProps.formData[data.displayField]
                ) {
                  return extraProps.formData[data.displayField];
                }
                // 4. Fallback
                return 'Chọn...';
              })()}
            </Text>
          </TouchableOpacity>
        );
      } else {
        return (
          <>
            <TouchableOpacity
              disabled={mode === 'view'}
              style={{
                borderWidth: 1,
                borderRadius: 10,
                padding: 8,
                marginBottom: 8,
              }}
              onPress={() => {
                if (extraProps.onPickSelectOne)
                  extraProps.onPickSelectOne(
                    data.fieldName,
                    data.displayField,
                    extraProps.pickerData,
                  );
                console.log('extraProps', extraProps.formData);
              }}
            >
              <Text>
                {(() => {
                  // 1. Nếu value là object có label
                  if (value && typeof value === 'object' && value.label) {
                    return value.label;
                  }
                  // 2. Tìm trong pickerData
                  const found = (extraProps.pickerData || []).find(
                    item => item.value === value || item.id === value,
                  );
                  if (found && (found.label || found.name)) {
                    return found.label ?? found.name;
                  }
                  // 3. Nếu không có thì lấy từ formData[displayField]
                  if (
                    extraProps.formData &&
                    extraProps.formData[data.displayField]
                  ) {
                    return extraProps.formData[data.displayField];
                  }
                  // 4. Fallback
                  return 'Chọn...';
                })()}
              </Text>
            </TouchableOpacity>
          </>
        );
      }
    case 'selectMulti':
      return (
        <TouchableOpacity
          disabled={mode === 'view'}
          style={{
            borderWidth: 1,
            borderRadius: 10,
            padding: 8,
            marginBottom: 8,
          }}
          onPress={() => {
            if (extraProps.onPickSelectMulti) {
              // Parse value hiện tại thành array id
              let selectedIds = [];

              // Nếu value là string có dạng "10;11;12"
              if (typeof value === 'string' && value.length > 0) {
                selectedIds = splitString(value, ';');
              }
              // Nếu value đã là mảng
              else if (Array.isArray(value)) {
                selectedIds = value.map(v => v.value ?? v.id ?? v);
              }

              console.log('Selected IDs for multiSelect:', selectedIds);

              extraProps.onPickSelectMulti(
                data.fieldName,
                data.displayField,
                extraProps.pickerData,
                selectedIds, // Truyền mảng id
              );
            }
          }}
        >
          <Text>
            {(() => {
              if (
                !value ||
                (typeof value === 'string' && value.trim().length === 0) ||
                (Array.isArray(value) && value.length === 0)
              ) {
                return 'Chọn...';
              }
              if (Array.isArray(value) && typeof value[0] === 'object') {
                console.log('value', value);

                const labels = value
                  .map(
                    v =>
                      v.pickListValue ||
                      v.label ||
                      v.name ||
                      (typeof v === 'string' ? v : ''),
                  )
                  .filter(Boolean);
                if (labels.length > 0) return joinString(labels, ', ');
              }

              // Nếu formData có displayField
              if (
                extraProps.formData &&
                extraProps.formData[data.displayField]
              ) {
                const displayValue = extraProps.formData[data.displayField];
                if (typeof displayValue === 'string') {
                  const toArray = JSON.parse(displayValue);
                  const mapValue = toArray.map(d => {
                    return d.pickListValue;
                  });
                  const labels = joinString(mapValue, ', ');

                  // console.log('mang sau khi chuyen', labels);
                  // console.log('value',labels.pickListValue);

                  return labels;
                }
                if (Array.isArray(displayValue)) {
                  console.log('defg', displayValue);

                  const labels = joinString(
                    displayValue.map(d => d.pickListValue),
                    ', ',
                  );
                  return labels;
                }
              }
              return 'Chọn...';
            })()}
          </Text>
        </TouchableOpacity>
      );
    case 'date':
      // Kiểm tra và convert value thành Date
      let dateValue = value;
      if (typeof value === 'string') {
        dateValue = new Date(value);
      } else if (!value || !(value instanceof Date)) {
        dateValue = null;
      }

      return (
        <TouchableOpacity
          onPress={() => extraProps.onPickDate?.(data.fieldName)}
          disabled={mode === 'view' || data.IsReadOnly}
        >
          <AppInput
            value={
              dateValue && !isNaN(dateValue.getTime())
                ? dateValue.toLocaleDateString('vi-VN')
                : ''
            }
            placeholder={data.fieldName}
            editable={false}
            pointerEvents="none"
          />
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
        <View style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}>
          <TouchableOpacity
            disabled={mode === 'view'}
            onPress={() => {
              if (extraProps.onPickFile) extraProps.onPickFile(data.fieldName);
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>
              {value && (value.name || value.uri || typeof value === 'string')
                ? 'Đã chọn file'
                : 'Chọn file'}
            </Text>
          </TouchableOpacity>

          {/* Hiển thị file đã chọn hoặc từ API */}
          {value && (value.name || value.uri || typeof value === 'string') ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 8,
              }}
            >
              <Text style={{ flex: 1 }}>
                {
                  // Ưu tiên hiển thị tên file vừa chọn
                  value.name
                    ? value.name
                    : extraProps.formData &&
                      data.displayField &&
                      extraProps.formData[data.displayField]
                    ? extraProps.formData[data.displayField]
                    : value.uri ||
                      (typeof value === 'string' ? value : 'File đã chọn')
                }
              </Text>
              {mode !== 'view' && (
                <TouchableOpacity
                  onPress={() => onChange(data.fieldName, null)}
                  style={{ padding: 4 }}
                >
                  <Image source={icons.clear} style={AppStyles.icon}></Image>
                </TouchableOpacity>
              )}
            </View>
          ) : null}
        </View>
      );
    case 'image':
      return (
        <TouchableOpacity
          disabled={mode === 'view'}
          style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
          onPress={() => {
            if (extraProps.onPickImage) extraProps.onPickImage(data.fieldName);
          }}
        >
          <Text>
            {value && value.uri
              ? 'Đã chọn ảnh'
              : value && typeof value === 'string'
              ? 'Đã chọn ảnh'
              : 'Chọn ảnh'}
          </Text>
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
