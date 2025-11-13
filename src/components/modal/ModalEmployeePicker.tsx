import React, { useState } from 'react';
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

interface Employee {
  id: string | number;
  employeeCode?: string;
  fullName?: string;
  employeeName?: string;
  departmentName?: string;
  positionName?: string;
}

interface ModalEmployeePickerProps {
  visible: boolean;
  data: Employee[];
  onSelect: (employee: Employee) => void;
  onClose: () => void;
  selectedId?: string | number;
  onSearch?: (keyword: string) => void;
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const ModalEmployeePicker: React.FC<ModalEmployeePickerProps> = ({
  visible,
  data,
  onSelect,
  onClose,
  selectedId,
  onSearch,
  loading = false,
  onLoadMore,
  hasMore = false,
}) => {
  const [searchText, setSearchText] = useState('');

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

  const renderEmployee = ({ item }: { item: Employee }) => {
    const isSelected = item.id === selectedId;
    const displayName = item.fullName || item.employeeName || 'N/A';
    const employeeCode = item.employeeCode || '';
    
    return (
      <TouchableOpacity
        style={[styles.employeeItem, isSelected && styles.selectedItem]}
        onPress={() => onSelect(item)}
      >
        <View style={styles.employeeInfo}>
          <Text style={[styles.employeeName, isSelected && styles.selectedText]}>
            {displayName}
          </Text>
          {employeeCode && (
            <Text style={styles.employeeCode}>Mã NV: {employeeCode}</Text>
          )}
          {item.departmentName && (
            <Text style={styles.employeeDetail}>
              Phòng ban: {item.departmentName}
            </Text>
          )}
          {item.positionName && (
            <Text style={styles.employeeDetail}>
              Chức vụ: {item.positionName}
            </Text>
          )}
        </View>
        {isSelected && (
          <Image source={icons.checkedRadio} style={AppStyles.icon} />
        )}
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loading) return null;
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
            keyExtractor={item => item.id.toString()}
            style={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {loading ? 'Đang tải...' : 'Không tìm thấy nhân viên'}
                </Text>
              </View>
            }
            onEndReached={() => {
              if (hasMore && !loading && onLoadMore) {
                onLoadMore();
              }
            }}
            onEndReachedThreshold={0.5}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.medium,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.Gray,
    marginBottom: spacing.small,
    backgroundColor: colors.white,
  },
  selectedItem: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  employeeInfo: {
    flex: 1,
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
