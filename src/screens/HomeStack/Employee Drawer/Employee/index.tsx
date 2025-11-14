import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { ScrollView, TextInput } from 'react-native-gesture-handler';

import CustomHeader from '../../../../components/CustomHeader';
import icons from '../../../../assets/icons';
import { usePaginatedList } from '../../../../components/Paginated';
import { employee_GetAll } from '../../../../services/hr';
import { getLayout } from '../../../../services/data';
import { mapFieldType } from '../../../../utils/formField';
import { ms, spacing } from '../../../../utils/spacing';
import AppStyles from '../../../../components/AppStyle';
import { navigate } from '../../../../navigation/RootNavigator';
import { Screen_Name } from '../../../../navigation/ScreenName';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import styles from '../styles';

const PAGE_SIZE = 15;

function Employee() {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const flatListRef = useRef<FlatList>(null);
  const scrollY = useRef(0);

  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutConfig, setLayoutConfig] = useState<any[]>([]);

  // Lấy layout
  useEffect(() => {
    const fetchLayout = async () => {
      try {
        const layoutRes = await getLayout('profile');
        const layout = layoutRes?.pageData || layoutRes;
        setLayoutConfig(layout || []);
      } catch (e) {
        setLayoutConfig([]);
      }
    };
    fetchLayout();
  }, []);

  // Build fieldColumns từ layout (dùng cho API)
  const fieldNames = useMemo(() => {
    const fields: string[] = [];
    layoutConfig.forEach(group => {
      (group.groupFieldConfigs || []).forEach((field: any) => {
        if (field.fieldName) fields.push(field.fieldName);
        if (field.displayField && field.displayField !== field.fieldName) {
          fields.push(field.displayField);
        }
      });
    });
    return [...new Set(fields)].join(',');
  }, [layoutConfig]);

  // Hook phân trang
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

  // Các field hiển thị trong bảng
  const visibleFields = useMemo(() => {
    const fields: any[] = [];
    layoutConfig.forEach(group => {
      (group.groupFieldConfigs || []).forEach((field: any) => {
        if (field.isShow !== false) {
          fields.push(field);
        }
      });
    });
    return fields;
  }, [layoutConfig]);

  // Format value theo kiểu field
  const formatValue = (field: any, value: any) => {
    // Nếu sau này cần theo typeControl thì có thể dùng field.typeControl ở đây
    return mapFieldType(value);
  };

  // Header của bảng
  const renderHeader = () => (
    <View style={styles.tableRowHeader}>
      <View style={[styles.checkboxCell, { minWidth: ms(40) }]}>
        <Text>#</Text>
      </View>
      {visibleFields.map((field: any, idx: number) => (
        <View
          key={field.fieldName || idx}
          style={[
            styles.headerCell,
            {
              minWidth: ms(120),
              flex: 1,
              borderLeftWidth: idx === 0 ? 0 : 0.5,
            },
          ]}
        >
          <Text>{field.label || field.fieldName}</Text>
        </View>
      ))}
      <View style={{ minWidth: ms(80), alignItems: 'center' }}>
        <Text>Chi tiết</Text>
      </View>
    </View>
  );

  // Render từng dòng
  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <View key={item.EmployeeID} style={styles.tableRow}>
      <View style={[styles.checkboxCell, { width: ms(40) }]}>
        <Text>{index + 1}</Text>
      </View>
      {visibleFields.map((field: any, idx: number) => (
        <View
          key={field.fieldName || idx}
          style={[
            styles.cell,
            {
              minWidth: ms(120),
              flex: 1,
              borderLeftWidth: idx === 0 ? 0 : 0.5,
            },
          ]}
        >
          <Text numberOfLines={1} ellipsizeMode="tail">
            {formatValue(field, item[field.fieldName])}
          </Text>
        </View>
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

  // Footer phân trang
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

      {/* Thanh tìm kiếm */}
      <View style={styles.toolbar}>
        <TextInput
          placeholder="Tìm kiếm"
          value={searchInput}
          style={styles.searchInput}
          onChangeText={setSearchInput}
          returnKeyType="search"
          onSubmitEditing={() => setSearchQuery(searchInput)}
        />
        <TouchableOpacity onPress={() => setSearchQuery(searchInput)}>
          <Image source={icons.search} style={AppStyles.icon} />
        </TouchableOpacity>
      </View>

      {/* Footer thông tin số bản ghi */}
      <View style={styles.footer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={AppStyles.text}>
            Đang hiển thị {employee.length} bản ghi
          </Text>
          <Text style={AppStyles.text} />
        </View>
      </View>

      {/* Bảng dữ liệu */}
      <View style={{ flex: 1 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.table}>
            {renderHeader()}
            <FlatList
              ref={flatListRef}
              data={employee}
              keyExtractor={(item: any) => String(item.EmployeeID)}
              style={styles.bodyScroll}
              renderItem={renderItem}
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
                  employee.length > 0
                ) {
                  handleLoadMore();
                  onEndReachedCalledDuringMomentum.current = true;
                }
              }}
              onScroll={({ nativeEvent }) => {
                const currentScrollY = nativeEvent.contentOffset.y;
                if (currentScrollY > scrollY.current) {
                  onEndReachedCalledDuringMomentum.current = false;
                }
                scrollY.current = currentScrollY;
              }}
              onMomentumScrollBegin={() => {
                onEndReachedCalledDuringMomentum.current = false;
              }}
              onEndReachedThreshold={0.0001}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </ScrollView>
      </View>

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
}

export default Employee;
