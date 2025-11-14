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
  onClearFile?: (fieldName: string, displayField: string) => void; // Thêm dòng này
  onPickOrganization?: (
    fieldName: string,
    displayField: string,
    cfg: any,
  ) => void;
  onPickEmployee?: (fieldName: string, displayField: string, cfg: any) => void;
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
    case 'Organization':
      return 'organization';
    case 'Employee':
      return 'employee';

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
        <>
          {mode === 'view' ? (
            <Text>{value}</Text>
          ) : (
            <AppInput
              value={value ?? ''}
              onChangeText={val => onChange(data.fieldName, val)}
              placeholder={`${data.fieldName} - ${fieldType} `}
              editable={mode !== 'view' && !data.IsReadOnly}
              numberOfLines={1}
              multiline={false}
              scrollEnabled={true}
            />
          )}
        </>
      );
    case 'multiLine':
      return mode === 'view' ? (
        <Text>{value}</Text>
      ) : (
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
        data.customConfig &&
        JSON.parse(data.customConfig)?.LocationID === true
      ) {
        if (mode === 'view') {
          // Mode view: chỉ hiển thị text gọn gàng
          const displayText = (() => {
            if (value && typeof value === 'object' && value.label) {
              return value.label;
            }
            const found = (extraProps.pickerData || []).find(
              item => item.value === value || item.id === value,
            );
            if (found && (found.label || found.name)) {
              return found.label ?? found.name;
            }
            if (
              extraProps.formData &&
              extraProps.formData[data.displayField]
            ) {
              return extraProps.formData[data.displayField];
            }
            return value || '-';
          })();
          
          return (
            <Text 
              numberOfLines={1} 
              ellipsizeMode="tail"
              style={{ flex: 1 }}
            >
              {displayText}
            </Text>
          );
        }
        
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
              console.log('extraProps123123213213213123', extraProps.formData);
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
        if (mode === 'view') {
          // Mode view: chỉ hiển thị text gọn gàng
          const displayText = (() => {
            if (value && typeof value === 'object' && value.label) {
              return value.label;
            }
            const found = (extraProps.pickerData || []).find(
              item => item.value === value || item.id === value,
            );
            if (found && (found.label || found.name)) {
              return found.label ?? found.name;
            }
            if (
              extraProps.formData &&
              extraProps.formData[data.displayField]
            ) {
              return extraProps.formData[data.displayField];
            }
            return value || '-';
          })();
          
          return (
            <Text 
              numberOfLines={1} 
              ellipsizeMode="tail"
              style={{ flex: 1 }}
            >
              {displayText}
            </Text>
          );
        }
        
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
      return mode === 'view' ? (
        <Text>{value}</Text>
      ) : (
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
              let selectedIds = [];
              if (typeof value === 'string' && value.length > 0) {
                selectedIds = splitString(value, ',');
              } else if (Array.isArray(value)) {
                selectedIds = value.map(v => v.value ?? v.id ?? v);
              }
              extraProps.onPickSelectMulti(
                data.fieldName,
                data.displayField,
                extraProps.pickerData,
                selectedIds,
              );
            }
          }}
        >
          <Text>{/* ...hiển thị label như cũ... */}</Text>
        </TouchableOpacity>
      );
    case 'date':
      return mode === 'view' ? (
        <Text>
          {value
            ? typeof value === 'string'
              ? new Date(value).toLocaleDateString('vi-VN')
              : value.toLocaleDateString('vi-VN')
            : ''}
        </Text>
      ) : (
        <TouchableOpacity
          onPress={() => extraProps.onPickDate?.(data.fieldName)}
          disabled={mode === 'view' || data.IsReadOnly}
        >
          <AppInput
            value={
              value
                ? typeof value === 'string'
                  ? new Date(value).toLocaleDateString('vi-VN')
                  : value.toLocaleDateString('vi-VN')
                : ''
            }
            placeholder={data.fieldName}
            editable={false}
            pointerEvents="none"
          />
        </TouchableOpacity>
      );
    case 'month':
      return mode === 'view' ? (
        <Text>
          {value && value.month && value.year
            ? `${value.month}/${value.year}`
            : value || ''}
        </Text>
      ) : (
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
      return mode === 'view' ? (
        <Text>{value}</Text>
      ) : (
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
      return mode === 'view' ? (
        <Text>{value}</Text>
      ) : (
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
      return mode === 'view' ? (
        <Text>
          {value && (value.name || value.uri || typeof value === 'string')
            ? value.name || value.uri || value
            : ''}
        </Text>
      ) : (
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
                  onPress={() => {
                    // Clear trong formData
                    onChange(data.fieldName, null, data.displayField, null);

                    // Clear trong pickedFiles (nếu có callback)
                    if (extraProps.onClearFile) {
                      extraProps.onClearFile(data.fieldName, data.displayField);
                    }
                  }}
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
      return mode === 'view' ? (
        <Text>
          {value && value.uri
            ? value.uri
            : value && typeof value === 'string'
            ? value
            : ''}
        </Text>
      ) : (
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
    case 'organization':
      return mode === 'view' ? (
        <Text>
          {value && typeof value === 'object' && value.orgStructName
            ? value.orgStructName
            : value || ''}
        </Text>
      ) : (
        <>
          <TouchableOpacity
            onPress={() =>
              extraProps.onPickOrganization?.(
                data.fieldName,
                data.displayField,
                data,
              )
            }
            style={{
              borderWidth: 1,
              borderRadius: 10,
              padding: 8,
              marginBottom: 8,
              backgroundColor: '#e6f7ff',
            }}
            disabled={mode === 'view' || data.IsReadOnly}
          >
            <Text>
              {(() => {
                // 1. Nếu value là object có orgStructName
                if (value && typeof value === 'object' && value.orgStructName) {
                  return value.orgStructName;
                }

                // 3. Nếu formData có displayField (thường là tên)
                if (
                  extraProps.formData &&
                  extraProps.formData[data.displayField]
                ) {
                  return extraProps.formData[data.displayField];
                }
                // 4. Nếu value là string (id), không hiển thị id
                // 5. Fallback
                return 'Chọn tổ chức';
              })()}
            </Text>
          </TouchableOpacity>
          {/* TreePicker sẽ được show ở component cha khi onPickOrganization được gọi */}
        </>
      );
    case 'employee':
      return mode === 'view' ? (
        <Text>
          {value && typeof value === 'object' && value.name
            ? value.name
            : value || ''}
        </Text>
      ) : (
        <TouchableOpacity
          onPress={() =>
            extraProps.onPickEmployee?.(data.fieldName, data.displayField, data)
          }
          style={{
            borderWidth: 1,
            borderRadius: 10,
            padding: 8,
            marginBottom: 8,
            backgroundColor: '#e6f7ff',
          }}
          disabled={mode === 'view' || data.IsReadOnly}
        >
          <Text>
            {(() => {
              // Nếu value là object có name
              if (value && typeof value === 'object' && value.name) {
                return value.name;
              }
              // Nếu formData có displayField
              if (
                extraProps.formData &&
                extraProps.formData[data.displayField]
              ) {
                return extraProps.formData[data.displayField];
              }
              return 'Chọn nhân viên';
            })()}
          </Text>
        </TouchableOpacity>
      );
    // Các kiểu khác có thể bổ sung thêm
    default:
      return mode === 'view' ? (
        <Text>{value}</Text>
      ) : (
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
