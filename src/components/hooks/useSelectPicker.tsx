import { useState } from 'react';
import { Alert } from 'react-native';
import {
  getPickerData,
  getLocation,
  getOrganizationTree,
} from '../../services/data';
import { employee_GetAll } from '../../services/hr';

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

  const handlePickOrganization = async (
    fieldName: string,
    displayField: any,
  ) => {
    setOrgFieldName(fieldName);

    setOrgDisplayField(displayField);
    console.log('Organization picker config:', displayField);

    try {
      // Fetch organization tree data từ API
      const res = await getOrganizationTree();
      console.log('Organization tree data:', res);

      // const testData = [
      //   {
      //     id: 6,
      //     orgStructCode: '',
      //     orgStructName: 'test',
      //     orgLevelId: 2,
      //     parentId: null,
      //     orgLevel: {
      //       id: 2,
      //       orgLevelName: 'test1',
      //       orgLevelDesc: 'test',
      //       isActive: false,
      //     },
      //     childrent: [
      //       {
      //         id: 8,
      //         orgStructCode: '',
      //         orgStructName: 'test 1',
      //         orgLevelId: 1,
      //         parentId: 6,
      //         orgLevel: {
      //           id: 1,
      //           orgLevelName: 'string1',
      //           orgLevelDesc: 'string2',
      //           isActive: true,
      //         },
      //         childrent: [],
      //       },
      //       {
      //         id: 9,
      //         orgStructCode: '',
      //         orgStructName: 'cctc con',
      //         orgLevelId: 1,
      //         parentId: 6,
      //         orgLevel: {
      //           id: 1,
      //           orgLevelName: 'string1',
      //           orgLevelDesc: 'string2',
      //           isActive: true,
      //         },
      //         childrent: [
      //           {
      //             id: 13,
      //             orgStructCode: '',
      //             orgStructName: 'child child 1',
      //             orgLevelId: 1,
      //             parentId: 9,
      //             orgLevel: {
      //               id: 1,
      //               orgLevelName: 'Công ty con child child 1',
      //               orgLevelDesc: '',
      //               isActive: true,
      //             },
      //             childrent: [],
      //           },
      //           {
      //             id: 14,
      //             orgStructCode: '',
      //             orgStructName: 'child child 2',
      //             orgLevelId: 1,
      //             parentId: 9,
      //             orgLevel: {
      //               id: 1,
      //               orgLevelName: 'Công ty con child child 2',
      //               orgLevelDesc: '',
      //               isActive: true,
      //             },
      //             childrent: [],
      //           },
      //           {
      //             id: 15,
      //             orgStructCode: '',
      //             orgStructName: 'child child 3',
      //             orgLevelId: 1,
      //             parentId: 9,
      //             orgLevel: {
      //               id: 1,
      //               orgLevelName: 'Công ty con child child 3',
      //               orgLevelDesc: '',
      //               isActive: true,
      //             },
      //             childrent: [],
      //           },
      //         ],
      //       },
      //     ],
      //   },
      //   {
      //     id: 7,
      //     orgStructCode: '',
      //     orgStructName: 'test2',
      //     orgLevelId: 1,
      //     parentId: null,
      //     orgLevel: {
      //       id: 1,
      //       orgLevelName: 'string1',
      //       orgLevelDesc: 'string2',
      //       isActive: true,
      //     },
      //     childrent: [],
      //   },
      //   {
      //     id: 10,
      //     orgStructCode: '',
      //     orgStructName: 'Công ty TNHH FOXAI ',
      //     orgLevelId: 4,
      //     parentId: null,
      //     orgLevel: {
      //       id: 4,
      //       orgLevelName: 'Tổng công ty',
      //       orgLevelDesc: '',
      //       isActive: true,
      //     },
      //     childrent: [
      //       {
      //         id: 11,
      //         orgStructCode: '',
      //         orgStructName: 'FOXAI 1',
      //         orgLevelId: 6,
      //         parentId: 10,
      //         orgLevel: {
      //           id: 6,
      //           orgLevelName: 'Công ty con',
      //           orgLevelDesc: '',
      //           isActive: true,
      //         },
      //         childrent: [],
      //       },
      //     ],
      //   },
      //   {
      //     id: 12,
      //     orgStructCode: '',
      //     orgStructName: 'FOXAI 2',
      //     orgLevelId: 6,
      //     parentId: null,
      //     orgLevel: {
      //       id: 6,
      //       orgLevelName: 'Công ty con',
      //       orgLevelDesc: '',
      //       isActive: true,
      //     },
      //     childrent: [],
      //   },

      //   /* ------------------- 10 PHẦN TỬ THÊM MỚI ------------------- */

      //   {
      //     id: 20,
      //     orgStructCode: '',
      //     orgStructName: 'Khối Sản Xuất',
      //     orgLevelId: 4,
      //     parentId: null,
      //     orgLevel: {
      //       id: 4,
      //       orgLevelName: 'Tổng công ty',
      //       orgLevelDesc: '',
      //       isActive: true,
      //     },
      //     childrent: [
      //       {
      //         id: 21,
      //         orgStructCode: '',
      //         orgStructName: 'Xưởng A',
      //         orgLevelId: 6,
      //         parentId: 20,
      //         orgLevel: {
      //           id: 6,
      //           orgLevelName: 'Công ty con',
      //           orgLevelDesc: '',
      //           isActive: true,
      //         },
      //         childrent: [
      //           {
      //             id: 22,
      //             orgStructCode: '',
      //             orgStructName: 'Tổ Máy 1',
      //             orgLevelId: 1,
      //             parentId: 21,
      //             orgLevel: {
      //               id: 1,
      //               orgLevelName: 'string1',
      //               orgLevelDesc: 'string2',
      //               isActive: true,
      //             },
      //             childrent: [],
      //           },
      //         ],
      //       },
      //       {
      //         id: 23,
      //         orgStructCode: '',
      //         orgStructName: 'Xưởng B',
      //         orgLevelId: 6,
      //         parentId: 20,
      //         orgLevel: {
      //           id: 6,
      //           orgLevelName: 'Công ty con',
      //           orgLevelDesc: '',
      //           isActive: true,
      //         },
      //         childrent: [],
      //       },
      //     ],
      //   },

      //   {
      //     id: 24,
      //     orgStructCode: '',
      //     orgStructName: 'Khối Hành Chính',
      //     orgLevelId: 4,
      //     parentId: null,
      //     orgLevel: {
      //       id: 4,
      //       orgLevelName: 'Tổng công ty',
      //       orgLevelDesc: '',
      //       isActive: true,
      //     },
      //     childrent: [
      //       {
      //         id: 25,
      //         orgStructCode: '',
      //         orgStructName: 'Phòng Nhân Sự',
      //         orgLevelId: 1,
      //         parentId: 24,
      //         orgLevel: {
      //           id: 1,
      //           orgLevelName: 'string1',
      //           orgLevelDesc: 'string2',
      //           isActive: true,
      //         },
      //         childrent: [],
      //       },
      //       {
      //         id: 26,
      //         orgStructCode: '',
      //         orgStructName: 'Phòng Hành Chính Tổng Hợp',
      //         orgLevelId: 1,
      //         parentId: 24,
      //         orgLevel: {
      //           id: 1,
      //           orgLevelName: 'string1',
      //           orgLevelDesc: 'string2',
      //           isActive: true,
      //         },
      //         childrent: [
      //           {
      //             id: 27,
      //             orgStructCode: '',
      //             orgStructName: 'Tổ Văn Thư',
      //             orgLevelId: 1,
      //             parentId: 26,
      //             orgLevel: {
      //               id: 1,
      //               orgLevelName: 'string1',
      //               orgLevelDesc: 'string2',
      //               isActive: true,
      //             },
      //             childrent: [],
      //           },
      //         ],
      //       },
      //     ],
      //   },

      //   {
      //     id: 28,
      //     orgStructCode: '',
      //     orgStructName: 'Khối Kinh Doanh',
      //     orgLevelId: 4,
      //     parentId: null,
      //     orgLevel: {
      //       id: 4,
      //       orgLevelName: 'Tổng công ty',
      //       orgLevelDesc: '',
      //       isActive: true,
      //     },
      //     childrent: [
      //       {
      //         id: 29,
      //         orgStructCode: '',
      //         orgStructName: 'Phòng Sales 1',
      //         orgLevelId: 1,
      //         parentId: 28,
      //         orgLevel: {
      //           id: 1,
      //           orgLevelName: 'string1',
      //           orgLevelDesc: 'string2',
      //           isActive: true,
      //         },
      //         childrent: [],
      //       },
      //       {
      //         id: 30,
      //         orgStructCode: '',
      //         orgStructName: 'Phòng Sales 2',
      //         orgLevelId: 1,
      //         parentId: 28,
      //         orgLevel: {
      //           id: 1,
      //           orgLevelName: 'string1',
      //           orgLevelDesc: 'string2',
      //           isActive: true,
      //         },
      //         childrent: [
      //           {
      //             id: 31,
      //             orgStructCode: '',
      //             orgStructName: 'Nhóm Tư vấn',
      //             orgLevelId: 1,
      //             parentId: 30,
      //             orgLevel: {
      //               id: 1,
      //               orgLevelName: 'string1',
      //               orgLevelDesc: 'string2',
      //               isActive: true,
      //             },
      //             childrent: [],
      //           },
      //         ],
      //       },
      //     ],
      //   },
      // ];

      // setOrgTreeData(res.data);
      setOrgTreeData(res.data);
      console.log('Set organization tree data:', res.data);

      setShowOrgTree(true);
    } catch (error) {
      console.error('Error loading organization tree:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách tổ chức');
    }
  };

  const handleSearch = async (keyword: string) => {
    try {
      // Gọi API với param search
      const res = await getOrganizationTree(keyword);
      console.log('Search organization tree with keyword:', keyword, res);

      // Update tree data với kết quả search
      setOrgTreeData(res.data || res);
    } catch (error) {
      console.error('Error searching organization tree:', error);
      Alert.alert('Lỗi', 'Không thể tìm kiếm tổ chức');
    }
  };

  return {
    showOrgTree,
    orgTreeData,
    orgFieldName,
    orgDisplayField,
    handlePickOrganization,
    handleSearch,
    setShowOrgTree,
  };
};

