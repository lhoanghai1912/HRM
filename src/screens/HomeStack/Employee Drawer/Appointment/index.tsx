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
import { appoint_GetAll } from '../../../../services/hr';
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

const Appointment = ({}) => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const FIELD_COLUMNS =
    'employeeId,EffectiveDate,organizationUnitAppointID,jobPositionAppointID,employeeOrganizationUnitID,procedureID,appointStatusID,ExpirationDate';

  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutFields, setLayoutFields] = useState([]);
  const fieldColumnsArr = FIELD_COLUMNS.split(',')
    .map(s => s.trim())
    .filter(Boolean);

  // Sử dụng hook phân trang
  const {
    data: appointment,
    loading,
    loadingMore,
    refreshing,
    noMoreData,
    handleLoadMore,
    handleRefresh,
  } = usePaginatedList(appoint_GetAll, PAGE_SIZE, {
    orderBy: 'Id',
    sortOrder: 'desc',
    search: searchQuery,
    fieldColumns: FIELD_COLUMNS,
  });

  const appointmentData = appointment.map(item => ({
    ...item,
    employeeID: item.EmployeeId,
    employeeName: item.employeeName,
  }));

  const fetchLayoutData = async () => {
    try {
      const data = await getLayout('appoint');
      console.log('layoutApp', data);
      const filteredFields = (data.pageData || []).filter(field =>
        fieldColumnsArr
          .map(s => s.toLowerCase())
          .includes(field.fieldName.toLowerCase()),
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
        label="Appointment Application"
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
            Đang hiển thị {appointment.length} bản ghi
          </Text>
          <Text style={AppStyles.text}></Text>
          {/* <Text style={AppStyles.text}>{visibleCount}</Text> */}
        </View>
      </View>
      {/* Table */}
      <RenderTable
        layoutFields={layoutFields}
        data={appointmentData}
        keyExtractor={item => item.Id}
        onRowPress={item =>
          navigate(Screen_Name.Detail_Appointment, { id: item.Id })
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

export default Appointment;
