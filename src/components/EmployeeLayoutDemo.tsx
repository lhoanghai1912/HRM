import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { getLayout } from '../services/data';
import { employee_GetAll } from '../services/hr';
import { mapFieldType } from '../utils/formField';
import { colors } from '../utils/color';
import { spacing } from '../utils/spacing';
import { fonts } from '../utils/fontSize';

// Component để demo việc hiển thị employee data theo layout
const EmployeeLayoutDemo = ({ employeeId }: { employeeId: number }) => {
  const [layoutConfig, setLayoutConfig] = useState<any>(null);
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, [employeeId]);

  const loadData = async () => {
    try {
      setLoading(true);

      // 1. Gọi API getLayout để lấy cấu trúc layout
      const layoutResponse = await getLayout('profile');
      const layout = layoutResponse?.pageData || layoutResponse;
      setLayoutConfig(layout);

      console.log('Layout config:', layout);

      // 2. Build fieldColumns từ layout
      const fieldNames: string[] = [];
      if (Array.isArray(layout)) {
        layout.forEach((group: any) => {
          if (
            group.groupFieldConfigs &&
            Array.isArray(group.groupFieldConfigs)
          ) {
            group.groupFieldConfigs.forEach((field: any) => {
              if (field.fieldName) {
                fieldNames.push(field.fieldName);
                // Thêm displayField nếu có
                if (
                  field.displayField &&
                  field.displayField !== field.fieldName
                ) {
                  fieldNames.push(field.displayField);
                }
              }
            });
          }
        });
      }

      const uniqueFields = [...new Set(fieldNames)];
      const fieldColumns = uniqueFields.join(',');

      console.log('Field columns to fetch:', fieldColumns);

      // 3. Gọi API employee_GetAll với fieldColumns
      const employeeResponse = await employee_GetAll({
        paramQuery: {
          page: 1,
          pageSize: 1,
          filter: `EmployeeID eq ${employeeId}`,
          search: '',
          orderBy: '',
          sortOrder: '',
        },
        fieldColumns,
      });

      const data =
        employeeResponse?.data?.pageData || employeeResponse?.pageData || [];
      if (data.length > 0) {
        setEmployeeData(data[0]);
        console.log('Employee data:', data[0]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format giá trị theo kiểu typeControl
  const formatValue = (fieldConfig: any, value: any) => {
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    const fieldType = mapFieldType(fieldConfig.typeControl);

    switch (fieldType) {
      case 'date':
      case 'month':
        // Format date theo dd/mm/yyyy
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

      case 'int':
      case 'decimal':
        // Format number với dấu phân cách
        const num = parseFloat(value);
        if (!isNaN(num)) {
          return num.toLocaleString('vi-VN');
        }
        return value;

      case 'currency':
        // Format tiền tệ
        const amount = parseFloat(value);
        if (!isNaN(amount)) {
          return amount.toLocaleString('vi-VN') + ' VNĐ';
        }
        return value;

      case 'percent':
        // Format phần trăm
        const percent = parseFloat(value);
        if (!isNaN(percent)) {
          return percent + '%';
        }
        return value;

      case 'selectOne':
      case 'selectMulti':
        // Hiển thị displayField nếu có
        if (
          fieldConfig.displayField &&
          employeeData[fieldConfig.displayField]
        ) {
          return employeeData[fieldConfig.displayField];
        }
        return value;

      case 'checkbox':
        return value ? 'Có' : 'Không';

      case 'organization':
      case 'employee':
        // Hiển thị displayField
        if (
          fieldConfig.displayField &&
          employeeData[fieldConfig.displayField]
        ) {
          return employeeData[fieldConfig.displayField];
        }
        return value;

      default:
        return value?.toString() || '-';
    }
  };

  // Render một field
  const renderField = (fieldConfig: any) => {
    // Lấy value từ employeeData theo fieldName
    const value = employeeData[fieldConfig.fieldName];
    const formattedValue = formatValue(fieldConfig, value);

    return (
      <View key={fieldConfig.id} style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>
          {fieldConfig.label || fieldConfig.fieldName}:
        </Text>
        <Text style={styles.fieldValue}>{formattedValue}</Text>
      </View>
    );
  };

  // Render group
  const renderGroup = (group: any) => {
    if (!group.isVisible) return null;

    const fields = group.groupFieldConfigs || [];
    if (fields.length === 0) return null;

    return (
      <View key={group.id} style={styles.groupContainer}>
        <Text style={styles.groupTitle}>{group.name}</Text>
        {fields
          .filter((field: any) => field.isVisible !== false)
          .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
          .map((field: any) => renderField(field))}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={styles.openButton}
        onPress={() => setVisible(v => !v)}
      >
        <Text style={styles.openButtonText}>
          {visible ? 'Đóng thông tin nhân viên' : 'Xem thông tin nhân viên'}
        </Text>
      </TouchableOpacity>
      {visible &&
        (loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Đang tải...</Text>
          </View>
        ) : !layoutConfig || !employeeData ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không có dữ liệu</Text>
          </View>
        ) : (
          <ScrollView style={styles.container}>
            {Array.isArray(layoutConfig) &&
              layoutConfig
                .filter((group: any) => group.parentId === null)
                .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
                .map((parentGroup: any) => (
                  <View key={parentGroup.id}>
                    {renderGroup(parentGroup)}
                    {/* Render child groups */}
                    {layoutConfig
                      .filter((g: any) => g.parentId === parentGroup.id)
                      .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
                      .map((childGroup: any) => renderGroup(childGroup))}
                  </View>
                ))}
          </ScrollView>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  openButton: {
    backgroundColor: colors.primary,
    padding: spacing.medium,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: spacing.medium,
  },
  openButtonText: {
    color: colors.white,
    fontSize: fonts.large,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.medium,
    color: colors.Gray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: colors.Gray,
  },
  groupContainer: {
    marginBottom: spacing.large,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.medium,
    borderWidth: 1,
    borderColor: colors.Gray,
  },
  groupTitle: {
    fontSize: fonts.large,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.medium,
  },
  fieldRow: {
    flexDirection: 'row',
    paddingVertical: spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  fieldLabel: {
    fontSize: fonts.normal,
    fontWeight: '600',
    color: colors.black,
    flex: 1,
  },
  fieldValue: {
    fontSize: fonts.normal,
    color: '#333',
    flex: 1.5,
    textAlign: 'right',
  },
});

export default EmployeeLayoutDemo;
