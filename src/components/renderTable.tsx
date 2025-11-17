import React, { useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { renderField } from '../utils/formField';
import { spacing } from '../utils/spacing';
import AppStyles from './AppStyle';

interface RenderTableProps {
  layoutFields: any[];
  data: any[];
  keyExtractor?: (item: any) => string;
  onRowPress?: (item: any) => void;
  loading?: boolean;
  loadingMore?: boolean;
  refreshing?: boolean;
  noMoreData?: boolean;
  onRefresh?: () => void;
  onLoadMore?: () => void;
  emptyMessage?: string;
  style?: any;
  tableRowStyle?: any;
  headerStyle?: any;
  cellStyle?: any;
}

const RenderTable: React.FC<RenderTableProps> = ({
  layoutFields = [],
  data = [],
  keyExtractor = item => item.id?.toString(),
  onRowPress,
  loading = false,
  loadingMore = false,
  refreshing = false,
  noMoreData = false,
  onRefresh,
  onLoadMore,
  emptyMessage = 'Không có dữ liệu',
  style = {},
  tableRowStyle = {},
  headerStyle = {},
  cellStyle = {},
}) => {
  const onEndReachedCalledDuringMomentum = useRef(false);
  const flatListRef = useRef<FlatList>(null);
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
          {renderField(
            {
              ...field,
              fieldName: field.fieldName,
              typeControl: field.typeControl,
              label: field.label,
              displayField: field.displayField,
            },
            item[field.fieldName],
            () => {},
            'view',
            {
              formData: item,
              pickerData: field.pickerData || [],
            },
          )}
        </View>
      ))}
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View
          style={{
            paddingTop: spacing.medium,
            paddingBottom: spacing.small,
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="small" />
        </View>
      );
    }
    if (!loading && noMoreData && data.length > 0) {
      return (
        <View
          style={{
            paddingTop: spacing.medium,
            paddingBottom: spacing.small,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#888' }}>Đã hết dữ liệu</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={[styles.table, style]}>
          <FlatList
            ref={flatListRef}
            data={data}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={
              !loading && data.length === 0 ? (
                <Text
                  style={[
                    AppStyles.label,
                    { textAlign: 'center', marginTop: spacing.medium },
                  ]}
                >
                  {emptyMessage}
                </Text>
              ) : null
            }
            ListFooterComponent={renderFooter}
            refreshControl={
              onRefresh ? (
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              ) : undefined
            }
            onEndReached={() => {
              if (
                onLoadMore &&
                !onEndReachedCalledDuringMomentum.current &&
                !loadingMore &&
                !noMoreData &&
                !loading &&
                data.length > 0
              ) {
                onLoadMore();
                onEndReachedCalledDuringMomentum.current = true;
              }
            }}
            onMomentumScrollBegin={() => {
              onEndReachedCalledDuringMomentum.current = false;
            }}
            onEndReachedThreshold={0.3}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
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

export default RenderTable;
