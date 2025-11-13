import { useState } from 'react';
import { Alert } from 'react-native';
import {
  getPickerData,
  getLocation,
  getOrganizationTree,
} from '../../services/data';

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

export const useOrganizationPicker = () => {
  const [showOrgTree, setShowOrgTree] = useState(false);
  const [orgTreeData, setOrgTreeData] = useState([]);
  const [orgFieldName, setOrgFieldName] = useState('');
  const [orgDisplayField, setOrgDisplayField] = useState('');

  const handlePickOrganization = async (fieldName: string, cfg: any) => {
    setOrgFieldName(fieldName);
    setOrgDisplayField(cfg?.displayField || '');

    try {
      // Fetch organization tree data từ API
      const res = await getOrganizationTree();
      console.log('Organization tree data:', res);

      const testData = [
        {
          id: 6,
          orgStructCode: '',
          orgStructName: 'test',
          orgLevelId: 2,
          parentId: null,
          orgLevel: {
            id: 2,
            orgLevelName: 'test1',
            orgLevelDesc: 'test',
            isActive: false,
          },
          childrent: [
            {
              id: 8,
              orgStructCode: '',
              orgStructName: 'test 1',
              orgLevelId: 1,
              parentId: 6,
              orgLevel: {
                id: 1,
                orgLevelName: 'string1',
                orgLevelDesc: 'string2',
                isActive: true,
              },
              childrent: [],
            },
            {
              id: 9,
              orgStructCode: '',
              orgStructName: 'cctc con',
              orgLevelId: 1,
              parentId: 6,
              orgLevel: {
                id: 1,
                orgLevelName: 'string1',
                orgLevelDesc: 'string2',
                isActive: true,
              },
              childrent: [
                {
                  id: 13,
                  orgStructCode: '',
                  orgStructName: 'child child 1',
                  orgLevelId: 1,
                  parentId: 9,
                  orgLevel: {
                    id: 1,
                    orgLevelName: 'Công ty con child child 1',
                    orgLevelDesc: '',
                    isActive: true,
                  },
                  childrent: [],
                },
                {
                  id: 14,
                  orgStructCode: '',
                  orgStructName: 'child child 2',
                  orgLevelId: 1,
                  parentId: 9,
                  orgLevel: {
                    id: 1,
                    orgLevelName: 'Công ty con child child 2',
                    orgLevelDesc: '',
                    isActive: true,
                  },
                  childrent: [],
                },
                {
                  id: 15,
                  orgStructCode: '',
                  orgStructName: 'child child 3',
                  orgLevelId: 1,
                  parentId: 9,
                  orgLevel: {
                    id: 1,
                    orgLevelName: 'Công ty con child child 3',
                    orgLevelDesc: '',
                    isActive: true,
                  },
                  childrent: [],
                },
              ],
            },
          ],
        },
        {
          id: 7,
          orgStructCode: '',
          orgStructName: 'test2',
          orgLevelId: 1,
          parentId: null,
          orgLevel: {
            id: 1,
            orgLevelName: 'string1',
            orgLevelDesc: 'string2',
            isActive: true,
          },
          childrent: [],
        },
        {
          id: 10,
          orgStructCode: '',
          orgStructName: 'Công ty TNHH FOXAI ',
          orgLevelId: 4,
          parentId: null,
          orgLevel: {
            id: 4,
            orgLevelName: 'Tổng công ty',
            orgLevelDesc: '',
            isActive: true,
          },
          childrent: [
            {
              id: 11,
              orgStructCode: '',
              orgStructName: 'FOXAI 1',
              orgLevelId: 6,
              parentId: 10,
              orgLevel: {
                id: 6,
                orgLevelName: 'Công ty con',
                orgLevelDesc: '',
                isActive: true,
              },
              childrent: [],
            },
          ],
        },
        {
          id: 12,
          orgStructCode: '',
          orgStructName: 'FOXAI 2',
          orgLevelId: 6,
          parentId: null,
          orgLevel: {
            id: 6,
            orgLevelName: 'Công ty con',
            orgLevelDesc: '',
            isActive: true,
          },
          childrent: [],
        },
      ];

      // setOrgTreeData(res.data);
      setOrgTreeData(testData);
      console.log('Set organization tree data:', testData);

      setShowOrgTree(true);
    } catch (error) {
      console.error('Error loading organization tree:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách tổ chức');
    }
  };

  return {
    showOrgTree,
    orgTreeData,
    orgFieldName,
    orgDisplayField,
    handlePickOrganization,
    setShowOrgTree,
  };
};