export const useEmployeePicker = () => {
  const [showEmployeePicker, setShowEmployeePicker] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);
  const [pickerField, setPickerField] = useState('');
  const [displayField, setDisplayField] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false); // Loading khi load more
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [currentKeyword, setCurrentKeyword] = useState(''); // Lưu keyword hiện tại

  // Mở modal và load danh sách nhân viên
  const handlePickEmployee = async (fieldName, displayFieldName, cfg) => {
    setPickerField(fieldName);
    setDisplayField(displayFieldName);
    setPage(1);
    setCurrentKeyword(''); // Reset keyword
    setShowEmployeePicker(true);
    await fetchEmployees('', 1, true);
  };

  // Tìm kiếm nhân viên
  const handleSearch = async (keyword: string) => {
    setCurrentKeyword(keyword); // Lưu keyword
    setPage(1);
    await fetchEmployees(keyword, 1, true);
  };

  // Hàm lấy danh sách nhân viên từ API
  const PAGE_SIZE = 20;

  const fetchEmployees = async (
    keyword: string,
    pageNum: number = 1,
    reset: boolean = false,
    fieldColumns: string = 'EmployeeCode,FullName,JobPositionID',
  ) => {
    try {
      // Nếu reset = true thì là load mới, ngược lại là load more
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await employee_GetAll({
        paramQuery: {
          page: pageNum,
          pageSize: PAGE_SIZE,
          filter: '', // để rỗng hoặc truyền filter nếu có
          search: keyword,
          orderBy: '', // để rỗng hoặc truyền orderBy nếu có
          sortOrder: '', // để rỗng hoặc truyền sortOrder nếu có
        },
        fieldColumns,
      });

      const newData = response?.data?.pageData || response?.pageData || [];
      if (reset) {
        setEmployeeData(newData);
      } else {
        setEmployeeData(prev => [...prev, ...newData]);
      }

      const totalCount =
        response?.data?.totalCount || response?.totalCount || 0;
      setHasMore(pageNum * PAGE_SIZE < totalCount);
    } catch (error) {
      console.error('Error fetching employees:', error);
      if (reset) setEmployeeData([]);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };
  // Load more khi scroll đến cuối
  const handleLoadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchEmployees(currentKeyword, nextPage, false); // Truyền keyword hiện tại
    }
  };

  return {
    showEmployeePicker,
    setShowEmployeePicker,
    employeeData,
    pickerField,
    displayField,
    handlePickEmployee,
    handleSearch,
    loading,
    loadingMore,
    hasMore,
    handleLoadMore,
  };
};
