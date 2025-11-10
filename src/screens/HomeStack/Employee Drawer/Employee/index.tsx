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
  const [searchInput, setSearchInput] = useState(''); // Input tạm thời
  const [searchQuery, setSearchQuery] = useState(''); // Query thực tế để gọi API

  // Sử dụng hook phân trang
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
    fieldColumns:
      'EmployeeCode,FullName,genderID,maritalStatusID,personalTaxCode,birthDay,mobile,homeLand,ethnicID,religionID,nationalityID,identifyNumber,officeEmail,,currentProvinceID,currentWardID',
  });
  const onEndReachedCalledDuringMomentum = useRef(false);

  console.log('Employee data:', employee);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      key={item.EmployeeID}
      style={styles.tableRow}
      onPress={() => {
        navigate(Screen_Name.Details_Employee, { id: item.EmployeeID });
      }}
    >
      {/* STT */}
      <View
        style={[styles.checkboxCell, { width: COLUMN_MIN_WIDTHS.checkbox }]}
      >
        <Text>{index + 1}</Text>
      </View>
      <Text style={{ borderLeftWidth: 0.5 }} />
      {/* Mã nhân viên */}
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[styles.cell, { width: COLUMN_MIN_WIDTHS.name, flex: 2 }]}
      >
        {item.employeeCode}
      </Text>
      <Text style={{ borderLeftWidth: 0.5 }} />
      {/* Tên nhân viên */}
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[styles.cell, { width: COLUMN_MIN_WIDTHS.work, flex: 1 }]}
      >
        {item.fullName}
      </Text>
      <Text style={{ borderLeftWidth: 0.5 }} />
      {/* Giới tính */}
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[styles.cell, { width: COLUMN_MIN_WIDTHS.time, flex: 1 }]}
      >
        {item.gender}
      </Text>
      <Text style={{ borderLeftWidth: 0.5 }} />
      {/* Số điện thoại */}
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[styles.cell, { width: COLUMN_MIN_WIDTHS.unit, flex: 1 }]}
      >
        {item.phoneNumber}
      </Text>
      <Text style={{ borderLeftWidth: 0.5 }} />
      {/* Email */}
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[styles.cell, { width: COLUMN_MIN_WIDTHS.object, flex: 1 }]}
      >
        {item.email}
      </Text>
      <Text style={{ borderLeftWidth: 0.5 }} />
      {/* Ngày sinh */}
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[styles.cell, { width: COLUMN_MIN_WIDTHS.location, flex: 1 }]}
      >
        {item.birthDate}
      </Text>
    </TouchableOpacity>
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

export default Employee;
