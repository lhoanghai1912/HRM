import React, { useState } from 'react';
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
import AppStyles from '../AppStyle';

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
  const [multiValue, setMultiValue] = useState(
    Array.isArray(selectedValue) ? selectedValue : [],
  );
  console.log('ModalPicker data:', data);
  console.log('selectedValue:', selectedValue);
  console.log('multiValue:', multiValue);

  const handleSelect = value => {
    if (multi === true) {
      let newValue = [...multiValue];
      if (newValue.includes(value)) {
        newValue = newValue.filter(v => v !== value);
      } else {
        newValue.push(value);
      }
      setMultiValue(newValue);
    } else {
      onSelect(value);
      const item = data.pageData.find(i => (i.value ?? i.id) === value);
      const label = item?.label ?? item?.name ?? item?.pickListValue ?? '';
      onSelect({ value, label }); // truyền cả value và label ra ngoài
      onClose();
    }
  };

  const handleDone = () => {
    const selectedItems = data.pageData
      .filter(i => multiValue.includes(i.value ?? i.id))
      .map(i => ({
        value: i.value ?? i.id,
        label: i.label ?? i.name ?? i.pickListValue ?? '',
      }));
    onSelect(selectedItems);
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
                  const value = item.values ?? item.id;
                  const label = item.pickListValue ?? item.name ?? '';
                  const checked = multiValue.includes(value);
                  return (
                    <TouchableOpacity
                      key={value ?? idx}
                      style={styles.row}
                      onPress={() => handleSelect(value)}
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
                    item.label ?? item.name ?? item.pickListValue ?? '';
                  const isSelected = selectedValue === value;
                  return (
                    <TouchableOpacity
                      key={value ?? idx}
                      style={[styles.row, isSelected && styles.selectedRow]}
                      onPress={() => handleSelect(value)}
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
});

export default ModalPicker;
