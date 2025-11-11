import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import CustomHeader from '../../../../components/CustomHeader';
import icons from '../../../../assets/icons';
import { getData, getLocation, getPickerData } from '../../../../services/data';
import { spacing } from '../../../../utils/spacing';
import { navigate } from '../../../../navigation/RootNavigator';
import { Screen_Name } from '../../../../navigation/ScreenName';
import AppStyles from '../../../../components/AppStyle';
import { mapFieldType, renderField } from '../../../../utils/formField';
import { pick } from '@react-native-documents/picker';
import * as ImagePicker from 'react-native-image-picker';

const DetailContract = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [field, setField] = useState<any>(null);
  const [contractData, setContractData] = useState<any>(null);
  const [locationData, setLocationData] = useState<any>(null);
  const [datePickerField, setDatePickerField] = useState(null);
  const [openMonth, setOpenMonth] = useState(false);
  const [open, setOpen] = useState(false);
  const [pickerField, setPickerField] = useState<string | null>(null);
  const [displayField, setDisplayField] = useState<string | null>(null);
  const [pickerData, setPickerData] = useState<any>({ pageData: [] });
  const [pickerConfig, setPickerConfig] = useState(null);
  const [openLocationModal, setOpenLocationModal] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);
  const [pickerPage, setPickerPage] = useState(1);
  const [pickerType, setPickerType] = useState<'SelectOne' | 'SelectMany'>(
    'SelectOne',
  );
  const [hasMore, setHasMore] = useState(false);

  const [expandedSections, setExpandedSections] = useState<{
    [key: number]: boolean;
  }>({});
  const [changedFields, setChangedFields] = useState<
    { fieldName: string; fieldValue: any }[]
  >([]);
  const [customConfigs, setCustomConfigs] = useState<
    { fieldName: string; config: any }[]
  >([]);
  const [pickedFiles, setPickedFiles] = useState<
    { fieldName: string; file: {} }[]
  >([]);
  const getLayoutContract = async () => {
    try {
      // const response = await fetch('API_ENDPOINT_HERE');
      // const data = await response.json();
      // Process the data as needed
    } catch (error) {
      console.error('Error fetching contract layout:', error);
    } finally {
      // Any cleanup or final steps
    }
  };

  useEffect(() => {
    fetchFieldData();
    getLayoutContract();
  }, []);

  const fetchFieldData = async () => {
    try {
      setLoading(true);
      const data = await getData('profile');
      setField(data);

      // Khởi tạo expandedSections cho tất cả parentId
      if (data && data.pageData) {
        const parents = data.pageData.filter(item => item.parentId === null);
        const expandedInit = {};
        parents.forEach(parent => {
          expandedInit[parent.id] = false; // hoặc false nếu muốn mặc định thu gọn
        });
        setExpandedSections(expandedInit);
      }
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContractData = async () => {
    try {
      setLoading(true);
      // const data = await getContract(contractId);
      // setContractData(data);
    } catch (error) {
      console.log('Error fetching contract data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (id: number) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleChange = (fieldName: string, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));

    setChangedFields(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const idx = safePrev.findIndex(f => f.fieldName === fieldName);
      if (idx !== -1) {
        const updated = [...safePrev];
        updated[idx] = { fieldName, fieldValue: value };
        return updated;
      }
      return [...safePrev, { fieldName, fieldValue: value }];
    });
  };

  const handlePickSelect = async (fieldName, cfg, selectedIds = []) => {
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
  const handlePickFile = async fieldName => {
    try {
      const res = await pick({
        allowMultiSelection: false,
        type: ['*/*'],
      });

      if (res && res.length > 0) {
        const file = res[0];

        // Tìm displayField
        const allConfigs =
          field?.pageData?.flatMap(parent => parent.groupFieldConfigs || []) ||
          [];
        const fieldConfig = allConfigs.find(cfg => cfg.fieldName === fieldName);
        const displayFieldName = fieldConfig?.displayField;

        // Xóa file cũ trong pickedFiles nếu có
        setPickedFiles(prev => {
          const updated = [
            ...prev.filter(f => f.fieldName !== fieldName),
            { fieldName, file: { ...file } },
          ];
          console.log('pickedFiles after select:', updated);
          return updated;
        });

        // Cập nhật formData để hiển thị tên file
        setFormData(prev => {
          const updated = {
            ...prev,
            [fieldName]: file,
          };
          if (displayFieldName) {
            updated[displayFieldName] = file.name;
          }
          return updated;
        });

        // Cập nhật changedFields
        setChangedFields(prev => {
          const safePrev = Array.isArray(prev) ? prev : [];
          const filtered = safePrev.filter(
            f => f.fieldName !== fieldName && f.fieldName !== displayFieldName,
          );
          return [
            ...filtered,
            { fieldName, fieldValue: file.uri },
            ...(displayFieldName
              ? [{ fieldName: displayFieldName, fieldValue: file.name }]
              : []),
          ];
        });
      }
    } catch (err) {
      console.error('Error picking file:', err);
      Alert.alert('Lỗi', 'Không thể chọn file');
    }
  };
  const handlePickImage = async fieldName => {
    const result = await ImagePicker.launchImageLibrary({ mediaType: 'photo' });
    if (result.assets && result.assets.length > 0) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: { uri: result.assets[0].uri },
      }));
    }
  };

  const handleClearFile = (fieldName: string) => {
    // Tìm config của field để lấy displayField
    const allConfigs =
      field?.pageData?.flatMap(parent => parent.groupFieldConfigs || []) || [];
    const fieldConfig = allConfigs.find(cfg => cfg.fieldName === fieldName);
    const displayFieldName = fieldConfig?.displayField;

    // Xóa khỏi pickedFiles
    setPickedFiles(prev => prev.filter(f => f.fieldName !== fieldName));

    // Xóa khỏi formData
    setFormData(prev => {
      const updated = { ...prev, [fieldName]: null };
      if (displayFieldName) {
        updated[displayFieldName] = null;
      }
      return updated;
    });

    // Xóa khỏi changedFields
    setChangedFields(prev =>
      prev.filter(
        f => f.fieldName !== fieldName && f.fieldName !== displayFieldName,
      ),
    );
  };

  const handlePickLocation = async (fieldName, cfg) => {
    setPickerField(fieldName);
    setDisplayField(cfg.displayField);
    setPickerConfig(cfg);
    console.log('ghjfkjfyuj');

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

    console.log('Location picker config:', cfg);
    console.log('formData for location picker:', formData);
    console.log('customConfigs for location picker:', customConfigs);
    console.log('customConfig string:', cfg.customConfig);
    console.log('countryIdParam:', countryIdParam);
    console.log('provinceIdParam:', provinceIdParam);

    if (customConfig.FieldParam) {
      // Tìm fieldName ứng với FieldParam
      // Ví dụ FieldParam: 'countryId' => tìm field có fieldName chứa 'CountryID'
      const paramFieldName = Object.keys(formData).find(key =>
        key.toLowerCase().includes(customConfig.FieldParam.toLowerCase()),
      );
      console.log('paramFieldName for location picker:', paramFieldName);

      const allConfigs =
        field?.pageData?.flatMap(parent => parent.groupFieldConfigs || []) ||
        [];

      // Tìm cfg có fieldName === paramFieldName
      const paramFieldConfig = allConfigs.find(
        cfg => cfg.fieldName === paramFieldName,
      );

      console.log('paramFieldConfig:', paramFieldConfig);

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
          `Vui lòng chọn ${paramFieldConfig.label} trước`,
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

  const handlePickDate = fieldName => {
    setDatePickerField(fieldName);
    setOpen(true); // Thêm dòng này để mở DatePicker
  };

  const handlePickMonth = fieldName => {
    setDatePickerField(fieldName);
    setOpenMonth(true);
  };

  const renderFields = () => {
    try {
      if (!field || !field.pageData) return null;
      const parents = field.pageData
        .filter(item => item.parentId === null)
        .sort((a, b) => {
          if ((a.sortOrder || 0) !== (b.sortOrder || 0)) {
            return (a.sortOrder || 0) - (b.sortOrder || 0);
          }
          return (a.columnIndex || 0) - (b.columnIndex || 0);
        });
      return parents.map(parent => {
        const children = field.pageData
          .filter(child => child.parentId === parent.id)
          .sort((a, b) => {
            if ((a.columnIndex || 0) !== (b.columnIndex || 0)) {
              return (a.columnIndex || 0) - (b.columnIndex || 0);
            }
            return (a.sortOrder || 0) - (b.sortOrder || 0);
          });
        const expanded = expandedSections[parent.id] ?? true;
        return (
          <View
            key={parent.id}
            style={{
              marginBottom: 24,
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 8,
            }}
          >
            <TouchableOpacity
              style={styles.section}
              // onPress={() =>
              //   parent.typeEditGroup === '2'
              //     ? toggleSection(parent.id)
              //     : navigate(Screen_Name.Group, {
              //         parent,
              //         contractId,
              //         formData,
              //         customConfigs,
              //       })
              // }
            >
              <Text style={{ fontWeight: 'bold', fontSize: 16, margin: 8 }}>
                {parent.name}
              </Text>
              <Image
                style={[AppStyles.icon]}
                source={expanded ? icons.down : icons.up}
              />
            </TouchableOpacity>

            {/* Nếu parent có groupFieldConfigs thì render luôn ở đây */}
            {expanded &&
              parent.groupFieldConfigs &&
              parent.groupFieldConfigs.length > 0 && (
                <View style={{ marginHorizontal: 16, marginBottom: 8 }}>
                  {parent.groupFieldConfigs
                    .sort((a, b) => {
                      if ((a.columnIndex || 0) !== (b.columnIndex || 0)) {
                        return (a.columnIndex || 0) - (b.columnIndex || 0);
                      }
                      return (a.sortOrder || 0) - (b.sortOrder || 0);
                    })
                    .map(cfg => {
                      const customConfig =
                        customConfigs.find(c => c.fieldName === cfg.fieldName)
                          ?.config || null;

                      return (
                        <View
                          key={cfg.id}
                          style={{ marginHorizontal: 16, marginBottom: 4 }}
                        >
                          <Text style={AppStyles.label}>
                            {cfg.label}
                            {customConfig?.isRequired && (
                              <Text style={{ color: 'red' }}> *</Text>
                            )}
                          </Text>
                          <Text>{`${cfg.typeControl}- ${mapFieldType(
                            cfg.typeControl,
                          )}`}</Text>
                          {renderField(
                            cfg,
                            formData[cfg.fieldName],
                            handleChange,
                            'edit',
                            {
                              formData,
                              onPickDate: fieldName =>
                                handlePickDate(fieldName),
                              onPickMonth: fieldName =>
                                handlePickMonth(fieldName),
                              onPickSelectOne: fieldName => {
                                const locationID = JSON.parse(
                                  cfg.customConfig,
                                ).LocationID;
                                if (locationID === true) {
                                  console.log('abc');

                                  handlePickLocation(fieldName, cfg);
                                } else {
                                  console.log('def');

                                  handlePickSelect(fieldName, cfg);
                                }
                              },
                              onPickSelectMulti: (
                                fieldName,
                                displayField,
                                pickerData,
                                selectedIds,
                              ) => {
                                console.log(
                                  'Opening multiSelect with selectedIds:',
                                  selectedIds,
                                );
                                handlePickSelect(fieldName, cfg, selectedIds);
                              },
                              onPickFile: fieldName =>
                                handlePickFile(fieldName),
                              onPickImage: fieldName =>
                                handlePickImage(fieldName),
                              onClearFile: fieldName =>
                                handleClearFile(fieldName), // Thêm callback này
                            },
                          )}
                        </View>
                      );
                    })}
                </View>
              )}

            {/* Nếu child có groupFieldConfigs thì render luôn ở đây */}
            {expanded &&
              children.map(child => (
                <View
                  key={child.id}
                  style={{ marginHorizontal: 16, marginBottom: 8 }}
                >
                  <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                    {child.name}
                  </Text>
                  {child.groupFieldConfigs
                    .sort((a, b) => {
                      if ((a.columnIndex || 0) !== (b.columnIndex || 0)) {
                        return (a.columnIndex || 0) - (b.columnIndex || 0);
                      }
                      return (a.sortOrder || 0) - (b.sortOrder || 0);
                    })
                    .map(cfg => {
                      // Lấy customConfig từ state
                      const customConfig =
                        customConfigs.find(c => c.fieldName === cfg.fieldName)
                          ?.config || null;

                      return (
                        <View
                          key={cfg.id}
                          style={{ marginHorizontal: 16, marginBottom: 4 }}
                        >
                          <Text style={AppStyles.label}>
                            {cfg.label}
                            {customConfig?.isRequired && (
                              <Text style={{ color: 'red' }}> *</Text>
                            )}
                          </Text>
                          <Text>{`${cfg.typeControl}- ${mapFieldType(
                            cfg.typeControl,
                          )}`}</Text>
                          {renderField(
                            cfg,
                            formData[cfg.fieldName],
                            handleChange,
                            'edit',
                            {
                              formData,
                              onPickDate: fieldName =>
                                handlePickDate(fieldName),
                              onPickMonth: fieldName =>
                                handlePickMonth(fieldName),
                              onPickSelectOne: fieldName => {
                                const locationID = JSON.parse(
                                  cfg.customConfig,
                                ).LocationID;
                                if (locationID === true) {
                                  console.log('abc');

                                  handlePickLocation(fieldName, cfg);
                                } else {
                                  console.log('def');

                                  handlePickSelect(fieldName, cfg);
                                }
                              },
                              onPickSelectMulti: (
                                fieldName,
                                displayField,
                                pickerData,
                                selectedIds,
                              ) => {
                                console.log(
                                  'Opening multiSelect with selectedIds:',
                                  selectedIds,
                                );
                                handlePickSelect(fieldName, cfg, selectedIds);
                              },
                              onPickFile: fieldName =>
                                handlePickFile(fieldName),
                              onPickImage: fieldName =>
                                handlePickImage(fieldName),
                              onClearFile: fieldName =>
                                handleClearFile(fieldName),
                            },
                          )}
                        </View>
                      );
                    })}
                </View>
              ))}
          </View>
        );
      });
    } catch (error) {
      console.error('Error rendering fields:', error);
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        label="Detail Contract"
        leftPress={() => {
          navigation.openDrawer();
        }}
        leftIcon={icons.menu}
      />
      <Text>DetailContract</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
    marginBottom: spacing.medium,
    padding: spacing.medium,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.small,
  },
});

export default DetailContract;
