import React from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { spacing } from '../../utils/spacing';
import { fonts, weight } from '../../utils/fontSize';
import { useColors } from '../../hooks/useColors';

const ModalLocation = ({
  visible,
  data = [],
  onSelect,
  onClose,
  title = 'Chọn địa điểm',
}) => {
  const colors = useColors();
  const [selectedLocation, setSelectedLocation] = React.useState(null);
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <FlatList
            data={data}
            keyExtractor={item => item.locationId}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.item,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                  },
                ]}
                onPress={() => {
                  setSelectedLocation(item.locationId);
                  const value = item.locationId;
                  const label = item.locationName;
                  onSelect({ value, label });
                  onClose();
                }}
              >
                <Text
                  style={[
                    styles.itemText,
                    {
                      color: colors.text,
                      backgroundColor:
                        selectedLocation === item.locationId
                          ? colors.primary
                          : undefined,
                    },
                  ]}
                >
                  {item.locationName}
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text
                style={{
                  textAlign: 'center',
                  margin: spacing.medium,
                  color: colors.textSecondary,
                }}
              >
                Không có dữ liệu
              </Text>
            }
          />
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={{ color: colors.text, fontWeight: weight.bold }}>
              Đóng
            </Text>
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
    borderRadius: spacing.medium,
    padding: spacing.medium,
    elevation: 4,
  },
  title: {
    fontWeight: weight.bold,
    fontSize: fonts.large,
    marginBottom: spacing.medium,
    textAlign: 'center',
  },
  item: {
    paddingVertical: spacing.medium,
    borderBottomWidth: 0.5,
    borderColor: '#e0e0e0',
    borderWidth: 0.5,
    borderRadius: spacing.medium,
    backgroundColor: '#fff',
  },
  itemText: {
    fontSize: spacing.medium,
    textAlign: 'center',
  },
  closeBtn: {
    marginTop: spacing.medium,
    alignItems: 'center',
  },
});

export default ModalLocation;
