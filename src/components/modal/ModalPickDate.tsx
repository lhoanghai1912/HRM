import React from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { border, weight } from '../../utils/fontSize';
import { colors } from '../../utils/color';

const ModalPickDate = ({
  visible,
  value,
  onChange,
  onClose,
  color = '#2563eb',
}) => {
  // Ensure value is a valid Date object
  const dateValue =
    value instanceof Date && !isNaN(value.getTime()) ? value : new Date();
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* <Text style={[styles.title, { color }]}>{title}</Text> */}
          <DateTimePicker
            value={dateValue}
            display="default"
            onChange={onChange}
          />
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={{ color }}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: border.radiusMedium,
    alignItems: 'center',
    minWidth: 280,
  },
  title: {
    fontWeight: weight.bold,
    fontSize: 16,
    marginBottom: 12,
  },
  closeBtn: {
    marginTop: 16,
    padding: 8,
  },
});

export default ModalPickDate;
