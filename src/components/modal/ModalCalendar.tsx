import React from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { border } from '../../utils/fontSize';
import { useColors } from '../../hooks/useColors';

export default function ModalCalendar({
  visible,
  value,
  selectedDate,
  onSelect,
  onClose,
}) {
  const colors = useColors();
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.box, { backgroundColor: colors.surface }]}>
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
              backgroundColor: colors.surface,
              calendarBackground: colors.surface,
              todayTextColor: colors.primary,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: colors.buttonText,
              dayTextColor: colors.text,
              monthTextColor: colors.text,
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: '90%',
    borderRadius: border.radiusMedium,
    padding: 10,
  },
  closeBtn: {
    padding: 10,
    alignItems: 'center',
  },
});
