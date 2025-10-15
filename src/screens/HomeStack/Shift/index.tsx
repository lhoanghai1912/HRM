import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import CustomHeader from '../../../navigation/CustomHeader';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { ms, spacing } from '../../../utils/spacing';
import { navigate } from '../../../navigation/RootNavigator';
import { Screen_Name } from '../../../navigation/ScreenName';
import icons from '../../../assets/icons';
import { getAllShifts } from '../../../services/Shift';
import { formatDate } from '../../../utils/helper';
import { GetAllParams } from '../../../utils/form';
import { RefreshControl } from 'react-native-gesture-handler';
import AppStyles from '../../../components/AppStyle';
import { colors } from '../../../utils/color';
import Details_Shift from './Details';
import { useTranslation } from 'react-i18next';

const PAGE_SIZE = 15;
const COLUMN_MIN_WIDTHS = {
  checkbox: ms(40),
  name: ms(180),
  work: ms(160),
  time: ms(180),
  unit: ms(150),
  object: ms(150),
  location: ms(120),
};

const Shift = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [loading, setLoading] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [shiftData, setShiftData] = useState<any>([]);
  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const onEndReachedCalledDuringMomentum = useRef(false);
  const [page, setPage] = useState(1);
  const [orderBy, setOderBy] = useState<string | undefined>('createdAt desc');
  const [filter, setFilter] = useState<string | undefined>();
  const [search, setSearch] = useState<string>(''); // tránh undefined gây re-render không cần
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [allShift, setAllShift] = useState<any>([]);
  const flatListRef = useRef<FlatList>(null);
  const { t } = useTranslation();
  const fetchAllShift = useCallback(
    async (
      currentPage: number,
      currentSearch: string,
      isRefresh: boolean = false,
    ) => {
      if (loadingRef.current) return;
      loadingRef.current = true;

      if (isRefresh) {
        setIsLoading(true);
        setLoadingMore(false);
      } else {
        setLoadingMore(true);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      try {
        const params: GetAllParams = {
          Page: currentPage.toString(),
          PageSize: PAGE_SIZE.toString(),
          OrderBy: orderBy,
          Filter: filter,
          Search: currentSearch || undefined,
        };

        console.log('Fetch params:', params);
        const data = await getAllShifts(params);
        console.log('Fetched data:', data);
        setAllShift(data);
        console.log('allshift', allShift);

        if (data.result && Array.isArray(data.result)) {
          const hasMoreData = data.result.length >= PAGE_SIZE;
          setNoMoreData(!hasMoreData);
          console.log('nomoredata', !hasMoreData);

          setShiftData(prev => {
            if (isRefresh || currentPage === 1) {
              setNoMoreData(data.result.length < PAGE_SIZE);
              return data.result;
            }
            const ids = new Set(prev.map(j => j.id));
            const merged = data.result.filter(j => !ids.has(j.id));
            return [...prev, ...merged];
          });
        }
      } catch (e) {
        console.error('Fetch error:', e);
      } finally {
        loadingRef.current = false;
        console.log('shiftdata', shiftData);

        setIsLoading(false);
        setLoadingMore(false);
      }
    },
    [orderBy, filter], // loại isLoading / loadingMore để không re-create
  );

  useFocusEffect(
    useCallback(() => {
      setPage(1);
      setNoMoreData(false);
      fetchAllShift(1, search, true);
    }, [fetchAllShift]), // không phụ thuộc search để tránh spam
  );

  const handleLoadMore = () => {
    // if (page === 1) return;
    console.log('loadMore check:', {
      loading: loadingRef.current,
      loadingMore,
      noMoreData,
      isLoading,
      page,
      shiftDataLength: shiftData.length,
    });
    if (loadingRef.current || loadingMore || noMoreData || isLoading) return;
    console.log('avb');

    const next = page + 1;
    setPage(next);
    fetchAllShift(next, search, false);
  };
  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setSearch('');
    setNoMoreData(false);
    fetchAllShift(1, search, true).finally(() => setRefreshing(false));
  };

  const renderTable = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.tableRow}
        onPress={() => {
          navigate(Screen_Name.Details_Shift, { id: item?.id });
        }}
      >
        <View
          style={[styles.checkboxCell, { width: COLUMN_MIN_WIDTHS.checkbox }]}
        >
          <View style={styles.checkbox} />
        </View>
        <Text style={{ borderLeftWidth: 0.5 }} />
        <Text
          style={[styles.cell, { width: COLUMN_MIN_WIDTHS.name }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.name}
        </Text>
        <Text style={{ borderLeftWidth: 0.5 }} />
        <Text
          style={[styles.cell, { width: COLUMN_MIN_WIDTHS.work }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.shiftLines && item.shiftLines.length > 0
            ? item.shiftLines
                .map(line => line.shift?.shiftName)
                .filter(Boolean)
                .join('; ')
            : '-'}
        </Text>
        <Text style={{ borderLeftWidth: 0.5 }} />
        <Text
          style={[styles.cell, { width: COLUMN_MIN_WIDTHS.time }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {`${formatDate(item.fromDate)} - ${formatDate(item.toDate)}`}
        </Text>
        <Text style={{ borderLeftWidth: 0.5 }} />
        <Text
          style={[styles.cell, { width: COLUMN_MIN_WIDTHS.unit }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.shiftDetailOrgStructs && item.shiftDetailOrgStructs.length > 0
            ? item.shiftDetailOrgStructs
                .map(org => org.orgStruct?.orgStructName)
                .filter(Boolean)
                .join('; ')
            : '-'}
        </Text>
        <Text style={{ borderLeftWidth: 0.5 }} />
        <Text
          style={[styles.cell, { width: COLUMN_MIN_WIDTHS.object }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.shiftDetailEmployees && item.shiftDetailEmployees.length > 0
            ? item.shiftDetailEmployees
                .map(employees => employees.employee?.fullName)
                .filter(Boolean)
                .join('; ')
            : '-'}
        </Text>
        <Text style={{ borderLeftWidth: 0.5 }} />
        <Text
          style={[styles.cell, { width: COLUMN_MIN_WIDTHS.location }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.location || '-'}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View
          style={{
            backgroundColor: colors.background,
            borderTopWidth: 1,
            borderTopColor: '#ddd',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: spacing.small,
          }}
        >
          <Text>{t(`message.loadingMore`)}</Text>
          <ActivityIndicator size="small" color={colors.red} />
        </View>
      );
    }

    if (!isLoading && noMoreData && shiftData.length > 0) {
      return (
        <View
          style={{
            paddingVertical: spacing.small,
            paddingHorizontal: spacing.medium,
            backgroundColor: colors.background,
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 50,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: '#666',
              textAlign: 'center',
              fontStyle: 'italic',
            }}
          >
            {t(`message.empty`)}
          </Text>
        </View>
      );
    }

    return null;
  };
  return (
    <View style={styles.container}>
      <CustomHeader
        label="Shift"
        Home={false}
        rightIcon={icons.menu}
        rightPress={() => navigation.openDrawer()}
      />

      {/* Toolbar */}
      <View style={styles.toolbar}>
        <TextInput placeholder="Tìm kiếm" style={styles.searchInput} />
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Thêm</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.footerText}>
            {` Tổng số bản ghi: ${allShift.total}`}
          </Text>
          {/* <Text style={styles.footerText}>{visibleCount}</Text> */}
        </View>
        <Text style={styles.footerText}>
          Đang hiển thị {shiftData.length} bản ghi
        </Text>
      </View>
      {/* Table */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRowHeader}>
            <View
              style={[
                styles.checkboxCell,
                { minWidth: COLUMN_MIN_WIDTHS.checkbox },
              ]}
            >
              <View style={styles.checkbox} />
            </View>
            <Text style={{ borderLeftWidth: 0.5 }} />
            <Text
              style={[
                styles.headerCell,
                { minWidth: COLUMN_MIN_WIDTHS.name, flex: 2 },
              ]}
              // numberOfLines={1}
            >
              Tên bảng phân ca
            </Text>
            <Text style={{ borderLeftWidth: 0.5 }} />

            <Text
              style={[
                styles.headerCell,
                { minWidth: COLUMN_MIN_WIDTHS.work, flex: 1 },
              ]}
              // numberOfLines={1}
            >
              Ca làm việc
            </Text>
            <Text style={{ borderLeftWidth: 0.5 }} />
            <Text
              style={[
                styles.headerCell,
                { minWidth: COLUMN_MIN_WIDTHS.time, flex: 1 },
              ]}
              // numberOfLines={1}
            >
              Thời gian áp dụng
            </Text>
            <Text style={{ borderLeftWidth: 0.5 }} />
            <Text
              style={[
                styles.headerCell,
                { minWidth: COLUMN_MIN_WIDTHS.unit, flex: 1 },
              ]}
              // numberOfLines={1}
            >
              Đơn vị áp dụng
            </Text>
            <Text style={{ borderLeftWidth: 0.5 }} />
            <Text
              style={[
                styles.headerCell,
                { minWidth: COLUMN_MIN_WIDTHS.object, flex: 1 },
              ]}
              // numberOfLines={1}
            >
              Đối tượng áp dụng
            </Text>
            <Text style={{ borderLeftWidth: 0.5 }} />
            <Text
              style={[
                styles.headerCell,
                { minWidth: COLUMN_MIN_WIDTHS.location, flex: 1 },
              ]}
              // numberOfLines={1}
            >
              Địa điểm làm việc
            </Text>
          </View>

          <FlatList
            contentContainerStyle={
              {
                // marginBottom: spacing.medium,
                // paddingBottom: spacing.small, // Thêm bottom padding để footer không bị che
              }
            }
            ref={flatListRef}
            data={shiftData}
            keyExtractor={item => item.id}
            style={styles.bodyScroll}
            renderItem={renderTable}
            ListEmptyComponent={
              !isLoading && allShift.total === 0 ? (
                <Text
                  style={[AppStyles.label, { flex: 1, textAlign: 'center' }]}
                >
                  {/* {t(`message.job_empty`)} */}
                </Text>
              ) : null
            }
            ListFooterComponent={renderFooter}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            onEndReached={() => {
              if (!onEndReachedCalledDuringMomentum.current) {
                console.log('abc');

                handleLoadMore();
                onEndReachedCalledDuringMomentum.current = true;
              }
            }}
            onMomentumScrollBegin={() => {
              onEndReachedCalledDuringMomentum.current = false;
            }}
            onEndReachedThreshold={0.2}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>

      {/* Footer */}

      {loading && (
        <View
          style={{
            paddingVertical: 24,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ActivityIndicator />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
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
  table: {
    flex: 1,
    // maxHeight: ms(500),
    backgroundColor: colors.background,
  },
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    alignItems: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 8,
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
  },
  headerCell: {
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
    paddingVertical: 4,
    paddingHorizontal: spacing.small,
  },
  bodyScroll: {
    flex: 1,
    // maxHeight: ms(500),
  },
  footer: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    marginBottom: spacing.small,
  },
  footerText: { color: '#374151' },
  loadMoreBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
    borderRadius: 6,
  },
  loadMoreText: {
    color: '#f97316',
    fontWeight: 'bold',
  },
});

export default Shift;
