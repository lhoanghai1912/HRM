import React from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const ModalLocation = ({
  visible,
  data = [],
  onSelect,
  onClose,
  title = 'Chọn địa điểm',
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <FlatList
            data={data}
            keyExtractor={item => item.id?.toString() || item.code?.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  onSelect && onSelect(item);
                  onClose && onClose();
                }}
              >
                <Text style={styles.itemText}>
                  {item.name || item.label || item.pickListValue}
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', margin: 16 }}>
                Không có dữ liệu
              </Text>
            }
          />
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={{ color: '#1890ff', fontWeight: 'bold' }}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 4,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },
  itemText: {
    fontSize: 16,
  },
  closeBtn: {
    marginTop: 12,
    alignItems: 'center',
  },
});

export default ModalLocation;
