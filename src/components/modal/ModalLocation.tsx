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
import { fonts } from '../../utils/fontSize';
import { colors } from '../../utils/color';

const ModalLocation = ({
  visible,
  data = [],
  onSelect,
  onClose,
  title = 'Chọn địa điểm',
}) => {
  const [selectedLocation, setSelectedLocation] = React.useState(null);
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
            keyExtractor={item => item.locationId}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
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
                      backgroundColor:
                        selectedLocation === item.locationId
                          ? colors.primary
                          : colors.white,
                    },
                  ]}
                >
                  {item.locationName}
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', margin: spacing.medium }}>
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
    backgroundColor: colors.background,
    borderRadius: spacing.medium,
    padding: spacing.medium,
    elevation: 4,
  },
  title: {
    fontWeight: 'bold',
    fontSize: fonts.large,
    marginBottom: spacing.medium,
    textAlign: 'center',
  },
  item: {
    paddingVertical: spacing.medium,
    borderBottomWidth: 0.5,
    borderColor: colors.Gray,
    borderWidth: 0.5,
    borderRadius: spacing.medium,
    backgroundColor: colors.white,
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
