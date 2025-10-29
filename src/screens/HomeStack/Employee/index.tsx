import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import CustomHeader from '../../../components/CustomHeader';
import icons from '../../../assets/icons';
import { usePaginatedList } from '../../../components/Paginated';
import { employee_GetAll } from '../../../services/hr';
import { lo } from '../../../language/Resource';
import { ms, spacing } from '../../../utils/spacing';
import { colors } from '../../../utils/color';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AppStyles from '../../../components/AppStyle';
import { navigate } from '../../../navigation/RootNavigator';
import { Screen_Name } from '../../../navigation/ScreenName';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import NavBar from '../../../components/Navbar';

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

const Employee = ({}) => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const flatListRef = useRef<FlatList>(null);
  const scrollY = useRef(0);

  // Sử dụng hook phân trang
  const {
    data: employee,
    loading,
    loadingMore,
    refreshing,
    noMoreData,
    handleLoadMore,
    handleRefresh,
  } = usePaginatedList(employee_GetAll, PAGE_SIZE, { orderBy: 'id desc' });
  const onEndReachedCalledDuringMomentum = useRef(false);
  console.log('employee data:', employee);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.tableRow}
      onPress={() => {
        navigate(Screen_Name.Details_Employee, { id: item?.id });
      }}
    >
      {/* STT */}
      <View
        style={[styles.checkboxCell, { minWidth: COLUMN_MIN_WIDTHS.checkbox }]}
      >
        <Text>{index + 1}</Text>
      </View>
      <Text style={{ borderLeftWidth: 0.5 }} />
      {/* Mã nhân viên */}
      <Text
        style={[styles.cell, { minWidth: COLUMN_MIN_WIDTHS.name, flex: 2 }]}
      >
        {item.employeeCode}
      </Text>
      <Text style={{ borderLeftWidth: 0.5 }} />
      {/* Tên nhân viên */}
      <Text
        style={[styles.cell, { minWidth: COLUMN_MIN_WIDTHS.work, flex: 1 }]}
      >
        {item.fullName}
      </Text>
      <Text style={{ borderLeftWidth: 0.5 }} />
      {/* Giới tính */}
      <Text
        style={[styles.cell, { minWidth: COLUMN_MIN_WIDTHS.time, flex: 1 }]}
      >
        {item.gender}
      </Text>
      <Text style={{ borderLeftWidth: 0.5 }} />
      {/* Số điện thoại */}
      <Text
        style={[styles.cell, { minWidth: COLUMN_MIN_WIDTHS.unit, flex: 1 }]}
      >
        {item.phoneNumber}
      </Text>
      <Text style={{ borderLeftWidth: 0.5 }} />
      {/* Email */}
      <Text
        style={[styles.cell, { minWidth: COLUMN_MIN_WIDTHS.object, flex: 1 }]}
      >
        {item.email}
      </Text>
      <Text style={{ borderLeftWidth: 0.5 }} />
      {/* Ngày sinh */}
      <Text
        style={[styles.cell, { minWidth: COLUMN_MIN_WIDTHS.location, flex: 1 }]}
      >
        {item.birthDate}
      </Text>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={{ padding: 16, alignItems: 'center' }}>
          <ActivityIndicator size="small" />
        </View>
      );
    }
    if (!loading && noMoreData && employee.length > 0) {
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
      {/* <CustomHeader
        label="Employee Application"
        Home={false}
        // leftIcon={icons.menu}
        // leftPress={() => navigation.goBack()}
      /> */}
      <CustomHeader
        label="Employee Application"
        leftIcon={icons.menu}
        leftPress={() => navigation.openDrawer()}
        // rightIcon={icons.document}
        // rightPress={() => {}}
      />
      {/* <NavBar title="Employee Application" /> */}
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
            {` Tổng số bản ghi: ${employee.length}`}
          </Text>
          {/* <Text style={styles.footerText}>{visibleCount}</Text> */}
        </View>
        <Text style={styles.footerText}>
          Đang hiển thị {employee.length} bản ghi
        </Text>
      </View>
      {/* Table */}
      <View style={{ flex: 1 }}>
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
                <View>
                  <Text>#</Text>
                </View>
              </View>
              <Text style={{ borderLeftWidth: 0.5 }} />
              <Text
                style={[
                  styles.headerCell,
                  { minWidth: COLUMN_MIN_WIDTHS.name, flex: 2 },
                ]}
                // numberOfLines={1}
              >
                Mã nhân viên
              </Text>
              <Text style={{ borderLeftWidth: 0.5 }} />

              <Text
                style={[
                  styles.headerCell,
                  { minWidth: COLUMN_MIN_WIDTHS.work, flex: 1 },
                ]}
                // numberOfLines={1}
              >
                Tên nhân viên
              </Text>
              <Text style={{ borderLeftWidth: 0.5 }} />
              <Text
                style={[
                  styles.headerCell,
                  { minWidth: COLUMN_MIN_WIDTHS.time, flex: 1 },
                ]}
                // numberOfLines={1}
              >
                Giới tính
              </Text>
              <Text style={{ borderLeftWidth: 0.5 }} />
              <Text
                style={[
                  styles.headerCell,
                  { minWidth: COLUMN_MIN_WIDTHS.unit, flex: 1 },
                ]}
                // numberOfLines={1}
              >
                Số điện thoại
              </Text>
              <Text style={{ borderLeftWidth: 0.5 }} />
              <Text
                style={[
                  styles.headerCell,
                  { minWidth: COLUMN_MIN_WIDTHS.object, flex: 1 },
                ]}
                // numberOfLines={1}
              >
                Email
              </Text>
              <Text style={{ borderLeftWidth: 0.5 }} />
              <Text
                style={[
                  styles.headerCell,
                  { minWidth: COLUMN_MIN_WIDTHS.location, flex: 1 },
                ]}
                // numberOfLines={1}
              >
                Ngày sinh
              </Text>
            </View>

            <FlatList
              ref={flatListRef}
              data={Array.isArray(employee) ? employee : []}
              keyExtractor={item =>
                item.id?.toString() ||
                item.employeeCode?.toString() ||
                Math.random().toString()
              }
              style={styles.bodyScroll}
              renderItem={renderItem}
              ListEmptyComponent={
                !loading && employee.length === 0 ? (
                  <Text
                    style={[AppStyles.label, { flex: 1, textAlign: 'center' }]}
                  >
                    Không có dữ liệu
                  </Text>
                ) : null
              }
              ListFooterComponent={renderFooter}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                />
              }
              onEndReached={() => {
                if (
                  !onEndReachedCalledDuringMomentum.current &&
                  !loadingMore &&
                  !noMoreData &&
                  !loading &&
                  employee.length > 0 // Đảm bảo có dữ liệu trước khi load more
                ) {
                  console.log('Load more triggered');
                  handleLoadMore();
                  onEndReachedCalledDuringMomentum.current = true;
                }
              }}
              onScroll={({ nativeEvent }) => {
                const currentScrollY = nativeEvent.contentOffset.y;
                // Reset flag khi scroll xuống (chỉ cho phép load more khi scroll xuống)
                if (currentScrollY > scrollY.current) {
                  onEndReachedCalledDuringMomentum.current = false;
                }
                scrollY.current = currentScrollY;
              }}
              onMomentumScrollBegin={() => {
                onEndReachedCalledDuringMomentum.current = false;
              }}
              onEndReachedThreshold={0.01} // Chỉ load khi rất gần cuối (1% cuối)
              showsVerticalScrollIndicator={false}
            />
          </View>
        </ScrollView>
      </View>

      {/* Footer */}

      {(loading || refreshing) && (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <ActivityIndicator size="large" color="#E53935" />
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
export default Employee;
