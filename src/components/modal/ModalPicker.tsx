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
import { colors } from '../../utils/color';
import { spacing } from '../../utils/spacing';
import { lo } from '../../language/Resource';
import AppStyles from '../AppStyle';

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
        <View style={styles.container}>
          {!data?.pageData || data.pageData.length === 0 ? (
            <View style={styles.loadingContainer}>
              {loadingMore ? (
                <>
                  <ActivityIndicator size="large" color="#007AFF" />
                  <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
                </>
              ) : (
                <Text style={styles.loadingText}>Không có dữ liệu</Text>
              )}
            </View>
          ) : multi ? (
            <View style={styles.multiContainer}>
              <Text style={styles.headerText}>Chọn {fieldLabel}</Text>
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
                        style={[styles.checkbox, checked && styles.checked]}
                      >
                        {checked && <Text style={styles.checkText}>✓</Text>}
                      </View>
                      <Text style={styles.rowText}>{label}</Text>
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
              <TouchableOpacity style={styles.doneBtn} onPress={handleDone}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Xong</Text>
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
                      style={[styles.row, isSelected && styles.selectedRow]}
                      onPress={() => handleSelect(item)}
                    >
                      <Text
                        style={[
                          styles.rowText,
                          isSelected && styles.selectedText,
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
                    <Text style={{ color: '#007AFF' }}>Tải thêm</Text>
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
    backgroundColor: colors.white,
    borderRadius: 12,
    minWidth: '80%',
    maxWidth: '90%',
    maxHeight: '70%',
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
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  scrollView: {
    flexGrow: 0, // Quan trọng: không để grow, cho phép co theo content
    maxHeight: '80%', // Giới hạn chiều cao scroll
    marginVertical: spacing.medium,
  },
  scrollContent: {
    padding: spacing.small,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.medium,
    marginVertical: spacing.small,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.Gray,
    minHeight: 44, // Đảm bảo chiều cao tối thiểu cho dễ touch
  },
  selectedRow: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  rowText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    textAlign: 'left',
  },
  selectedText: {
    color: colors.white,
    fontWeight: '500',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    marginRight: spacing.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  doneBtn: {
    margin: spacing.medium,
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.large,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignSelf: 'center',
    minWidth: 80,
  },
  doneBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadMoreBtn: {
    marginVertical: spacing.small,
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#007AFF',
    alignSelf: 'center',
  },
  checkedRow: {
    backgroundColor: colors.primary,
    borderColor: '#1976d2',
  },
  checkedText: {
    color: '#1976d2',
    fontWeight: '500',
  },
});

export default ModalPicker;
