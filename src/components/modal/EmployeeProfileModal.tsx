import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { colors } from '../../utils/color';
import { spacing } from '../../utils/spacing';
import { fonts } from '../../utils/fontSize';
import { useLayoutConfig } from '../hooks/useLayoutConfig';
import { employee_GetAll } from '../../services/hr';
import ProfileView from '../ProfileView';

interface EmployeeProfileModalProps {
  visible: boolean;
  employeeId: number | null;
  onClose: () => void;
}

const EmployeeProfileModal: React.FC<EmployeeProfileModalProps> = ({
  visible,
  employeeId,
  onClose,
}) => {
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [loadingEmployee, setLoadingEmployee] = useState(false);

  // Lấy layout config
  const {
    layoutConfig,
    loading: loadingLayout,
    error,
  } = useLayoutConfig('profile');

  // Fetch employee data khi modal mở và có layoutConfig
  useEffect(() => {
    if (visible && employeeId && layoutConfig) {
      fetchEmployeeData();
    }
  }, [visible, employeeId, layoutConfig]);

  const fetchEmployeeData = async () => {
    try {
      setLoadingEmployee(true);

      // Build fieldColumns từ layoutConfig
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

      console.log('Fetching employee with fields:', fieldColumns);

      const response = await employee_GetAll({
        paramQuery: {
          page: 1,
          pageSize: 1,
          filter: `EmployeeID eq ${employeeId}`,
          search: '',
          orderBy: '',
          sortOrder: '',
        },
        fieldColumns: fieldColumns || 'EmployeeID,FullName,EmployeeCode',
      });

      const data = response?.data?.pageData || response?.pageData || [];
      if (data.length > 0) {
        console.log('Employee data:', data[0]);
        setEmployeeData(data[0]);
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
    } finally {
      setLoadingEmployee(false);
    }
  };

  const handleClose = () => {
    setEmployeeData(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hồ sơ nhân viên</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {(loadingLayout || loadingEmployee) && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Đang tải...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {!loadingLayout &&
          !loadingEmployee &&
          !error &&
          employeeData &&
          layoutConfig && (
            <ProfileView
              layoutConfig={layoutConfig}
              employeeData={employeeData}
            />
          )}

        {!loadingLayout && !loadingEmployee && !error && !employeeData && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không có dữ liệu</Text>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.Gray,
    backgroundColor: colors.primary,
  },
  headerTitle: {
    fontSize: fonts.large,
    fontWeight: 'bold',
    color: colors.white,
  },
  closeButton: {
    padding: spacing.small,
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.white,
    fontWeight: 'bold',
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

export default EmployeeProfileModal;
