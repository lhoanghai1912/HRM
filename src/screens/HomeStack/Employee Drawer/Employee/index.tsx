import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import CustomHeader from '../../../../components/CustomHeader';
import icons from '../../../../assets/icons';
import { usePaginatedList } from '../../../../components/Paginated';
import { employee_GetAll } from '../../../../services/hr';
import { spacing } from '../../../../utils/spacing';
import { TextInput } from 'react-native-gesture-handler';
import AppStyles from '../../../../components/AppStyle';
import { navigate } from '../../../../navigation/RootNavigator';
import { Screen_Name } from '../../../../navigation/ScreenName';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import styles from '../styles';
import { getLayout } from '../../../../services/data';
import RenderTable from '../../../../components/renderTable';

const PAGE_SIZE = 15;

const Employee = ({}) => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const FIELD_COLUMNS = 'employeeCode,fullName,genderID,birthDay,mobile,email';

  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutFields, setLayoutFields] = useState([]);
  const fieldColumnsArr = FIELD_COLUMNS.split(',')
    .map(s => s.trim())
    .filter(Boolean);

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
    sortOrder: ' asc',
    search: searchQuery,
    fieldColumns: FIELD_COLUMNS,
  });

  const fetchLayoutData = async () => {
    try {
      const data = await getLayout('profile');
      console.log('layoutEmployee', data);
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
  }, []);

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
      <RenderTable
        layoutFields={layoutFields}
        data={employee}
        keyExtractor={item => item.EmployeeID?.toString()}
        onRowPress={item =>
          navigate(Screen_Name.Details_Employee, { id: item.EmployeeID })
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
      />

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
