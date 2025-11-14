import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import CustomHeader from '../../../../components/CustomHeader';
import icons from '../../../../assets/icons';
import { useLayoutConfig } from '../../../../components/hooks/useLayoutConfig';
import ProfileView from '../../../../components/ProfileView';
import { employee_GetAll } from '../../../../services/hr';
import { colors } from '../../../../utils/color';
import { spacing } from '../../../../utils/spacing';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

const EmployeeProfile = ({ route }) => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const { id } = route.params || {};

  const [employeeData, setEmployeeData] = useState<any>(null);
  const [loadingEmployee, setLoadingEmployee] = useState(false);

  // Lấy layout config từ API
  const {
    layoutConfig,
    loading: loadingLayout,
    error,
  } = useLayoutConfig('profile');

  // Lấy thông tin nhân viên khi có layoutConfig
  useEffect(() => {
    if (id && layoutConfig) {
      fetchEmployeeData();
    }
  }, [id, layoutConfig]);

  const fetchEmployeeData = async () => {
    try {
      setLoadingEmployee(true);

      // Lấy tất cả fieldNames từ layoutConfig để build fieldColumns
      const fieldNames: string[] = [];
      if (layoutConfig && Array.isArray(layoutConfig)) {
        layoutConfig.forEach((group: any) => {
          if (
            group.groupFieldConfigs &&
            Array.isArray(group.groupFieldConfigs)
          ) {
            group.groupFieldConfigs.forEach((field: any) => {
              if (field.fieldName) {
                fieldNames.push(field.fieldName);
                // Nếu có displayField, cũng thêm vào
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

      // Loại bỏ duplicates
      const uniqueFields = [...new Set(fieldNames)];
      const fieldColumns = uniqueFields.join(',');

      console.log('Fetching employee with fields:', fieldColumns);

      const response = await employee_GetAll({
        paramQuery: {
          page: 1,
          pageSize: 1,
          filter: `EmployeeID eq ${id}`,
          search: '',
          orderBy: '',
          sortOrder: '',
        },
        fieldColumns: fieldColumns || 'EmployeeID,FullName,EmployeeCode',
      });

      console.log('Employee API response:', response);

      const data = response?.data?.pageData || response?.pageData || [];
      if (data.length > 0) {
        console.log('Employee data loaded:', data[0]);
        setEmployeeData(data[0]);
      } else {
        Alert.alert('Thông báo', 'Không tìm thấy thông tin nhân viên');
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin nhân viên');
    } finally {
      setLoadingEmployee(false);
    }
  };

  if (loadingLayout || loadingEmployee) {
    return (
      <View style={styles.container}>
        <CustomHeader
          label="Hồ sơ nhân viên"
          leftIcon={icons.back}
          leftPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <CustomHeader
          label="Hồ sơ nhân viên"
          leftIcon={icons.back}
          leftPress={() => navigation.goBack()}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchEmployeeData()}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!employeeData) {
    return (
      <View style={styles.container}>
        <CustomHeader
          label="Hồ sơ nhân viên"
          leftIcon={icons.back}
          leftPress={() => navigation.goBack()}
        />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Không tìm thấy thông tin nhân viên
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader
        label="Hồ sơ nhân viên"
        leftIcon={icons.back}
        leftPress={() => navigation.goBack()}
      />
      <ProfileView layoutConfig={layoutConfig} employeeData={employeeData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.large,
  },
  errorText: {
    color: colors.red,
    textAlign: 'center',
    marginBottom: spacing.medium,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.large,
    paddingVertical: spacing.medium,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: colors.Gray,
  },
});

export default EmployeeProfile;
