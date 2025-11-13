import { useState } from 'react';
import { Alert } from 'react-native';
import { getPickerData, getLocation } from '../../services/data';

export const useSelectPicker = () => {
  const [pickerField, setPickerField] = useState<string | null>(null);
  const [displayField, setDisplayField] = useState<string | null>(null);
  const [pickerData, setPickerData] = useState<any>({ pageData: [] });
  const [openPicker, setOpenPicker] = useState(false);
  const [pickerType, setPickerType] = useState<'SelectOne' | 'SelectMany'>(
    'SelectOne',
  );
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [pickerConfig, setPickerConfig] = useState(null);
  const [pickerPage, setPickerPage] = useState(1);

  const [showOrgTree, setShowOrgTree] = useState(false);
  const [orgTreeData, setOrgTreeData] = useState([]);
  const [orgFieldName, setOrgFieldName] = useState('');
  const handlePickSelect = async (
    fieldName: string,
    cfg: any,
    selectedIds = [],
  ) => {
    setPickerField(fieldName);
    setDisplayField(cfg.displayField);
    setPickerConfig(cfg);
    setPickerPage(1);
    setPickerType(cfg.typeControl);

    // Mở modal ngay với selectedValue đúng format
    setPickerData({ pageData: [] });
    setOpenPicker(true);

    // Load dữ liệu
    try {
      const data = await getPickerData(
        { page: 1, pageSize: 10, filter: '', orderBy: '', search: '' },
        cfg,
      );
      setHasMore(data.length === 10);
      setPickerData(data);
    } catch (error) {
      console.error('Error loading picker data:', error);
      setPickerData({ pageData: [] });
    }
  };

  const handleLoadMore = async () => {
    if (!pickerConfig) return;
    const nextPage = pickerPage + 1;
    setLoadingMore(true);
    const moreData = await getPickerData(
      { page: nextPage, pageSize: 10, filter: '', orderBy: '', search: '' },
      pickerConfig,
    );
    setPickerData(prev => ({
      pageData: [...(prev.pageData || []), ...moreData],
    }));
    setHasMore(moreData.length === 10);
    setPickerPage(nextPage);
    setLoadingMore(false);
  };

  return {
    pickerField,
    displayField,
    pickerData,
    openPicker,
    pickerType,
    loadingMore,
    hasMore,
    pickerConfig,
    handlePickSelect,
    handleLoadMore,
    setOpenPicker,
  };
};

export const useLocationPicker = (field: any, formData: any) => {
  const [pickerField, setPickerField] = useState<string | null>(null);
  const [displayField, setDisplayField] = useState<string | null>(null);
  const [openLocationModal, setOpenLocationModal] = useState(false);
  const [locationData, setLocationData] = useState<any>(null);
  const [pickerConfig, setPickerConfig] = useState(null);

  const handlePickLocation = async (fieldName: string, cfg: any) => {
    setPickerField(fieldName);
    setDisplayField(cfg.displayField);
    setPickerConfig(cfg);

    // Parse customConfig để lấy FieldParam và FieldConfigDependent
    let customConfig: any = {};
    try {
      customConfig = cfg.customConfig ? JSON.parse(cfg.customConfig) : {};
    } catch (e) {
      console.log('Error parsing customConfig:', e);
    }

    // Xác định giá trị param cần truyền cho API
    let countryIdParam = null;
    let provinceIdParam = null;

    if (customConfig.FieldParam) {
      // Tìm fieldName ứng với FieldParam
      const paramFieldName = Object.keys(formData).find(key =>
        key.toLowerCase().includes(customConfig.FieldParam.toLowerCase()),
      );

      const allConfigs =
        field?.pageData?.flatMap(parent => parent.groupFieldConfigs || []) ||
        [];

      // Tìm cfg có fieldName === paramFieldName
      const paramFieldConfig = allConfigs.find(
        cfg => cfg.fieldName === paramFieldName,
      );

      const paramValue = paramFieldName ? formData[paramFieldName] : null;

      if (customConfig.FieldParam === 'countryId') {
        countryIdParam = paramValue;
      }
      if (customConfig.FieldParam === 'provinceId') {
        provinceIdParam = paramValue;
      }

      const dependentValue = formData[customConfig.FieldConfigDependent];
      if (!dependentValue) {
        Alert.alert(
          'Thông báo',
          `Vui lòng chọn ${
            paramFieldConfig?.label || 'trường phụ thuộc'
          } trước`,
        );
        return;
      }
    }

    setLocationData([]);
    setOpenLocationModal(true);

    // Load dữ liệu trong background
    try {
      const param = {
        page: 1,
        pageSize: 100,
        filter: '',
        orderBy: '',
        search: '',
      };
      const data = await getLocation(param, countryIdParam, provinceIdParam);
      setLocationData(data?.pageData || data || []);
    } catch (error) {
      console.error('Error loading location data:', error);
      setLocationData([]);
    }
  };

  return {
    pickerField,
    displayField,
    openLocationModal,
    locationData,
    pickerConfig,
    handlePickLocation,
    setOpenLocationModal,
  };
};
