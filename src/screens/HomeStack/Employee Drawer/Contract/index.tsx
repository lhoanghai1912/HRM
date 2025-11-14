import React, { useEffect, useRef, useState } from 'react';
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
import { getLayout } from '../../../../services/data';
import { renderField } from '../../../../utils/formField';

const PAGE_SIZE = 15;

const Contract = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const FIELD_COLUMNS =
    'ContractStatusID,ContractNo,StartDate,EndDate,SyncDocumentID';

  const flatListRef = useRef<FlatList>(null);
  const [searchInput, setSearchInput] = useState(''); // Input tạm thời
  const [searchQuery, setSearchQuery] = useState(''); // Query thực tế để gọi API
  const [layoutFields, setLayoutFields] = useState([]);
  const fieldColumnsArr = FIELD_COLUMNS.split(',')
    .map(s => s.trim())
    .filter(Boolean);

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
    orderBy: 'Id',
    sortOrder: ' desc',
    search: searchQuery,
    fieldColumns: FIELD_COLUMNS,
  });
  const onEndReachedCalledDuringMomentum = useRef(false);

  console.log('Contract data:', contract);

  const fetchLayoutData = async () => {
    try {
      const data = await getLayout('contract');
      console.log('layout', data);
      const filteredFields = (data.pageData || []).filter(field =>
        fieldColumnsArr.includes(field.fieldName),
      );
      setLayoutFields(filteredFields);
      console.log('fieldColumnsArr', filteredFields);
    } catch (error) {
      console.log('Error fetching layout data:', error);
      setLayoutFields([]);
    }
  };

  useEffect(() => {
    fetchLayoutData();
    console.log('fetch layout data', layoutFields);
  }, []);

  const renderHeader = () => (
    <View style={styles.tableRowHeader}>
      {/* Cột STT */}
      <View style={[styles.checkboxCell, { minWidth: ms(40) }]}>
        <Text>#</Text>
      </View>
      <Text style={{ borderLeftWidth: 0.5 }} />
      {/* Render các cột theo layout */}
      {Array.isArray(layoutFields) && layoutFields.length > 0 ? (
        layoutFields.map((field, index) => (
          <React.Fragment key={field.fieldName}>
            <Text
              style={[
                styles.headerCell,
                { minWidth: field.minWidth || ms(120), flex: 1 },
              ]}
            >
              {field.label}
            </Text>
            {index < layoutFields.length - 1 && (
              <Text style={{ borderLeftWidth: 0.5 }} />
            )}
          </React.Fragment>
        ))
      ) : (
        <Text style={{ marginLeft: 8, color: '#888' }}>
          Đang tải cấu hình bảng...
        </Text>
      )}
    </View>
  );
  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      key={item.EmployeeID}
      style={styles.tableRow}
      onPress={() => {
        navigate(Screen_Name.Details_Employee, { id: item.EmployeeID });
      }}
    >
      {/* STT */}
      <View style={[styles.checkboxCell, { width: ms(40) }]}>
        <Text>{index + 1}</Text>
      </View>
      <Text style={{ borderLeftWidth: 0.5 }} />

      {/* Render các cell theo layout */}
      {layoutFields.map((field, idx) => (
        <React.Fragment key={field.fieldName}>
          <View
            style={[
              styles.cell,
              {
                width: ms(150),
                minWidth: field.minWidth || ms(120),
                maxWidth: ms(200),
                flex: 1,
              },
            ]}
          >
            {renderField(
              {
                ...field,
                fieldName: field.fieldName,
                typeControl: field.typeControl,
                label: field.label,
                displayField: field.displayField,
              },
              item[field.fieldName],
              () => {}, // onChange không cần trong chế độ view
              'view', // mode = 'view' để chỉ hiển thị, không cho edit
              {
                formData: item, // Pass item để có thể lấy displayField
                pickerData: field.pickerData || [],
              },
            )}
          </View>
          {idx < layoutFields.length - 1 && (
            <Text style={{ borderLeftWidth: 0.5 }} />
          )}
        </React.Fragment>
      ))}
    </TouchableOpacity>
  );
  console.log('item render:', contract);

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
            <FlatList
              ref={flatListRef}
              data={contract}
              keyExtractor={item => item.EmployeeID?.toString()}
              style={styles.bodyScroll}
              renderItem={renderItem}
              ListHeaderComponent={renderHeader}
              ListEmptyComponent={
                !loading && contract.length === 0 ? (
                  <Text
                    style={[
                      AppStyles.label,
                      { textAlign: 'center', marginTop: spacing.medium },
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
                  contract.length > 0
                ) {
                  handleLoadMore();
                  onEndReachedCalledDuringMomentum.current = true;
                }
              }}
              onMomentumScrollBegin={() => {
                onEndReachedCalledDuringMomentum.current = false;
              }}
              onEndReachedThreshold={0.3}
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
