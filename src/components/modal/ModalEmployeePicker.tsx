import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../utils/color';
import { ms, spacing } from '../../utils/spacing';
import icons from '../../assets/icons';
import AppStyles from '../AppStyle';
import images from '../../assets/images';
import { fonts } from '../../utils/fontSize';

const ModalEmployeePicker = ({
  visible,
  data,
  onSelect,
  onClose,
  selectedId,
  onSearch,
  loading = false,
  loadingMore = false, // Thêm loadingMore prop
  onLoadMore,
  hasMore = false,
}) => {
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (!visible) setSearchText('');
  }, [visible]);

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchText);
    }
  };

  const handleClearSearch = () => {
    setSearchText('');
    if (onSearch) {
      onSearch('');
    }
  };

  const renderEmployee = ({ item }) => {
    const isSelected = item.EmployeeID === selectedId;
    return (
      <TouchableOpacity
        style={[isSelected && styles.selectedItem]}
        onPress={() => onSelect(item)}
      >
        <View style={styles.employeeItem}>
          <Image source={images.avt_default} style={AppStyles.avartar} />
          <View style={{ marginLeft: spacing.medium }}>
            <View style={styles.employeeInfo}>
              <Text>{item.fullName}</Text>
              <Text style={[AppStyles.text, { marginLeft: spacing.small }]}>
                ({item.employeeCode})
              </Text>
            </View>
            <Text>{item.jobPositionName}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null; // Chỉ hiện khi đang load more
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Chọn nhân viên</Text>
            <TouchableOpacity onPress={onClose}>
              <Image source={icons.clear} style={AppStyles.icon} />
            </TouchableOpacity>
          </View>

          <View style={styles.toolbar}>
            <TextInput
              placeholder="Tìm kiếm nhân viên..."
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {searchText ? (
              <TouchableOpacity onPress={handleClearSearch}>
                <Image
                  source={icons.clear}
                  style={[AppStyles.icon, { marginRight: spacing.small }]}
                />
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity onPress={handleSearch}>
              <Image source={icons.search} style={AppStyles.icon} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={data}
            renderItem={renderEmployee}
            keyExtractor={item => item.EmployeeID?.toString()}
            style={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {loading ? 'Đang tải...' : 'Không tìm thấy nhân viên'}
                </Text>
              </View>
            }
            onEndReached={() => {
              if (hasMore && !loading && !loadingMore && onLoadMore) {
                onLoadMore();
              }
            }}
            onEndReachedThreshold={0.3}
            ListFooterComponent={renderFooter}
          />
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
    padding: spacing.medium,
  },
  text: {
    fontSize: fonts.normal,
    color: colors.black,
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    width: '90%',
    minHeight: '50%',
    maxHeight: '75%',
    padding: spacing.medium,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.medium,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginBottom: spacing.small,
    borderColor: colors.Gray,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: spacing.small,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.small,
    fontSize: 14,
  },
  listContent: {
    flex: 1,
  },
  employeeItem: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: spacing.medium,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.Gray,
    marginBottom: spacing.small,
    backgroundColor: colors.white,
  },
  selectedItem: {
    // backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  employeeInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 4,
  },
  selectedText: {
    color: colors.white,
  },
  employeeCode: {
    fontSize: 13,
    color: colors.Gray,
    marginBottom: 2,
  },
  employeeDetail: {
    fontSize: 12,
    color: colors.Gray,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.large,
  },
  emptyText: {
    fontSize: 14,
    color: colors.Gray,
  },
  footerLoader: {
    paddingVertical: spacing.medium,
    alignItems: 'center',
  },
});

export default ModalEmployeePicker;
