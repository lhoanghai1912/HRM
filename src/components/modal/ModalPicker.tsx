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
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  AppStyles.label,
                  { textAlign: 'center', marginBottom: spacing.medium },
                ]}
              >
                Chọn {fieldLabel}
              </Text>
              <ScrollView
                onScroll={handleScroll}
                scrollEventThrottle={100}
                contentContainerStyle={{
                  // alignItems: 'center',
                  // justifyContent: 'center',
                  backgroundColor: 'red',
                }}
              >
                {data?.pageData?.map((item, idx) => {
                  const value = item.value ?? item.id;
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
                      <Text
                        style={[
                          AppStyles.text,
                          {
                            alignItems: 'center',
                            flex: 1,
                            textAlign: 'center',
                          },
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
              <TouchableOpacity style={styles.doneBtn} onPress={handleDone}>
                <Text style={{ color: '#fff' }}>Xong</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  AppStyles.label,
                  { textAlign: 'center', marginBottom: spacing.medium },
                ]}
              >
                Chọn {fieldLabel}
              </Text>

              <ScrollView
                onScroll={handleScroll}
                scrollEventThrottle={100}
                contentContainerStyle={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
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
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: spacing.small,
    padding: spacing.medium,
    minWidth: '70%',
    maxHeight: '50%',
    justifyContent: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: spacing.medium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    marginBottom: spacing.medium,
  },
  selectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.medium,
    borderWidth: 0.5,
    borderColor: colors.Gray,
    borderRadius: 15,
    backgroundColor: colors.primary,
  },
  rowText: {
    borderWidth: 0.5,
    borderColor: colors.Gray,
    borderRadius: 15,
    fontSize: spacing.medium,
    paddingVertical: spacing.small,
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  selectedText: {
    color: colors.white,
    fontWeight: '500',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#888',
    backgroundColor: '#fff',
    marginRight: spacing.small,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#007AFF',
  },
  checkText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  doneBtn: {
    marginTop: spacing.medium,
    alignSelf: 'flex-end',
    padding: spacing.small,
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  loadMoreBtn: {
    marginVertical: spacing.small,
    alignSelf: 'center',
    padding: spacing.small,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
});

export default ModalPicker;
