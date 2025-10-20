import React, { use } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import AppButton from '../AppButton';
import { useTranslation } from 'react-i18next';
import AppStyles from '../AppStyle';
import { spacing } from '../../utils/spacing';
import { colors } from '../../utils/color';
import { TextInput } from 'react-native-gesture-handler';

import icons from '../../assets/icons';

const ModalSelectList = ({
  visible,
  title,
  data,
  keyExtractor,
  renderItem,
  onClose,
  refreshing,
  onRefresh,
  onEndReached,
  onSearch,
  selectedIds = [],
  onSelected,
}) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = React.useState('');

  // Hàm xử lý khi ấn nút search
  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  // Hàm xử lý khi xác nhận chọn
  const handleConfirm = () => {
    if (onSelected) {
      // Lấy các item đã chọn từ tất cả data (không chỉ trang hiện tại)
      // selectedIds là mảng id, data có thể là toàn bộ danh sách hoặc chỉ trang hiện tại
      // Để đúng nhất, nên truyền toàn bộ danh sách data vào ModalSelectList từ cha
      const selectedItems = data.filter(item =>
        selectedIds.includes(item[keyExtractor(item)]),
      );
      onSelected(selectedItems);
    }
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.toolbar}>
            <TextInput
              placeholder="Tìm kiếm"
              style={styles.searchInput}
              value={searchValue}
              onChangeText={setSearchValue}
            />
            <TouchableOpacity onPress={() => setSearchValue('')}>
              <Image
                source={icons.clear}
                style={[
                  AppStyles.icon,
                  {
                    display: searchValue ? 'flex' : 'none',
                    marginRight: spacing.small,
                  },
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSearch}>
              <Image source={icons.search} style={AppStyles.icon} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={data}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', marginTop: spacing.medium }}>
                Không có dữ liệu
              </Text>
            }
            refreshing={refreshing}
            onRefresh={onRefresh}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.2}
            style={styles.flatList}
            contentContainerStyle={{ paddingBottom: spacing.medium }}
          />
          <View style={styles.buttonContainer}>
            <AppButton title={t('button.cancel')} onPress={onClose} />
            <AppButton title={t('button.confirm')} onPress={handleConfirm} />
          </View>
        </View>
      </View>
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
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    marginBottom: spacing.small,
    borderColor: colors.Gray,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: spacing.small,
  },
  addButton: {
    marginLeft: 16,
    backgroundColor: '#f97316',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  searchInput: {
    flex: 1,
    // paddingHorizontal: spacing.medium,
    borderRadius: 6,
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: spacing.medium,
    borderRadius: 10,
    maxHeight: '80%',
    width: '80%',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: spacing.medium,
    textAlign: 'center',
  },

  flatList: {
    flexGrow: 0,
    borderWidth: 1,
    borderColor: colors.Gray,
    borderRadius: 8,
    backgroundColor: colors.white,
    padding: spacing.small,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.medium,
    gap: spacing.small,
  },
});

export default ModalSelectList;
