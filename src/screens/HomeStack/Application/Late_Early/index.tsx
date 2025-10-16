import React, { useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import CustomHeader from '../../../../navigation/CustomHeader';
import icons from '../../../../assets/icons';
import { usePaginatedList } from '../../../../components/Paginated';
import {
  FlatList,
  RefreshControl,
  TextInput,
} from 'react-native-gesture-handler';
import { getEarly_LateApplications } from '../../../../services/application';
import { ms, spacing } from '../../../../utils/spacing';
import { colors } from '../../../../utils/color';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { navigate } from '../../../../navigation/RootNavigator';
import { Screen_Name } from '../../../../navigation/ScreenName';

const PAGE_SIZE = 15;

const COLUMN_MIN_WIDTHS = {
  checkBox: ms(40),
  id: ms(100),
  fullName: ms(120),
  start: ms(150),
  end: ms(150),
};
const Late_Early = ({ navigation }) => {
  const userData = useSelector((state: any) => state.user.userData);
  const flatListRef = useRef<FlatList>(null);
  const [filter, setFilter] = useState(`employeeId=${userData?.employee?.id}`);
  const [orderBy, setOrderBy] = useState('createdAt desc');

  // DÙNG useMemo để params ổn định
  const params = useMemo(
    () => ({
      Filter: filter,
      OrderBy: orderBy,
    }),
    [filter, orderBy],
  );

  const {
    data: late_earlyData,
    loading,
    loadingMore,
    refreshing,
    noMoreData,
    handleLoadMore,
    handleRefresh,
  } = usePaginatedList(getEarly_LateApplications, PAGE_SIZE, params);

  console.log('late_earlyData:', late_earlyData);

  const renderTable = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.tableRow}
        onPress={() => {
          navigate(Screen_Name.Detail_Late_Early, {
            id: item?.id,
            mode: 'edit',
          });
        }}
      >
        <View
          style={[styles.checkboxCell, { width: COLUMN_MIN_WIDTHS.checkBox }]}
        >
          <View style={styles.checkbox} />
        </View>
        <Text style={{ borderLeftWidth: 0.5 }} />
        <Text
          style={[styles.cell, { width: COLUMN_MIN_WIDTHS.id }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item?.employee?.employeeCode || ' - '}
        </Text>
        <Text style={{ borderLeftWidth: 0.5 }} />
        <Text
          style={[styles.cell, { width: COLUMN_MIN_WIDTHS.fullName }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item?.employee?.fullName || ' - '}
        </Text>
        <Text style={{ borderLeftWidth: 0.5 }} />
        <Text
          style={[styles.cell, { width: COLUMN_MIN_WIDTHS.start }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {moment(item?.fromDate).format('DD/MM/YYYY') || ' - '}
        </Text>
        <Text style={{ borderLeftWidth: 0.5 }} />
        <Text
          style={[styles.cell, { width: COLUMN_MIN_WIDTHS.end }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {moment(item?.toDate).format('DD/MM/YYYY') || ' - '}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={{ padding: 16, alignItems: 'center' }}>
          <ActivityIndicator size="small" />
        </View>
      );
    }
    if (!loading && noMoreData && late_earlyData.length > 0) {
      return (
        <View style={{ padding: 16, alignItems: 'center' }}>
          <Text style={{ color: '#888' }}>Đã hết dữ liệu</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        label="Application"
        Home={false}
        rightIcon={icons.back}
        rightPress={() => {
          navigation.goBack();
        }}
      />
      {/* <Text>Late & Early Application</Text> */}
      <View style={styles.toolbar}>
        <TextInput placeholder="Tìm kiếm" style={styles.searchInput} />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            navigate(Screen_Name.Detail_Late_Early, { mode: 'create' });
          }}
        >
          <Text style={styles.addButtonText}>+ Thêm</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          <View style={styles.tableRowHeader}>
            <View
              style={[
                styles.checkboxCell,
                { minWidth: COLUMN_MIN_WIDTHS.checkBox },
              ]}
            >
              <View style={styles.checkbox} />
            </View>
            <Text style={{ borderLeftWidth: 0.5 }} />
            <Text
              style={[styles.headerCell, { minWidth: COLUMN_MIN_WIDTHS.id }]}
              // numberOfLines={1}
            >
              Mã nhân viên
            </Text>
            <Text style={{ borderLeftWidth: 0.5 }} />

            <Text
              style={[
                styles.headerCell,
                { minWidth: COLUMN_MIN_WIDTHS.fullName },
              ]}
              // numberOfLines={1}
            >
              Tên nhân viên
            </Text>
            <Text style={{ borderLeftWidth: 0.5 }} />
            <Text
              style={[styles.headerCell, { minWidth: COLUMN_MIN_WIDTHS.start }]}
              // numberOfLines={1}
            >
              Thời gian bắt đầu
            </Text>
            <Text style={{ borderLeftWidth: 0.5 }} />
            <Text
              style={[styles.headerCell, { minWidth: COLUMN_MIN_WIDTHS.end }]}
              // numberOfLines={1}
            >
              Ngày kết thúc
            </Text>
          </View>
          <FlatList
            ref={flatListRef}
            data={late_earlyData}
            keyExtractor={item => item.id?.toString()}
            renderItem={renderTable}
            ListFooterComponent={renderFooter}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.2}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  table: {
    flex: 1,
    backgroundColor: colors.background,
    marginBottom: spacing.medium,
  },
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: colors.Gray,
    paddingVertical: spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    alignItems: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    alignItems: 'center',
  },
  checkboxCell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#9ca3af',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  cell: {
    color: '#222',
    paddingHorizontal: spacing.small,
    textAlign: 'center',
    paddingVertical: 4,
    minWidth: ms(100),
  },
  loadMoreText: {
    color: '#f97316',
    fontWeight: 'bold',
  },
  headerCell: {
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
    paddingVertical: 4,
    paddingHorizontal: spacing.small,
    minWidth: ms(100),
  },
  bodyScroll: { flex: 1 },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
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
    height: 40,
    paddingHorizontal: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
});

export default Late_Early;
