import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { ms, spacing } from '../../../../utils/spacing';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AppStyles from '../../../../components/AppStyle';
import { useColors } from '../../../../hooks/useColors';
import { navigate } from '../../../../navigation/RootNavigator';
import { Screen_Name } from '../../../../navigation/ScreenName';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import styles from '../styles';
import { getLayout } from '../../../../services/data';
import { renderField } from '../../../../utils/formField';
import { contract_GetAll } from '../../../../services/hr';
import RenderTable from '../../../../components/renderTable';
import ContractCard from './ContractCard';

const PAGE_SIZE = 15;

const Contract = ({}) => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const colors = useColors();
  const FIELD_COLUMNS =
    'contractNo,contractSubject,contractPeriodID,startDate,salaryBasic,salaryRate,jobTitleID,onBehalfOfEmployerID,contractStatusID';

  const flatListRef = useRef<FlatList>(null);
  const [searchInput, setSearchInput] = useState(''); // Input tạm thời
  const [searchQuery, setSearchQuery] = useState(''); // Query thực tế để gọi API
  const [layoutFields, setLayoutFields] = useState([]);
  const fieldColumnsArr = FIELD_COLUMNS.split(',')
    .map(s => s.trim())
    .filter(Boolean);
  console.log('fieldColumnsArr', fieldColumnsArr);

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
    sortOrder: ' asc',
    search: searchQuery,
    fieldColumns: FIELD_COLUMNS,
  });
  const onEndReachedCalledDuringMomentum = useRef(false);
  console.log('contract', contract);

  const fetchLayoutData = async () => {
    try {
      const data = await getLayout('contract');
      console.log('layoutContract', data);
      const filteredFields = (data.pageData || []).filter(field =>
        fieldColumnsArr.includes(field.fieldName),
      );
      console.log('filteredFields', filteredFields);

      setLayoutFields(filteredFields);
      console.log('layoutFields', layoutFields);
    } catch (error) {
      console.log('Error fetching layout data:', error);
      setLayoutFields([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchLayoutData();
    }, []),
  );

  return (
    <View style={styles.container}>
      <CustomHeader
        label="Contract Attendance"
        leftIcon={icons.menu}
        leftPress={() => navigation.openDrawer()}
      />

      <View style={[styles.toolbar]}>
        <View style={[styles.searchInput, AppStyles.row, { marginTop: 0 }]}>
          <TextInput
            placeholder="Tìm kiếm"
            value={searchInput}
            onChangeText={setSearchInput}
          />
          <TouchableOpacity
            onPress={() => {
              setSearchInput(''), setSearchQuery('');
            }}
          >
            <Image
              source={searchInput ? icons.clear : null}
              style={[AppStyles.icon, { tintColor: colors.text }]}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => setSearchQuery(searchInput)}>
          <Image
            source={icons.search}
            style={[AppStyles.icon, { tintColor: colors.text }]}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={AppStyles.text}>
            Đang hiển thị {contract.length} bản ghi
          </Text>
          <Text style={[AppStyles.text, { color: colors.text }]}></Text>
        </View>
      </View>
      {/* <RenderTable
        layoutFields={layoutFields}
        data={contract}
        keyExtractor={item => item.Id}
        onRowPress={item =>
          navigate(Screen_Name.Details_Contract, { id: item.Id })
        }
        loading={loading}
        loadingMore={loadingMore}
        refreshing={refreshing}
        noMoreData={noMoreData}
        onRefresh={handleRefresh}
        onLoadMore={handleLoadMore}
        emptyMessage="Không có dữ liệu"
        style={styles.table}
        tableRowStyle={styles.tableRow}
        headerStyle={styles.tableRowHeader}
        cellStyle={styles.cell}
      /> */}
      <FlatList
        data={contract}
        keyExtractor={item => item.Id}
        renderItem={({ item }) => (
          <ContractCard
            item={item}
            onPress={() =>
              navigate(Screen_Name.Details_Contract, { id: item.Id })
            }
          />
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            Không có dữ liệu
          </Text>
        }
      />
      {/* Table */}

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
