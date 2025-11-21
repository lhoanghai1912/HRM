import React from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import AppInput from '../components/AppInput';
import icons from '../assets/icons';
import AppStyles from '../components/AppStyle';
import { lo } from '../language/Resource';
import { joinString, splitString } from '../components/stringHelper';
import { ms, spacing } from './spacing';
import { colors } from './color';
import { formatDate } from './helper';

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
    case 'Money':
      return 'money'; // Tiền tệ
    case 'Percent':
      return 'percent'; // Phần trăm
    case 'CheckBox':
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

export const getDisplayValue = (
  data: any,
  value: any,
  extraProps: RenderFieldExtraProps = {},
): string => {
  const fieldType = mapFieldType(data.typeControl);

  const fromDisplayField =
    extraProps.formData && data.displayField
      ? extraProps.formData[data.displayField]
      : undefined;

  switch (fieldType) {
    case 'date':
      return formatDate(value);

    case 'month': {
      if (value && typeof value === 'object' && value.month && value.year) {
        return `${value.month}/${value.year}`;
      }
      return value ? String(value) : '';
    }

    case 'selectOne': {
      if (value && typeof value === 'object' && value.label) {
        return value.label;
      }
      const found = (extraProps.pickerData || []).find(
        (item: any) => item.value === value || item.id === value,
      );
      if (found && (found.label || found.name)) {
        return found.label ?? found.name;
      }
      if (fromDisplayField !== undefined && fromDisplayField !== null) {
        return String(fromDisplayField);
      }
      return value ? String(value) : '';
    }

    case 'selectMulti': {
      console.log('selectMulti value = ', value);
      const fromDisplayField =
        extraProps.formData && data.displayField
          ? extraProps.formData[data.displayField]
          : undefined;

      // 1️⃣ value rỗng → ưu tiên lấy từ displayField (JSON string hoặc array)
      if (
        !value ||
        (typeof value === 'string' && value.trim().length === 0) ||
        (Array.isArray(value) && value.length === 0)
      ) {
        if (fromDisplayField) {
          try {
            if (typeof fromDisplayField === 'string') {
              const arr = JSON.parse(fromDisplayField);
              const labels = arr
                .map((d: any) => d.pickListValue)
                .filter(Boolean);
              return labels.join(', ');
            }
            if (Array.isArray(fromDisplayField)) {
              const labels = fromDisplayField
                .map((d: any) => d.pickListValue)
                .filter(Boolean);
              return labels.join(', ');
            }
          } catch {
            // nếu parse fail thì trả raw
            return String(fromDisplayField);
          }
        }
        return '';
      }

      // 2️⃣ value là array object → chỉ lấy pickListValue
      if (Array.isArray(value) && typeof value[0] === 'object') {
        const labels = value
          .map((v: any) => v && v.pickListValue)
          .filter(Boolean);
        return labels.join(', ');
      }

      // 3️⃣ value là array primitive (id / string)
      if (Array.isArray(value)) {
        // nếu thực tế bạn lưu luôn pickListValue trong mảng thì join luôn
        return value.map(v => String(v)).join(', ');
      }

      // 4️⃣ value là string JSON → parse rồi lấy pickListValue
      if (typeof value === 'string') {
        try {
          const arr = JSON.parse(value);
          if (Array.isArray(arr)) {
            const labels = arr.map((d: any) => d.pickListValue).filter(Boolean);
            return labels.join(', ');
          }
        } catch (e) {
          // không phải JSON thì cho nó rơi xuống fallback
          console.log('parse selectMulti value as JSON fail: ', e);
        }
      }

      // 5️⃣ fallback
      return String(value);
    }

    case 'checkbox':
      return value ? 'Có' : 'Không';

    case 'file': {
      if (!value) return '';
      if (typeof value === 'string') return value;
      if (value.name) return value.name;
      if (value.uri) return value.uri;
      if (fromDisplayField) return String(fromDisplayField);
      return '';
    }

    case 'image': {
      if (!value) return '';
      if (typeof value === 'string') return value;
      if (value.uri) return value.uri;
      if (fromDisplayField) return String(fromDisplayField);
      return '';
    }

    case 'organization': {
      if (value && typeof value === 'object' && value.orgStructName) {
        return value.orgStructName;
      }
      if (fromDisplayField) return String(fromDisplayField);
      return value ? String(value) : '';
    }

    case 'employee': {
      if (value && typeof value === 'object' && value.name) {
        return value.name;
      }
      if (fromDisplayField) return String(fromDisplayField);
      return value ? String(value) : '';
    }

    default:
      if (value === null || value === undefined) return '';
      return String(value);
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
  const isReadOnly = data.isReadOnly;
  switch (fieldType) {
    case 'money':
      return (
        <>
          {isReadOnly ? (
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.disabled}
            >
              {value != null && value !== ''
                ? Number(value).toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  })
                : '-'}
            </Text>
          ) : (
            <AppInput
              value={value ?? ''}
              onChangeText={val => onChange(data.fieldName, val)}
              placeholder={`${data.fieldName} - money`}
              keyboardType="numeric"
              editable={!isReadOnly}
              numberOfLines={1}
              multiline={false}
              scrollEnabled={true}
            />
          )}
        </>
      );
    case 'singleLine':
      return (
        <>
          {mode === 'view' || isReadOnly === true ? (
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.disabled}
            >
              {value}
            </Text>
          ) : (
            <AppInput
              value={value ?? ''}
              onChangeText={val => onChange(data.fieldName, val)}
              placeholder={`${data.fieldName} - ${fieldType} `}
              editable={mode !== 'view' && !data.isReadOnly}
              numberOfLines={1}
              multiline={false}
              scrollEnabled={true}
            />
          )}
        </>
      );
    case 'multiLine':
      return mode === 'view' || isReadOnly === true ? (
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.disabled}>
          {value}
        </Text>
      ) : (
        <AppInput
          value={value ?? ''}
          onChangeText={val => onChange(data?.fieldName, val)}
          placeholder={`${data?.fieldName} - ${fieldType} `}
          editable={mode !== 'view' && !data?.isReadOnly}
          multiline={true}
          scrollEnabled={true}
        />
      );
    case 'selectOne':
      //Check displayFieldSource: LocationName

      if (
        data.customConfig &&
        (JSON.parse(data.customConfig)?.LocationID === true ||
          JSON.parse(data.customConfig)?.Procedure === true)
      ) {
        if (mode === 'view' || isReadOnly === true) {
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
            if (extraProps.formData && extraProps.formData[data.displayField]) {
              return extraProps.formData[data.displayField];
            }
            return value || '-';
          })();

          return (
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                color: 'red',
                flex: 1,
                borderColor: colors.Gray,
                borderWidth: 1,
                padding: spacing.small,
                borderRadius: border.radiusMedium,
                backgroundColor: '#e6f7ff',
              }}
            >
              {displayText}
            </Text>
          );
        }

        return (
          <TouchableOpacity
            disabled={mode === 'view' || isReadOnly === true}
            style={{
              borderWidth: 1,
              borderRadius: border.radiusMedium,
              padding: spacing.small,
              marginBottom: spacing.small,
              backgroundColor: '#e6f7ff', // màu khác biệt
            }}
            onPress={() => {
              if (extraProps.onPickSelectOne)
                extraProps.onPickSelectOne(
                  data.fieldName,
                  data.displayField,
                  extraProps.pickerData,
                );
            }}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.disabled}
            >
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
        if (mode === 'view' || isReadOnly === true) {
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
            if (extraProps.formData && extraProps.formData[data.displayField]) {
              return extraProps.formData[data.displayField];
            }
            return value || '-';
          })();

          return (
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.disabled}
            >
              {displayText}
            </Text>
          );
        }

        return (
          <>
            <TouchableOpacity
              disabled={mode === 'view' || isReadOnly === true}
              style={{
                borderWidth: 1,
                borderRadius: border.radiusMedium,
                padding: spacing.small,
                marginBottom: spacing.small,
              }}
              onPress={() => {
                if (extraProps.onPickSelectOne)
                  extraProps.onPickSelectOne(
                    data.fieldName,
                    data.displayField,
                    extraProps.pickerData,
                  );
              }}
            >
              <Text numberOfLines={1} ellipsizeMode="tail">
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
      return mode === 'view' || isReadOnly === true ? (
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.disabled}>
          {value}
        </Text>
      ) : (
        <TouchableOpacity
          disabled={mode === 'view' || isReadOnly === true}
          style={{
            borderWidth: 1,
            borderRadius: border.radiusMedium,
            padding: spacing.small,
            marginBottom: spacing.small,
          }}
          onPress={() => {
            if (extraProps.onPickSelectMulti) {
              // Parse value hiện tại thành array id
              let selectedIds = [];

              // Nếu value là string có dạng "10,11,12"
              if (typeof value === 'string' && value.length > 0) {
                selectedIds = splitString(value, ',');
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
                // console.log('value', value);

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
      return mode === 'view' || isReadOnly === true ? (
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.disabled}>
          {value
            ? typeof value === 'string'
              ? new Date(value).toLocaleDateString('vi-VN')
              : value.toLocaleDateString('vi-VN')
            : ''}
        </Text>
      ) : (
        <TouchableOpacity
          onPress={() => extraProps.onPickDate?.(data.fieldName)}
          disabled={mode === 'view' || isReadOnly === true || data.isReadOnly}
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
      return mode === 'view' || isReadOnly === true ? (
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.disabled}>
          {value && value.month && value.year
            ? `${value.month}/${value.year}`
            : value || ''}
        </Text>
      ) : (
        <TouchableOpacity
          disabled={mode === 'view' || isReadOnly === true}
          style={{ borderWidth: 1, marginBottom: spacing.small, padding: 8 }}
          onPress={() => {
            if (extraProps.onPickMonth) extraProps.onPickMonth(data.fieldName);
          }}
        >
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.disabled}>
            {value ? `${value.month}/${value.year}` : data.fieldName}
          </Text>
        </TouchableOpacity>
      );
    case 'int':
      return mode === 'view' || isReadOnly === true ? (
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.disabled}>
          {value}
        </Text>
      ) : (
        <AppInput
          value={value?.toString() ?? ''}
          onChangeText={val => onChange(data.fieldName, val)}
          placeholder={`${data.fieldName} - ${fieldType} `}
          editable={mode !== 'view' && !data.isReadOnly}
          keyboardType="numeric"
          numberOfLines={1}
          multiline={false}
          scrollEnabled={true}
        />
      );
    case 'decimal':
      return mode === 'view' || isReadOnly === true ? (
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.disabled}>
          {value}
        </Text>
      ) : (
        <AppInput
          value={value?.toString() ?? ''}
          onChangeText={val => onChange(data.fieldName, val)}
          placeholder={`${data.fieldName} - ${fieldType} `}
          editable={mode !== 'view' && !data.isReadOnly}
          keyboardType="decimal-pad"
          numberOfLines={1}
          multiline={false}
          scrollEnabled={true}
        />
      );
    case 'file':
      return mode === 'view' || isReadOnly === true ? (
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.disabled}>
          {value && (value.name || value.uri || typeof value === 'string')
            ? value.name || value.uri || value
            : ''}
        </Text>
      ) : (
        <View
          style={{ borderWidth: 1, marginBottom: spacing.small, padding: 8 }}
        >
          <TouchableOpacity
            disabled={mode === 'view' || isReadOnly === true}
            onPress={() => {
              if (extraProps.onPickFile) extraProps.onPickFile(data.fieldName);
            }}
          >
            <Text style={{ fontWeight: weight.bold }}>
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
                marginTop: spacing.small,
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

    case 'checkbox':
      return mode === 'view' || isReadOnly === true ? (
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.disabled}>
          {value && value === true ? 'Có' : 'Không'}
        </Text>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            disabled={mode === 'view' || isReadOnly === true || data.isReadOnly}
            onPress={() => {
              if (mode !== 'view' && !data.isReadOnly) {
                onChange(data.fieldName, !value);
              }
            }}
            style={{
              marginRight: spacing.small,
              width: ms(20),
              height: ms(20),
              borderWidth: 1,
              borderColor: colors.Gray,
              borderRadius: border.radiusSmall,
              backgroundColor: value ? '#1890ff' : colors.white,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {value ? (
              <View
                style={{
                  width: spacing.medium,
                  height: spacing.medium,
                  backgroundColor: '#1890ff',
                  borderRadius: 2,
                }}
              />
            ) : null}
          </TouchableOpacity>
          <Text style={{}}>
            {data.label ||
              (extraProps.formData &&
                extraProps.formData[data.fieldName + 'Label']) ||
              'Chọn'}
          </Text>
        </View>
      );
    case 'image':
      return mode === 'view' || isReadOnly === true ? (
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.disabled}>
          {value && value.uri
            ? value.uri
            : value && typeof value === 'string'
            ? value
            : ''}
        </Text>
      ) : (
        <TouchableOpacity
          disabled={mode === 'view' || isReadOnly === true}
          style={{ borderWidth: 1, marginBottom: spacing.small, padding: 8 }}
          onPress={() => {
            if (extraProps.onPickImage) extraProps.onPickImage(data.fieldName);
          }}
        >
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.disabled}>
            {value && value.uri
              ? 'Đã chọn ảnh'
              : value && typeof value === 'string'
              ? 'Đã chọn ảnh'
              : 'Chọn ảnh'}
          </Text>
        </TouchableOpacity>
      );
    case 'organization':
      return mode === 'view' || isReadOnly === true ? (
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.disabled}>
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
              borderRadius: border.radiusMedium,
              padding: spacing.small,
              marginBottom: spacing.small,
              backgroundColor: '#e6f7ff',
            }}
            disabled={mode === 'view' || isReadOnly === true || data.isReadOnly}
          >
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.text}>
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
      return mode === 'view' || isReadOnly === true ? (
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.disabled}>
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
            borderRadius: border.radiusMedium,
            padding: spacing.small,
            marginBottom: spacing.small,
            backgroundColor: '#e6f7ff',
          }}
          disabled={mode === 'view' || isReadOnly === true || data.isReadOnly}
        >
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.text}>
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
      return mode === 'view' || isReadOnly === true ? (
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.disabled}>
          {value}
        </Text>
      ) : (
        <AppInput
          value={value ?? ''}
          onChangeText={val => onChange(data.fieldName, val)}
          placeholder={`${data.fieldName} - ${fieldType} `}
          editable={mode !== 'view' && !data.isReadOnly}
          numberOfLines={1}
          multiline={false}
          scrollEnabled={true}
        />
      );
  }
};
const styles = StyleSheet.create({
  cell: {
    padding: spacing.small,
    borderWidth: 0.5,
    borderColor: colors.Gray,
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  disabled: {
    flex: 1,
    borderColor: colors.Gray,
    // borderWidth: 1,
    padding: spacing.small,
    borderRadius: border.radiusMedium,
    backgroundColor: colors.lightGray,
  },
});
