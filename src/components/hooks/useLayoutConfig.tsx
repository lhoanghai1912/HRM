import { useState, useEffect } from 'react';
import { getLayout } from '../../services/data';

export const useLayoutConfig = (layoutName: string) => {
  const [layoutConfig, setLayoutConfig] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLayoutConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getLayout(layoutName);

      if (response && response.pageData) {
        setLayoutConfig(response.pageData);
      } else {
        setLayoutConfig(response);
      }
    } catch (err) {
      console.error('Error fetching layout config:', err);
      setError(err?.message || 'Lỗi khi tải cấu hình layout');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (layoutName) {
      fetchLayoutConfig();
    }
  }, [layoutName]);

  return {
    layoutConfig,
    loading,
    error,
    refetch: fetchLayoutConfig,
  };
};
