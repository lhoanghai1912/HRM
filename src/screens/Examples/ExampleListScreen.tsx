// src/screens/Examples/ExampleListScreen.tsx
// Example screen demonstrating the production-grade architecture patterns

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemedColors, useTheme } from '../../contexts';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { spacing, borderRadius, fontSize } from '../../constants/dimensions';

// Example data type
interface ListItem {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

// Mock data for demonstration
const MOCK_DATA: ListItem[] = Array.from({ length: 50 }, (_, i) => ({
  id: `${i + 1}`,
  title: `Item ${i + 1}`,
  description: `Description for item ${i + 1}`,
  status: ['pending', 'approved', 'rejected'][i % 3] as ListItem['status'],
  date: new Date(Date.now() - i * 86400000).toLocaleDateString('vi-VN'),
}));

const PAGE_SIZE = 10;

const ExampleListScreen: React.FC = () => {
  const { t } = useTranslation();
  const colors = useThemedColors();
  const { isDark, toggleTheme } = useTheme();
  const dispatch = useAppDispatch();

  // Local state for pagination
  const [data, setData] = useState<ListItem[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Redux state example
  const isGlobalLoading = useAppSelector(state => state.loading.isLoading);

  // Initial data load
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load initial data
  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const initialData = MOCK_DATA.slice(0, PAGE_SIZE);
      setData(initialData);
      setHasMore(MOCK_DATA.length > PAGE_SIZE);
      setPage(1);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Pull to refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const refreshedData = MOCK_DATA.slice(0, PAGE_SIZE);
      setData(refreshedData);
      setHasMore(MOCK_DATA.length > PAGE_SIZE);
      setPage(1);
    } catch (error) {
      console.error('Failed to refresh:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Load more (infinite scroll)
  const handleLoadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const nextPage = page + 1;
      const start = (nextPage - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      const moreData = MOCK_DATA.slice(start, end);

      if (moreData.length > 0) {
        setData(prev => [...prev, ...moreData]);
        setPage(nextPage);
        setHasMore(end < MOCK_DATA.length);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load more:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore]);

  // Get status color
  const getStatusColor = (status: ListItem['status']) => {
    switch (status) {
      case 'approved':
        return colors.green;
      case 'rejected':
        return colors.red;
      default:
        return colors.orange;
    }
  };

  // Render list item
  const renderItem = ({ item }: { item: ListItem }) => (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          {item.title}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) + '20' },
          ]}
        >
          <Text
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {t(`status.${item.status}`, item.status)}
          </Text>
        </View>
      </View>
      <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
        {item.description}
      </Text>
      <Text style={[styles.cardDate, { color: colors.gray }]}>{item.date}</Text>
    </TouchableOpacity>
  );

  // Render footer (loading indicator for infinite scroll)
  const renderFooter = () => {
    if (!isLoading || isRefreshing) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  // Render empty state
  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          {t('common.noData', 'Không có dữ liệu')}
        </Text>
      </View>
    );
  };

  // Styles using theme colors
  const themedStyles = {
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      padding: spacing.md,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
  };

  return (
    <View style={themedStyles.container}>
      {/* Header with theme toggle */}
      <View style={themedStyles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t('screens.exampleList', 'Danh sách mẫu')}
        </Text>
        <TouchableOpacity
          onPress={toggleTheme}
          style={[styles.themeButton, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.themeButtonText}>
            {isDark ? '☀️ Light' : '🌙 Dark'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: '600',
  },
  themeButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  themeButtonText: {
    color: '#FFFFFF',
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  card: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: '500',
  },
  cardDescription: {
    fontSize: fontSize.md,
    marginBottom: spacing.sm,
  },
  cardDate: {
    fontSize: fontSize.sm,
  },
  footer: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontSize: fontSize.md,
  },
});

export default ExampleListScreen;
