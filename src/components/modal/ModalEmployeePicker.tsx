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
import { ms, spacing } from '../../utils/spacing';
import icons from '../../assets/icons';
import AppStyles from '../AppStyle';
import images from '../../assets/images';
import { border, fonts, weight } from '../../utils/fontSize';
import { useColors } from '../../hooks/useColors';

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
  const colors = useColors();
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
        style={[
          isSelected && [styles.selectedItem, { borderColor: colors.primary }],
        ]}
        onPress={() => {
          console.log('Selected employee:', item);
          onSelect(item);
        }}
      >
        <View
          style={[
            styles.employeeItem,
            { borderColor: colors.border, backgroundColor: colors.surface },
          ]}
        >
          <Image source={images.avt_default} style={AppStyles.avartar} />
          <View style={{ marginLeft: spacing.medium }}>
            <View style={styles.employeeInfo}>
              <Text style={{ color: colors.text }}>{item.fullName}</Text>
              <Text
                style={[
                  AppStyles.text,
                  { marginLeft: spacing.small, color: colors.textSecondary },
                ]}
              >
                ({item.employeeCode})
              </Text>
            </View>
            <Text style={{ color: colors.textSecondary }}>
              {item.jobPositionName}
            </Text>
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
        <View
          style={[
            styles.container,
            { backgroundColor: colors.surface, shadowColor: colors.black },
          ]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              Chọn nhân viên
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Image
                source={icons.clear}
                style={[AppStyles.icon, { tintColor: colors.text }]}
              />
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.toolbar,
              { borderColor: colors.border, backgroundColor: colors.surface },
            ]}
          >
            <TextInput
              placeholder="Tìm kiếm nhân viên..."
              style={[styles.searchInput, { color: colors.text }]}
              placeholderTextColor={colors.textSecondary}
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {searchText ? (
              <TouchableOpacity onPress={handleClearSearch}>
                <Image
                  source={icons.clear}
                  style={[
                    AppStyles.icon,
                    { marginRight: spacing.small, tintColor: colors.text },
                  ]}
                />
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity onPress={handleSearch}>
              <Image
                source={icons.search}
                style={[AppStyles.icon, { tintColor: colors.text }]}
              />
            </TouchableOpacity>
          </View>

          <FlatList
            data={data}
            renderItem={renderEmployee}
            keyExtractor={(item, index) =>
              item.EmployeeID?.toString() || index.toString()
            }
            style={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text
                  style={[styles.emptyText, { color: colors.textSecondary }]}
                >
                  {loading ? 'Đang tải...' : 'Không tìm thấy nhân viên'}
                </Text>
              </View>
            }
            refreshing={loading}
            onRefresh={() => {
              if (onSearch) {
                onSearch(searchText);
              }
            }}
            onEndReached={() => {
              console.log('onEndReached triggered', {
                hasMore,
                loading,
                loadingMore,
              });
              if (hasMore && !loading && !loadingMore && onLoadMore) {
                console.log('Calling onLoadMore');
                onLoadMore();
              }
            }}
            onEndReachedThreshold={0.1}
            ListFooterComponent={renderFooter}
            removeClippedSubviews={false}
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
  },
  container: {
    borderRadius: border.radiusLarge,
    width: '90%',
    minHeight: '50%',
    maxHeight: '75%',
    padding: spacing.medium,
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
    fontWeight: weight.bold,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.small,
    borderWidth: 1,
    borderRadius: border.radiusMedium,
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
    alignItems: 'flex-start',
    padding: spacing.medium,
    borderRadius: border.radiusMedium,
    borderWidth: 1,
    marginBottom: spacing.small,
  },
  selectedItem: {},
  employeeInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  selectedText: {},
  employeeCode: {
    fontSize: 13,
    marginBottom: 2,
  },
  employeeDetail: {
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.large,
  },
  emptyText: {
    fontSize: 14,
  },
  footerLoader: {
    paddingVertical: spacing.medium,
    alignItems: 'center',
  },
});

export default ModalEmployeePicker;
