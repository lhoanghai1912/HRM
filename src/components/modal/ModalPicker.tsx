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
import { Picker } from '@react-native-picker/picker';

const ModalPicker = ({
  visible,
  data = { pageData: [] },
  selectedValue,
  onSelect,
  onClose,
  multi = false,
  onLoadMore, // callback để load thêm dữ liệu
  loadingMore, // boolean: đang load thêm
  hasMore = false, // boolean: còn dữ liệu để load tiếp
}) => {
  const [multiValue, setMultiValue] = useState(
    Array.isArray(selectedValue) ? selectedValue : [],
  );
  console.log('ModalPicker data:', data);

  const handleSelect = value => {
    if (multi) {
      let newValue = [...multiValue];
      if (newValue.includes(value)) {
        newValue = newValue.filter(v => v !== value);
      } else {
        newValue.push(value);
      }
      setMultiValue(newValue);
    } else {
      onSelect(value);
      onClose();
    }
  };

  const handleDone = () => {
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
          {multi ? (
            <ScrollView onScroll={handleScroll} scrollEventThrottle={100}>
              {data?.pageData?.map((item, idx) => {
                const value = item.value ?? item.id;
                const label = item.label ?? item.name ?? '';
                const checked = multiValue.includes(value);
                return (
                  <TouchableOpacity
                    key={value ?? idx}
                    style={styles.row}
                    onPress={() => handleSelect(value)}
                  >
                    <View style={[styles.checkbox, checked && styles.checked]}>
                      {checked && <Text style={styles.checkText}>✓</Text>}
                    </View>
                    <Text>{label}</Text>
                  </TouchableOpacity>
                );
              })}
              {loadingMore && (
                <ActivityIndicator style={{ marginVertical: 8 }} />
              )}
              {hasMore && !loadingMore && (
                <TouchableOpacity
                  style={styles.loadMoreBtn}
                  onPress={onLoadMore}
                >
                  <Text style={{ color: '#007AFF' }}>Tải thêm</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.doneBtn} onPress={handleDone}>
                <Text style={{ color: '#fff' }}>Xong</Text>
              </TouchableOpacity>
            </ScrollView>
          ) : (
            <Picker selectedValue={selectedValue} onValueChange={handleSelect}>
              {data?.pageData.map((item, idx) => (
                <Picker.Item
                  key={item.value ?? item.id ?? idx}
                  label={item.pickListValue ?? item.name ?? ''}
                  value={item.value ?? item.id}
                />
              ))}
            </Picker>
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
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    minWidth: 250,
    maxHeight: '70%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#888',
    backgroundColor: '#fff',
    marginRight: 8,
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
    marginTop: 16,
    alignSelf: 'flex-end',
    padding: 8,
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  loadMoreBtn: {
    marginVertical: 8,
    alignSelf: 'center',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
});

export default ModalPicker;
