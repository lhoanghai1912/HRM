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

const ModalPicker = ({
  visible,
  data = { pageData: [] },
  selectedValue,
  onSelect,
  onClose,
  multi,
  onLoadMore, // callback để load thêm dữ liệu
  loadingMore, // boolean: đang load thêm
  hasMore = false, // boolean: còn dữ liệu để load tiếp
  fieldLabel = '',
}) => {
  const [multiValue, setMultiValue] = useState([]);

  // Hàm parse selectedValue thành array
  const parseSelectedValue = value => {
    if (!value) return [];

    if (Array.isArray(value)) {
      return value;
    }

    if (typeof value === 'string') {
      // Tách string "10;11" thành ["10", "11"]
      return value.split(';').filter(item => item.trim().length > 0);
    }

    return [value];
  };

  // Cập nhật multiValue khi selectedValue hoặc visible thay đổi
  useEffect(() => {
    if (multi && visible) {
      const parsedValues = parseSelectedValue(selectedValue);

      // Nếu parsedValues là array của IDs (string/number), convert sang array of objects
      if (parsedValues.length > 0 && typeof parsedValues[0] !== 'object') {
        const selectedObjects =
          data?.pageData?.filter(item => {
            const itemId = item.value ?? item.id;
            return parsedValues.some(v => String(v) === String(itemId));
          }) || [];
        setMultiValue(selectedObjects);
      } else {
        // Nếu đã là array of objects thì dùng luôn
        setMultiValue(parsedValues);
      }
    }
  }, [selectedValue, multi, visible, data]);

  const handleSelect = item => {
    if (multi === true) {
      // Lấy ID từ item
      const value = item.value ?? item.id;
      const valueStr = String(value);

      let newValue = [...multiValue];

      // Kiểm tra xem đã chọn chưa (so sánh theo ID)
      const hasValue = newValue.some(v => {
        const vId = v.value ?? v.id ?? v;
        return String(vId) === valueStr;
      });

      if (hasValue) {
        // Bỏ chọn: loại bỏ item khỏi mảng
        newValue = newValue.filter(v => {
          const vId = v.value ?? v.id ?? v;
          return String(vId) !== valueStr;
        });
      } else {
        // Chọn: thêm toàn bộ item vào mảng
        newValue.push(item);
      }

      setMultiValue(newValue);
      console.log('multiValue on select:', newValue);
    } else {
      // Single select: giữ nguyên logic cũ
      const value = item.value ?? item.id;
      const label = item?.label ?? item?.name ?? item?.pickListValue ?? '';
      onSelect({ value, label });
      onClose();
    }
  };

  const handleDone = () => {
    console.log('multiValue on done:', multiValue);

    // Map multiValue thành format {value, label}
    const selectedItems = multiValue.map(item => ({
      value: item.value ?? item.id,
      label: item.label ?? item.name ?? item.pickListValue ?? '',
    }));

    onSelect(multiValue);
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
          {/* Show loading when no data available yet */}
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
                  const label =
                    item.pickListValue ?? item.name ?? item.label ?? '';

                  // So sánh để kiểm tra đã chọn
                  const checked = multiValue.some(v => {
                    const vId = v.value ?? v.id ?? v;
                    return String(vId) === String(value);
                  });

                  return (
                    <TouchableOpacity
                      key={value ?? idx}
                      style={[styles.row, checked && styles.checkedRow]}
                      onPress={() => {
                        console.log('value select multi:', item);
                        handleSelect(item); // Truyền cả item
                      }}
                    >
                      <View
                        style={[styles.checkbox, checked && styles.checked]}
                      >
                        {checked && <Text style={styles.checkText}>✓</Text>}
                      </View>
                      <Text
                        style={[styles.rowText, checked && styles.checkedText]}
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
              <TouchableOpacity style={styles.doneBtn} onPress={handleDone}>
                <Text style={styles.doneBtnText}>Xong</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.singleContainer}>
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
                  const label =
                    item.pickListValue ?? item.name ?? item.label ?? '';
                  const checked = multiValue.some(
                    v => String(v) === String(value),
                  );
                  return (
                    <TouchableOpacity
                      key={value ?? idx}
                      style={[styles.row, checked && styles.checkedRow]}
                      onPress={() => {
                        console.log('value select multi:', item);
                        handleSelect(item); // Truyền cả item thay vì chỉ value
                      }}
                    >
                      <View
                        style={[styles.checkbox, checked && styles.checked]}
                      >
                        {checked && <Text style={styles.checkText}>✓</Text>}
                      </View>
                      <Text
                        style={[styles.rowText, checked && styles.checkedText]}
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
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
    marginVertical: 2,
    borderRadius: 8,
    borderWidth: 0.5,
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
    backgroundColor: '#e3f2fd',
    borderColor: '#1976d2',
  },
  checkedText: {
    color: '#1976d2',
    fontWeight: '500',
  },
});

export default ModalPicker;
