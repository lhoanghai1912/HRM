import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import CustomHeader from '../../../../components/CustomHeader';
import icons from '../../../../assets/icons';
import { usePaginatedList } from '../../../../components/Paginated';
import { employee_GetAll } from '../../../../services/hr';
import { getLayout } from '../../../../services/data';
import { mapFieldType } from '../../../../utils/formField';
import { ms, spacing } from '../../../../utils/spacing';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AppStyles from '../../../../components/AppStyle';
import { navigate } from '../../../../navigation/RootNavigator';
import { Screen_Name } from '../../../../navigation/ScreenName';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import styles from '../styles';

// checkbox: ms(40),
// id: ms(120),
// start: ms(120),
// name: ms(180),
// position: ms(120),
// struct: ms(150),
// type: ms(120),

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
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutConfig, setLayoutConfig] = useState<any[]>([]);

  // Lấy layout động khi mount
  React.useEffect(() => {
    const fetchLayout = async () => {
      try {
        const layoutRes = await getLayout('profile');
        const layout = layoutRes?.pageData || layoutRes;
        setLayoutConfig(layout);
      } catch (e) {
        setLayoutConfig([]);
      }
    };
    fetchLayout();
  }, []);

  // Build fieldColumns từ layout
  const fieldNames = React.useMemo(() => {
    const fields: string[] = [];
    layoutConfig.forEach(group => {
      (group.groupFieldConfigs || []).forEach(field => {
        if (field.fieldName) fields.push(field.fieldName);
        if (field.displayField && field.displayField !== field.fieldName)
          fields.push(field.displayField);
      });
    });
    return [...new Set(fields)].join(',');
  }, [layoutConfig]);

  // Sử dụng hook phân trang với fieldColumns động
  const {
    data: employee,
    loading,
    loadingMore,
    refreshing,
    noMoreData,
    handleLoadMore,
    handleRefresh,
  } = usePaginatedList(employee_GetAll, PAGE_SIZE, {
    orderBy: 'employeeId',
    sortOrder: ' desc',
    search: searchQuery,
    fieldColumns: fieldNames,
  });
  const onEndReachedCalledDuringMomentum = useRef(false);

  // Lấy các field hiển thị (isVisible)
  const visibleFields = React.useMemo(() => {
    return layoutConfig
      .flatMap(group => group.groupFieldConfigs || [])
      .filter(field => field.isVisible !== false)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [layoutConfig]);

  // Format value theo typeControl
  const formatValue = (fieldConfig, value, item) => {
    if (value === null || value === undefined || value === '') return '-';
    const fieldType = mapFieldType(fieldConfig.typeControl);
    switch (fieldType) {
      case 'date':
      case 'month': {
        if (typeof value === 'string') {
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
          }
        }
        return value;
      }
      case 'int':
      case 'decimal': {
        const num = parseFloat(value);
        if (!isNaN(num)) return num.toLocaleString('vi-VN');
        return value;
      }
      case 'currency': {
        const amount = parseFloat(value);
        if (!isNaN(amount)) return amount.toLocaleString('vi-VN') + ' VNĐ';
        return value;
      }
      case 'percent': {
        const percent = parseFloat(value);
        if (!isNaN(percent)) return percent + '%';
        return value;
      }
      case 'selectOne':
      case 'selectMulti':
      case 'organization':
      case 'employee': {
        if (fieldConfig.displayField && item[fieldConfig.displayField])
          return item[fieldConfig.displayField];
        return value;
      }
      case 'checkbox':
        return value ? 'Có' : 'Không';
      default:
        return value?.toString() || '-';
    }
  };

  // Render header động
  const renderHeader = () => (
    <View style={styles.tableRowHeader}>
      <View style={[styles.checkboxCell, { minWidth: ms(40) }]}>
        {' '}
        <Text>#</Text>{' '}
      </View>
      {visibleFields.map(field => (
        <Text
          key={field.fieldName}
          style={[styles.headerCell, { minWidth: ms(120), flex: 1 }]}
        >
          {field.label || field.fieldName}
        </Text>
      ))}
      <Text style={{ minWidth: ms(80), textAlign: 'center' }}>Chi tiết</Text>
    </View>
  );

  // Render item động
  const renderItem = ({ item, index }) => (
    <View key={item.EmployeeID} style={styles.tableRow}>
      <View style={[styles.checkboxCell, { width: ms(40) }]}>
        {' '}
        <Text>{index + 1}</Text>{' '}
      </View>
      {visibleFields.map(field => (
        <Text
          key={field.fieldName}
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[styles.cell, { minWidth: ms(120), flex: 1 }]}
        >
          {formatValue(field, item[field.fieldName], item)}
        </Text>
      ))}
      <TouchableOpacity
        style={{
          marginLeft: 8,
          padding: 6,
          backgroundColor: '#1976D2',
          borderRadius: 6,
        }}
        onPress={() =>
          navigate(Screen_Name.Details_Employee, { id: item.EmployeeID })
        }
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Chi tiết</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View
          style={{
            paddingTop: spacing.medium,
            paddingBottom: spacing.small,
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="small" />
        </View>
      );
    }
    if (!loading && noMoreData && employee.length > 0) {
      return (
        <View
          style={{
            paddingTop: spacing.medium,
            paddingBottom: spacing.small,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#888' }}>Đã hết dữ liệu</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        label="Employee Application"
        leftIcon={icons.menu}
        leftPress={() => navigation.openDrawer()}
      />

      <View style={styles.toolbar}>
        <TextInput
          placeholder="Tìm kiếm"
          value={searchInput}
          style={styles.searchInput}
          onChangeText={setSearchInput}
        />
        <TouchableOpacity onPress={() => setSearchQuery(searchInput)}>
          <Image source={icons.search} style={AppStyles.icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={AppStyles.text}>
            Đang hiển thị {employee.length} bản ghi
          </Text>
          <Text style={AppStyles.text}></Text>
          {/* <Text style={AppStyles.text}>{visibleCount}</Text> */}
        </View>
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
                  {
                    minWidth: COLUMN_MIN_WIDTHS.name,
                    flex: 2,
                  },
                ]}
              >
                Mã nhân viên
              </Text>
              <Text style={{ borderLeftWidth: 0.5 }} />

              <Text
                style={[
                  styles.headerCell,
                  { minWidth: COLUMN_MIN_WIDTHS.work, flex: 1 },
                ]}
              >
                Tên nhân viên
              </Text>
              <Text style={{ borderLeftWidth: 0.5 }} />
              <Text
                style={[
                  styles.headerCell,
                  { minWidth: COLUMN_MIN_WIDTHS.time, flex: 1 },
                ]}
              >
                Giới tính
              </Text>
              <Text style={{ borderLeftWidth: 0.5 }} />
              <Text
                style={[
                  styles.headerCell,
                  { minWidth: COLUMN_MIN_WIDTHS.unit, flex: 1 },
                ]}
              >
                Số điện thoại
              </Text>
              <Text style={{ borderLeftWidth: 0.5 }} />
              <Text
                style={[
                  styles.headerCell,
                  { minWidth: COLUMN_MIN_WIDTHS.object, flex: 1 },
                ]}
              >
                Email
              </Text>
              <Text style={{ borderLeftWidth: 0.5 }} />
              <Text
                style={[
                  styles.headerCell,
                  { minWidth: COLUMN_MIN_WIDTHS.location, flex: 1 },
                ]}
              >
                Ngày sinh
              </Text>
            </View>

            <FlatList
              ref={flatListRef}
              data={employee}
              keyExtractor={item => item.EmployeeID}
              style={styles.bodyScroll}
              renderItem={renderItem}
              refreshing={loading}
              ListEmptyComponent={
                !loading && employee.length === 0 ? (
                  <Text
                    style={[
                      AppStyles.label,
                      {
                        flex: 1,
                        textAlign: 'center',
                        marginTop: spacing.medium,
                      },
                    ]}
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
              onEndReachedThreshold={0.0001} // Chỉ load khi rất gần cuối (1% cuối)
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

export default Employee;
