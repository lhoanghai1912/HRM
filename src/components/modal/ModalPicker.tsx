import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { spacing } from '../../utils/spacing';
import { lo } from '../../language/Resource';
import AppStyles from '../AppStyle';
import { border, weight } from '../../utils/fontSize';
import { useColors } from '../../hooks/useColors';

const ModalPicker = ({
  visible,
  data = { pageData: [] },
  selectedValue,
  onSelect,
  onClose,
  multi,
  onLoadMore,
  loadingMore,
  hasMore = false,
  fieldLabel = '',
}) => {
  const colors = useColors();
  const [multiValue, setMultiValue] = useState([]);

  console.log('ModalPicker selectedValue:', selectedValue);
  console.log('ModalPicker data:', data);

  // Parse selectedValue thành array of IDs
  const parseSelectedIds = value => {
    if (!value) return [];

    // Nếu là array
    if (Array.isArray(value)) {
      // Nếu là array of objects [{value, label, id, ...}]
      if (
        value.length > 0 &&
        typeof value[0] === 'object' &&
        value[0] !== null
      ) {
        return value
          .map(v => String(v.value ?? v.id))
          .filter(v => v && v !== 'null' && v !== 'undefined');
      }
      // Nếu là array of IDs [1, 2, 3]
      return value
        .filter(v => v !== null && v !== undefined)
        .map(v => String(v));
    }

    // Nếu là string
    if (typeof value === 'string') {
      // Thử parse JSON: "[9,10,11]" hoặc "[{...},{...}]"
      try {
        const arr = JSON.parse(value);
        if (Array.isArray(arr)) {
          // Nếu là array of objects
          if (arr.length > 0 && typeof arr[0] === 'object' && arr[0] !== null) {
            return arr
              .map(v => String(v.value ?? v.id))
              .filter(v => v && v !== 'null' && v !== 'undefined');
          }
          // Nếu là array of IDs
          return arr
            .filter(v => v !== null && v !== undefined)
            .map(v => String(v));
        }
      } catch (e) {}

      // Nếu là chuỗi "10,11,12"
      return value
        .split(',')
        .map(v => v.trim())
        .filter(v => v.length > 0 && v !== 'null' && v !== 'undefined');
    }

    // Single value
    return value !== null && value !== undefined ? [String(value)] : [];
  };
  // Update multiValue khi selectedValue hoặc visible thay đổi
  useEffect(() => {
    if (multi && visible) {
      const selectedIds = parseSelectedIds(selectedValue);
      console.log('Parsed selected IDs:', selectedIds);
      setMultiValue(selectedIds);
    }
  }, [selectedValue, multi, visible]);
  useEffect(() => {
    if (multi && visible) {
      const selectedIds = parseSelectedIds(selectedValue);
      console.log('Parsed selected IDs:', selectedIds);
      setMultiValue(selectedIds);
    }
  }, [selectedValue, multi, visible]);

  const handleSelect = item => {
    if (multi === true) {
      const value = item.value ?? item.id;
      const valueStr = String(value);
      let newValue = [...multiValue];

      // Kiểm tra xem đã chọn chưa
      const hasValue = newValue.includes(valueStr);

      if (hasValue) {
        // Bỏ chọn
        newValue = newValue.filter(v => v !== valueStr);
      } else {
        // Chọn thêm
        newValue.push(valueStr);
      }

      setMultiValue(newValue);
      console.log('Updated multiValue:', newValue);
    } else {
      // Single select
      const value = item.id;
      const label = item?.pickListValue ?? '';
      onSelect({ value, label });
      onClose();
    }
  };

  const handleDone = () => {
    console.log('Final multiValue:', multiValue);

    // Map IDs thành objects với đầy đủ thông tin
    const selectedItems = multiValue
      .map(id => {
        const item = data.pageData?.find(
          i => String(i.value ?? i.id) === String(id),
        );
        return item || null;
      })
      .filter(Boolean);

    // Gửi lên cả mảng object (selectedItems) và chuỗi JSON (labelString)
    const labelString = JSON.stringify(selectedItems);

    console.log('Selected items:', selectedItems);
    console.log('Label string:', labelString);

    onSelect(selectedItems, labelString); // Trả về cả mảng object và chuỗi JSON
    onClose();
  };

  // Xử lý khi cuộn đến cuối danh sách
  const handleScroll = ({ nativeEvent }) => {
    if (
      hasMore &&
      !loadingMore &&
      nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
        nativeEvent.contentSize.height - 20
    ) {
      onLoadMore && onLoadMore();
    }
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={[
            styles.container,
            { backgroundColor: colors.surface, shadowColor: colors.black },
          ]}
        >
          {!data?.pageData || data.pageData.length === 0 ? (
            <View style={styles.loadingContainer}>
              {loadingMore ? (
                <>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text
                    style={[
                      styles.loadingText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Đang tải dữ liệu...
                  </Text>
                </>
              ) : (
                <Text
                  style={[styles.loadingText, { color: colors.textSecondary }]}
                >
                  Không có dữ liệu
                </Text>
              )}
            </View>
          ) : multi ? (
            <View style={styles.multiContainer}>
              <Text
                style={[
                  styles.headerText,
                  {
                    color: colors.text,
                    backgroundColor: colors.surface,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                Chọn {fieldLabel}
              </Text>
              <ScrollView
                onScroll={handleScroll}
                scrollEventThrottle={100}
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
              >
                {data?.pageData?.map((item, idx) => {
                  const value = item.value ?? item.id;
                  const valueStr = String(value);
                  const label =
                    item.pickListValue ?? item.name ?? item.label ?? '';

                  // Kiểm tra đã chọn: so sánh với array of IDs
                  const checked = multiValue.includes(valueStr);

                  return (
                    <TouchableOpacity
                      key={value ?? idx}
                      style={styles.row}
                      onPress={() => handleSelect(item)}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          checked && {
                            backgroundColor: colors.primary,
                            borderColor: colors.primary,
                          },
                        ]}
                      >
                        {checked && (
                          <Text
                            style={[styles.checkText, { color: colors.white }]}
                          >
                            ✓
                          </Text>
                        )}
                      </View>
                      <Text style={[styles.rowText, { color: colors.text }]}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                {loadingMore && (
                  <ActivityIndicator
                    style={{ marginVertical: spacing.small }}
                  />
                )}
                {hasMore && !loadingMore && (
                  <TouchableOpacity
                    style={styles.loadMoreBtn}
                    onPress={onLoadMore}
                  >
                    <Text style={{ color: '#007AFF' }}>Tải thêm</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
              <TouchableOpacity
                style={[styles.doneBtn, { backgroundColor: colors.primary }]}
                onPress={handleDone}
              >
                <Text style={{ color: colors.white, fontWeight: weight.bold }}>
                  Xong
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Single select code giữ nguyên
            <View style={[styles.multiContainer, { padding: spacing.medium }]}>
              <Text
                style={[
                  AppStyles.label,
                  {
                    textAlign: 'center',
                  },
                ]}
              >
                Chọn {fieldLabel}
              </Text>

              <ScrollView
                onScroll={handleScroll}
                scrollEventThrottle={100}
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
              >
                {data?.pageData?.map((item, idx) => {
                  const value = item.id;
                  const label = item.pickListValue;
                  const isSelected = selectedValue === value;
                  return (
                    <TouchableOpacity
                      key={value ?? idx}
                      style={[
                        styles.row,
                        isSelected && {
                          backgroundColor: colors.primary,
                          borderColor: colors.primary,
                        },
                      ]}
                      onPress={() => handleSelect(item)}
                    >
                      <Text
                        style={[
                          styles.rowText,
                          { color: isSelected ? colors.white : colors.text },
                        ]}
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                {loadingMore && (
                  <ActivityIndicator
                    style={{ marginVertical: spacing.small }}
                  />
                )}
                {hasMore && !loadingMore && (
                  <TouchableOpacity
                    style={styles.loadMoreBtn}
                    onPress={onLoadMore}
                  >
                    <Text style={{ color: colors.primary }}>Tải thêm</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

// Thêm styles cho checked state
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.medium,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    minWidth: '80%',
    // maxWidth: '90%',
    // maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.large,
    minHeight: 150,
  },
  loadingText: {
    marginTop: spacing.small,
    color: '#666',
    fontSize: spacing.medium,
  },
  multiContainer: {
    // Không set chiều cao cố định, để co theo content
  },
  singleContainer: {},
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: spacing.medium,
    paddingHorizontal: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  scrollView: {
    flexGrow: 0, // Quan trọng: không để grow, cho phép co theo content
    maxHeight: '90%', // Giới hạn chiều cao scroll
    // marginVertical: spacing.medium,
  },
  scrollContent: {
    padding: spacing.small,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.medium,
    marginVertical: spacing.small,
    borderRadius: border.radiusMedium,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 44, // Đảm bảo chiều cao tối thiểu cho dễ touch
  },
  selectedRow: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  rowText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    textAlign: 'left',
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: border.radiusSmall,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    marginRight: spacing.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkText: {
    color: '#FFFFFF',
    fontWeight: weight.bold,
    fontSize: 12,
  },
  doneBtn: {
    margin: spacing.medium,
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.large,
    backgroundColor: '#007AFF',
    borderRadius: border.radiusMedium,
    alignSelf: 'center',
    minWidth: 80,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadMoreBtn: {
    marginVertical: spacing.small,
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
    borderRadius: border.radiusSmall,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignSelf: 'center',
  },
  checkedRow: {
    backgroundColor: '#1976D2',
    borderColor: '#1976d2',
  },
  checkedText: {
    color: '#1976d2',
    fontWeight: '500',
  },
});

export default ModalPicker;
