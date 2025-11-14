import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../utils/color';
import { spacing } from '../utils/spacing';
import { fonts } from '../utils/fontSize';
import { mapFieldType } from '../utils/formField';

interface ProfileViewProps {
  layoutConfig: any[];
  employeeData: any;
}

const ProfileView: React.FC<ProfileViewProps> = ({
  layoutConfig,
  employeeData,
}) => {
  // Format giá trị theo kiểu field
  const formatValue = (fieldConfig: any, value: any) => {
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    const fieldType = mapFieldType(fieldConfig.typeControl);

    switch (fieldType) {
      case 'date':
        // Format date
        if (typeof value === 'string') {
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('vi-VN');
          }
        }
        return value;

      case 'int':
      case 'decimal':
        // Format number with thousands separator
        const num = parseFloat(value);
        if (!isNaN(num)) {
          return num.toLocaleString('vi-VN');
        }
        return value;

      case 'currency':
        // Format currency
        const amount = parseFloat(value);
        if (!isNaN(amount)) {
          return amount.toLocaleString('vi-VN') + ' VNĐ';
        }
        return value;

      case 'percent':
        // Format percent
        const percent = parseFloat(value);
        if (!isNaN(percent)) {
          return percent + '%';
        }
        return value;

      case 'selectOne':
        // Hiển thị displayField nếu có
        if (
          fieldConfig.displayField &&
          employeeData[fieldConfig.displayField]
        ) {
          return employeeData[fieldConfig.displayField];
        }
        return value;

      case 'selectMulti':
        // Hiển thị displayField nếu có
        if (
          fieldConfig.displayField &&
          employeeData[fieldConfig.displayField]
        ) {
          const displayValue = employeeData[fieldConfig.displayField];
          if (typeof displayValue === 'string') {
            try {
              const parsed = JSON.parse(displayValue);
              if (Array.isArray(parsed)) {
                return parsed
                  .map(d => d.pickListValue || d.name || d)
                  .join(', ');
              }
            } catch (e) {
              return displayValue;
            }
          }
          if (Array.isArray(displayValue)) {
            return displayValue
              .map(d => d.pickListValue || d.name || d)
              .join(', ');
          }
        }
        return value;

      case 'checkbox':
        return value ? 'Có' : 'Không';

      case 'organization':
        // Hiển thị tên tổ chức từ displayField
        if (
          fieldConfig.displayField &&
          employeeData[fieldConfig.displayField]
        ) {
          return employeeData[fieldConfig.displayField];
        }
        return value;

      case 'employee':
        // Hiển thị tên nhân viên từ displayField
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
    const value = employeeData[fieldConfig.fieldName];
    const formattedValue = formatValue(fieldConfig, value);

    return (
      <View key={fieldConfig.id} style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>
          {fieldConfig.fieldLabel || fieldConfig.fieldName}:
        </Text>
        <Text style={styles.fieldValue}>{formattedValue}</Text>
      </View>
    );
  };

  // Render một group với các fields của nó
  const renderGroup = (group: any) => {
    if (!group.isVisible) return null;

    const fields = group.groupFieldConfigs || [];
    if (fields.length === 0) return null;

    return (
      <View key={group.id} style={styles.groupContainer}>
        <Text style={styles.groupTitle}>{group.name}</Text>
        <View style={styles.fieldsContainer}>
          {fields
            .filter((field: any) => field.isVisible !== false)
            .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
            .map((field: any) => renderField(field))}
        </View>
      </View>
    );
  };

  // Render groups theo cấu trúc parent-child
  const renderGroupsHierarchy = () => {
    if (!layoutConfig || !Array.isArray(layoutConfig)) return null;

    // Tìm parent groups (parentId = null)
    const parentGroups = layoutConfig
      .filter((group: any) => group.parentId === null)
      .sort((a: any, b: any) => a.sortOrder - b.sortOrder);

    return parentGroups.map(parentGroup => {
      // Tìm child groups
      const childGroups = layoutConfig
        .filter((group: any) => group.parentId === parentGroup.id)
        .sort((a: any, b: any) => a.sortOrder - b.sortOrder);

      return (
        <View key={parentGroup.id} style={styles.parentGroupContainer}>
          {/* Render parent group nếu có fields */}
          {parentGroup.groupFieldConfigs &&
            parentGroup.groupFieldConfigs.length > 0 &&
            renderGroup(parentGroup)}

          {/* Render child groups */}
          {childGroups.map((childGroup: any) => renderGroup(childGroup))}
        </View>
      );
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderGroupsHierarchy()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.medium,
  },
  parentGroupContainer: {
    marginBottom: spacing.large,
  },
  groupContainer: {
    marginBottom: spacing.medium,
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
  fieldsContainer: {
    gap: spacing.small,
  },
  fieldContainer: {
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

export default ProfileView;
