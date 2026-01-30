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

const ModalProcedurePicker = ({
  visible,
  data,
  onSelect,
  onClose,
  selectedId,
  onSearch,
  loading = false,
  loadingMore = false,
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

  const handleSelected = item => {
    const value = item.id;
    const label = item.name;
    onSelect({ value, label });
    onClose();
  };

  const handleClearSearch = () => {
    setSearchText('');
    if (onSearch) {
      onSearch('');
    }
  };

  const renderProcedure = ({ item }) => {
    const isSelected = item.id === selectedId;
    return (
      <TouchableOpacity
        style={[styles.row, isSelected && styles.selectedItem]}
        onPress={() => {
          handleSelected(item);
        }}
      >
        <Text style={[styles.rowText, isSelected && styles.selectedText]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
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
            <Text style={styles.title}>Chọn thủ tục</Text>
            <TouchableOpacity onPress={onClose}>
              <Image
                source={icons.clear}
                style={[AppStyles.icon, { tintColor: colors.text }]}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.toolbar}>
            <TextInput
              placeholder="Tìm kiếm thủ tục..."
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
            renderItem={renderProcedure}
            keyExtractor={item => item.id}
            style={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {loading ? 'Đang tải...' : 'Không tìm thấy thủ tục'}
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
              if (hasMore && !loading && !loadingMore && onLoadMore) {
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
    color: '#000000',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: border.radiusLarge,
    width: '90%',
    minHeight: '50%',
    maxHeight: '75%',
    padding: spacing.medium,
    shadowColor: '#000000',
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
    color: '#000000',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: spacing.small,
    borderColor: '#E5E7EB',
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
  procedureItem: {
    padding: spacing.small,
    borderRadius: border.radiusMedium,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: spacing.small,
    backgroundColor: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.medium,
    marginVertical: spacing.small,
    borderRadius: border.radiusMedium,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 44, // Đảm bảo chiều cao tối thiểu cho dễ touch
  },
  rowText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    textAlign: 'left',
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  selectedItem: {
    borderColor: '#007AFF',
  },
  procedureInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.large,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
  },
  footerLoader: {
    paddingVertical: spacing.medium,
    alignItems: 'center',
  },
});

export default ModalProcedurePicker;
