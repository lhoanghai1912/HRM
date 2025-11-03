import { useCallback, useEffect, useRef, useState } from 'react';

export function usePaginatedList(fetchApi, PAGE_SIZE = 15, params = {}) {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);

  const loadingRef = useRef(false);

  const fetchData = useCallback(
    async (currentPage: number, isRefresh = false, extraParams = {}) => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      if (isRefresh) {
        setLoading(true);
        setLoadingMore(false);
      } else {
        setLoadingMore(true);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      try {
        const res = await fetchApi({
          Page: currentPage,
          PageSize: PAGE_SIZE,
          ...params,
          ...extraParams,
        });
        console.log('FetchData response:', res);

        const result = res?.pageData || []; // Sửa ở đây: chỉ lấy mảng pageData
        if (isRefresh || currentPage === 1) {
          setData(result);
          setNoMoreData(result.length < PAGE_SIZE);
        } else {
          setData(prev => {
            const ids = new Set(prev.map(j => j.id));
            const merged = result.filter(j => !ids.has(j.id));
            return [...prev, ...merged];
          });
          setNoMoreData(result.length < PAGE_SIZE);
        }
      } catch (e) {
        console.error('Fetch error:', e);
      } finally {
        loadingRef.current = false;
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [fetchApi, PAGE_SIZE, params],
  );

  // CHỈ GIỮ 1 useEffect, gọi khi params thay đổi
  useEffect(() => {
    setData([]);
    setPage(1);
    setNoMoreData(false);
    loadingRef.current = false;
    fetchData(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  const handleLoadMore = useCallback(() => {
    console.log('handleLoadMore called:', {
      loadingRef: loadingRef.current,
      loadingMore,
      noMoreData,
      loading,
      currentDataLength: data.length,
    });

    if (loadingRef.current || loadingMore || noMoreData || loading) {
      console.log('Load more blocked by conditions');
      return;
    }

    setPage(prev => {
      const next = prev + 1;
      console.log('Loading page:', next);
      fetchData(next, false);
      return next;
    });
  }, [loadingMore, noMoreData, loading, fetchData, data.length]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    setNoMoreData(false);
    fetchData(1, true);
  }, [fetchData]);

  return {
    data,
    page,
    loading,
    loadingMore,
    refreshing,
    noMoreData,
    handleLoadMore,
    handleRefresh,
    fetchData,
    setData,
  };
}
