import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { renderField } from '../utils/formField';

export const renderTable = ({
  layoutFields = [],
  data = [],
  keyExtractor = item => item.id?.toString(),
  onRowPress,
  style = {},
  tableRowStyle = {},
  headerStyle = {},
  cellStyle = {},
}) => {
  const getColWidth = field => {
    if (field.customConfig) {
      try {
        const grid = JSON.parse(field.customConfig)?.GridConfigs;
        if (grid?.Width) return grid.Width;
        if (grid?.MinWidth) return grid.MinWidth;
      } catch {}
    }
    return field.width || field.minWidth || 120;
  };

  const renderHeader = () => (
    <View style={[styles.tableRowHeader, headerStyle]}>
      {/* Cột STT */}
      <View style={[styles.checkboxCell, { minWidth: 40, width: 40 }]}>
        <Text>#</Text>
      </View>
      {layoutFields.map((field, index) => (
        <View
          key={field.fieldName}
          style={[
            styles.headerCell,
            {
              minWidth: getColWidth(field),
              width: getColWidth(field),
              flex: 0,
            },
          ]}
        >
          <Text numberOfLines={1} ellipsizeMode="tail">
            {field.label}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      key={keyExtractor(item)}
      style={[styles.tableRow, tableRowStyle]}
      onPress={() => onRowPress?.(item)}
    >
      <View style={[styles.checkboxCell, { minWidth: 40, width: 40 }]}>
        <Text>{index + 1}</Text>
      </View>
      {layoutFields.map(field => (
        <View
          key={field.fieldName}
          style={[
            styles.cell,
            {
              minWidth: getColWidth(field),
              width: getColWidth(field),
              flex: 0,
            },
            cellStyle,
          ]}
        >
          {renderField(field, item[field.fieldName], () => {}, 'view', {
            formData: item,
            pickerData: field.pickerData || [],
          })}
        </View>
      ))}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.table, style]}>
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  table: { flex: 1 },
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },
  headerCell: {
    padding: 8,
    borderRightWidth: 0.5,
    borderColor: '#ddd',
    justifyContent: 'center',
  },
  cell: {
    padding: 8,
    borderRightWidth: 0.5,
    borderColor: '#eee',
    justifyContent: 'center',
  },
  checkboxCell: { justifyContent: 'center', alignItems: 'center' },
});
