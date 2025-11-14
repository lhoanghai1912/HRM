import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
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

  // Lấy thông tin nhân viên
  useEffect(() => {
    if (id) {
      fetchEmployeeData();
    }
  }, [id]);

  const fetchEmployeeData = async () => {
    try {
      setLoadingEmployee(true);

      // Lấy tất cả fields từ layoutConfig để truyền vào fieldColumns
      let fieldColumns = '';
      if (layoutConfig && Array.isArray(layoutConfig)) {
        const allFields: string[] = [];
        layoutConfig.forEach((group: any) => {
          if (
            group.groupFieldConfigs &&
            Array.isArray(group.groupFieldConfigs)
          ) {
            group.groupFieldConfigs.forEach((field: any) => {
              if (field.fieldName) {
                allFields.push(field.fieldName);
              }
            });
          }
        });
        fieldColumns = allFields.join(',');
      }

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

      const data = response?.data?.pageData || response?.pageData || [];
      if (data.length > 0) {
        setEmployeeData(data[0]);
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
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
