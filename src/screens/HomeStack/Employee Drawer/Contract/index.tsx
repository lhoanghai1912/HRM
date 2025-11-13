import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import CustomHeader from '../../../../components/CustomHeader';
import icons from '../../../../assets/icons';
import { Screen_Name } from '../../../../navigation/ScreenName';
import { ms, spacing } from '../../../../utils/spacing';
import { usePaginatedList } from '../../../../components/Paginated';
import { navigate } from '../../../../navigation/RootNavigator';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import styles from '../styles';
import AppStyles from '../../../../components/AppStyle';
import { contract_GetAll } from '../../../../services/hr';
import { colors } from '../../../../utils/color';

const PAGE_SIZE = 15;
const COLUMN_MIN_WIDTHS = {
  checkbox: ms(40),
  id: ms(120),
  start: ms(120),
  name: ms(180),
  position: ms(120),
  struct: ms(150),
  type: ms(120),
};

const Contract = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const flatListRef = useRef<FlatList>(null);
  const scrollY = useRef(0);
  const [searchInput, setSearchInput] = useState(''); // Input tạm thời
  const [searchQuery, setSearchQuery] = useState(''); // Query thực tế để gọi API

  // Sử dụng hook phân trang
  const {
    data: contract,
    loading,
    loadingMore,
    refreshing,
    noMoreData,
    handleLoadMore,
    handleRefresh,
  } = usePaginatedList(contract_GetAll, PAGE_SIZE, {
    orderBy: 'contractNo',
    sortOrder: 'desc',
    search: searchQuery,
    fieldColumns:
      'employeeID, organizationUnitID, contractNo, contractSubject, contractPeriodID, startDate, salaryBasic, salaryRate, jobTitleID',
  });
  console.log('    Contract render with data:', contract);

  const onEndReachedCalledDuringMomentum = useRef(false);

  console.log('Contract data:', contract);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.tableRow}
      onPress={() => {
        navigate(Screen_Name.Details_Contract, { id: item.employeeId });
      }}
    >
      {/* STT */}
      <View
        style={[styles.checkboxCell, { width: COLUMN_MIN_WIDTHS.checkbox }]}
      >
        <Text>{index + 1}</Text>
      </View>
      <Text style={{ borderLeftWidth: 0.5 }} />
      {/* Mã hợp đồng*/}
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[styles.cell, { width: COLUMN_MIN_WIDTHS.id, flex: 2 }]}
      >
        {item.employeeCode}
      </Text>
      <Text style={{ borderLeftWidth: 0.5 }} />
      {/* Tên nhân viên */}
      <TouchableOpacity
        style={[styles.cell, { width: COLUMN_MIN_WIDTHS.name, flex: 1 }]}
        onPress={() => {
          navigate(Screen_Name.Employee, {
            screen: Screen_Name.Details_Employee,
            params: { id: item.id },
          });
        }}
      >
        <Text
          style={[
            styles.cell,
            {
              width: COLUMN_MIN_WIDTHS.name,
              flex: 1,
              textDecorationLine: 'underline',
            },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.fullName}
        </Text>
      </TouchableOpacity>
      <Text style={{ borderLeftWidth: 0.5 }} />

      {/* Ngày kí hợp đồng */}
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[styles.cell, { width: COLUMN_MIN_WIDTHS.start, flex: 1 }]}
      >
        {item.gender}
      </Text>
      <Text style={{ borderLeftWidth: 0.5 }} />

      {/* Vị trí */}
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[styles.cell, { width: COLUMN_MIN_WIDTHS.position, flex: 1 }]}
      >
        {item.phoneNumber}
      </Text>
      <Text style={{ borderLeftWidth: 0.5 }} />
      {/* Phòng ban */}
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[styles.cell, { width: COLUMN_MIN_WIDTHS.struct, flex: 1 }]}
      >
        {item.email}
      </Text>
      <Text style={{ borderLeftWidth: 0.5 }} />
      {/* Loại hợp đồng */}
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[styles.cell, { width: COLUMN_MIN_WIDTHS.type, flex: 1 }]}
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
    if (!loading && noMoreData && contract.length > 0) {
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
        label="Contract"
        leftPress={() => {
          navigation.openDrawer();
        }}
        leftIcon={icons.menu}
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
            Đang hiển thị {contract.length} bản ghi
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
                  { minWidth: COLUMN_MIN_WIDTHS.id, flex: 2 },
                ]}
              >
                Mã hợp đồng
              </Text>
              <Text style={{ borderLeftWidth: 0.5 }} />

              <Text
                style={[
                  styles.headerCell,
                  { minWidth: COLUMN_MIN_WIDTHS.name, flex: 1 },
                ]}
              >
                Tên nhân viên
              </Text>
              <Text style={{ borderLeftWidth: 0.5 }} />
              <Text
                style={[
                  styles.headerCell,
                  { minWidth: COLUMN_MIN_WIDTHS.start, flex: 1 },
                ]}
              >
                Ngày ký
              </Text>
              <Text style={{ borderLeftWidth: 0.5 }} />
              <Text
                style={[
                  styles.headerCell,
                  { minWidth: COLUMN_MIN_WIDTHS.position, flex: 1 },
                ]}
              >
                Vị trí
              </Text>
              <Text style={{ borderLeftWidth: 0.5 }} />
              <Text
                style={[
                  styles.headerCell,
                  { minWidth: COLUMN_MIN_WIDTHS.struct, flex: 1 },
                ]}
              >
                Phòng ban
              </Text>
              <Text style={{ borderLeftWidth: 0.5 }} />
              <Text
                style={[
                  styles.headerCell,
                  { minWidth: COLUMN_MIN_WIDTHS.type, flex: 1 },
                ]}
              >
                Loại hợp đồng
              </Text>
            </View>

            <FlatList
              ref={flatListRef}
              data={contract}
              keyExtractor={item => item.employeeId}
              style={styles.bodyScroll}
              renderItem={renderItem}
              ListEmptyComponent={
                !loading && contract.length === 0 ? (
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
                  contract.length > 0 // Đảm bảo có dữ liệu trước khi load more
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

export default Contract;
