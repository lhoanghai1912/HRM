import React from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { colors } from '../../utils/color';
import { border } from '../../utils/fontSize';

export default function ModalCalendar({
  visible,
  value,
  selectedDate,
  onSelect,
  onClose,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Calendar
            initialDate={value} // yyyy-MM-dd
            onDayPress={day => {
              onSelect(day.dateString);
              onClose();
            }}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: colors.primary,
              },
            }}
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              todayTextColor: colors.primary,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: '#ffffff',
            }}
          />

          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={{ color: colors.primary }}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: border.radiusMedium,
    padding: 10,
  },
  closeBtn: {
    padding: 10,
    alignItems: 'center',
  },
});
