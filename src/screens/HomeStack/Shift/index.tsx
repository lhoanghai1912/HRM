import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import CustomHeader from '../../../navigation/CustomHeader';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { ms, spacing } from '../../../utils/spacing';
import { navigate } from '../../../navigation/RootNavigator';
import { Screen_Name } from '../../../navigation/ScreenName';
import icons from '../../../assets/icons';
import { getAllShifts } from '../../../services/Shift';

const PAGE_SIZE = 10;
const COLUMN_MIN_WIDTHS = {
  checkbox: 40,
  name: 180,
  work: 160,
  time: 180,
  unit: 150,
  object: 150,
  location: 120,
};

const Shift = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [shiftData, setShiftData] = useState([]);

  useEffect(() => {
    fetchAllShift();
  }, []);

  const formatDate = dateStr => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${d.getFullYear()}`;
  };

  const fetchAllShift = async () => {
    try {
      setLoading(true);
      const response = await getAllShifts(); // Adjust the endpoint as needed
      console.log('Fetched shifts:', response);
      setShiftData(response.result || []);
    } catch (error) {
      console.error('Error fetching shifts:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + PAGE_SIZE, shiftData.length));
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

          {/* Table Body */}
          <ScrollView style={styles.bodyScroll}>
            {shiftData.slice(0, visibleCount).map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.tableRow}
                onPress={() => {
                  navigate(Screen_Name.Details_Shift, { id: item?.id });
                }}
              >
                <View
                  style={[
                    styles.checkboxCell,
                    { width: COLUMN_MIN_WIDTHS.checkbox },
                  ]}
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
                    : '-'}{' '}
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
                  {item.shiftDetailOrgStructs &&
                  item.shiftDetailOrgStructs.length > 0
                    ? item.shiftDetailOrgStructs
                        .map(org => org.orgStruct?.orgStructName)
                        .filter(Boolean)
                        .join('; ')
                    : '-'}{' '}
                </Text>
                <Text style={{ borderLeftWidth: 0.5 }} />
                <Text
                  style={[styles.cell, { width: COLUMN_MIN_WIDTHS.object }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.shiftDetailEmployees &&
                  item.shiftDetailEmployees.length > 0
                    ? item.shiftDetailEmployees
                        .map(employees => employees.employee?.fullName)
                        .filter(Boolean)
                        .join('; ')
                    : '-'}{' '}
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
            ))}
            {visibleCount < shiftData.length && (
              <TouchableOpacity
                style={styles.loadMoreBtn}
                onPress={handleLoadMore}
              >
                <Text style={styles.loadMoreText}>Tải thêm...</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Tổng số bản ghi: {shiftData.length}
        </Text>
        <Text style={styles.footerText}>{visibleCount}</Text>
        <Text style={styles.footerText}>Từ 1 đến {visibleCount} bản ghi</Text>
      </View>
      {loading && (
        <View style={{ paddingVertical: 24 }}>
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
  table: { flex: 1 },
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
  bodyScroll: { maxHeight: 500 },
  footer: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
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
