import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import CustomHeader from '../../../navigation/CustomHeader';
import { ScrollView } from 'react-native-gesture-handler';
import { spacing } from '../../../utils/spacing';
import { mapFieldType, renderField } from '../../../utils/formField';
import DatePicker from 'react-native-date-picker';
import MonthPicker from 'react-native-month-year-picker';
import {
  dataTest,
  getData,
  getEmployee,
  getPickerData,
} from '../../../services/data';
import AppStyles from '../../../components/AppStyle';
import icons from '../../../assets/icons';
import { Modal } from 'react-native';
import ModalPicker from '../../../components/modal/ModalPicker';

const Test = () => {
  const [field, setField] = useState<any>();
  const [formData, setFormData] = useState({});
  const [testData, setTestData] = useState(dataTest);
  const [date, setDate] = useState(new Date());
  const [openMonth, setOpenMonth] = useState(false);
  const [open, setOpen] = useState(false);
  const [pickerField, setPickerField] = useState<string | null>(null);
  const [pickerData, setPickerData] = useState<any>({ pageData: [] });
  const [openPicker, setOpenPicker] = useState(false);
  const [datePickerField, setDatePickerField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{
    [key: number]: boolean;
  }>({});
  const [pickerType, setPickerType] = useState<'selectOne' | 'selectMulti'>(
    'selectOne',
  );
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [pickerConfig, setPickerConfig] = useState(null);
  const [pickerPage, setPickerPage] = useState(1);

  // console.log('test render', testData);

  useEffect(() => {
    fetchData();
    fetchAllData();
  }, []); // Chỉ gọi API khi mount

  const fetchData = async () => {
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

      console.log('Fetched data:', data);
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const layout = testData; // hoặc await getData('profile');
      const employeeData = await getEmployee(6);
      const formData = mapEmployeeToFormData(layout, employeeData);
      setField(layout);
      setFormData(formData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handlePickDate = fieldName => {
    setDatePickerField(fieldName);
    setOpen(true); // Thêm dòng này để mở DatePicker
  };

  const handlePickMonth = fieldName => {
    setDatePickerField(fieldName);
    setOpenMonth(true);
  };

  const getDatePickerMode = () => {
    if (!datePickerField) return 'date';
    if (!field) return 'date';
    if (field.DataType === 6) return 'month';
    return 'date';
  };

  const handlePickSelect = async (fieldName, cfg) => {
    setPickerField(fieldName);
    setPickerConfig(cfg);
    setPickerPage(1);

    // Mở modal ngay lập tức với dữ liệu rỗng
    setPickerData({ pageData: [] }); // Reset dữ liệu cũ với đúng structure
    setOpenPicker(true);

    // Load dữ liệu trong background
    try {
      let data = [];
      if (cfg.tableNameSource === 'PickList') {
        data = await getPickerData(
          cfg.tableNameSource,
          { page: 1, pageSize: 10, filter: '', orderBy: '', search: '' },
          cfg,
        );
        setHasMore(data.length === 10);
      }
      console.log('Picker data:', data);
      setPickerData(data); // Wrap data trong pageData
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
      pickerConfig.tableNameSource,
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

  const toggleSection = (id: number) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const mapEmployeeToFormData = (layout, employeeData) => {
    const formData = {};
    layout?.pageData?.forEach(parent => {
      parent.groupFieldConfigs?.forEach(cfg => {
        if (employeeData.hasOwnProperty(cfg.fieldName)) {
          formData[cfg.fieldName] = employeeData[cfg.fieldName];
        } else if (cfg.defaultValue) {
          try {
            const def =
              typeof cfg.defaultValue === 'string'
                ? JSON.parse(cfg.defaultValue)
                : cfg.defaultValue;
            formData[cfg.fieldName] = def.id ?? def;
          } catch (e) {
            formData[cfg.fieldName] = cfg.defaultValue;
          }
        } else {
          formData[cfg.fieldName] = '';
        }
      });
    });
    return formData;
  };

  const getDefaultId = cfg => {
    if (!cfg.defaultValue) return undefined;
    try {
      const def =
        typeof cfg.defaultValue === 'string'
          ? JSON.parse(cfg.defaultValue)
          : cfg.defaultValue;

      // Chọn 1
      if (mapFieldType(cfg.typeControl) === 'selectOne') {
        return def.id;
      }
      // Chọn nhiều
      if (mapFieldType(cfg.typeControl) === 'selectMulti') {
        const arr = Array.isArray(def) ? def : [def];
        return arr.map(item => item.id);
      }
    } catch (e) {
      return undefined;
    }
  };

  const renderFields = () => {
    try {
      if (!field || !field.pageData) return null;
      const parents = field.pageData.filter(item => item.parentId === null);
      return parents.map(parent => {
        const children = field.pageData.filter(
          child => child.parentId === parent.id,
        );
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
              onPress={() => toggleSection(parent.id)}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 16, margin: 8 }}>
                {parent.name}
              </Text>
              <Image
                style={[AppStyles.icon]}
                source={expanded ? icons.down : icons.up}
              />
            </TouchableOpacity>
            {expanded &&
              children.map(child => (
                <View
                  key={child.id}
                  style={{ marginHorizontal: 16, marginBottom: 8 }}
                >
                  <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                    {child.name}
                  </Text>
                  {child.groupFieldConfigs?.map(cfg => (
                    <View
                      key={cfg.id}
                      style={{ marginHorizontal: 16, marginBottom: 4 }}
                    >
                      <Text style={AppStyles.label}>{cfg.label}</Text>
                      <Text>{`${cfg.typeControl}- ${mapFieldType(
                        cfg.typeControl,
                      )}`}</Text>
                      {renderField(
                        cfg,
                        formData[cfg.fieldName],
                        handleChange,
                        'edit',
                        {
                          onPickDate: fieldName => handlePickDate(fieldName),
                          onPickMonth: fieldName => handlePickMonth(fieldName),
                          onPickSelectOne: (fieldName, pickerData) =>
                            handlePickSelect(fieldName, cfg),
                          onPickSelectMulti: (fieldName, pickerData) =>
                            handlePickSelect(fieldName, cfg),
                        },
                      )}
                    </View>
                  ))}
                </View>
              ))}
          </View>
        );
      });
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      <CustomHeader label="Test Screen" />
      <ScrollView style={styles.scrollView}>{renderFields()}</ScrollView>

      {/* Date Picker cho kiểu ngày */}
      <DatePicker
        modal
        mode="date"
        open={open}
        date={date}
        onConfirm={selectedDate => {
          setOpen(false);
          setDate(selectedDate);
          if (datePickerField) {
            handleChange(datePickerField, selectedDate);
          }
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />

      {/* Month Picker cho kiểu tháng */}
      {openMonth && (
        <MonthPicker
          onChange={(event, selectedDate) => {
            setOpenMonth(false);
            if (event === 'dateSetAction' && selectedDate && datePickerField) {
              handleChange(datePickerField, {
                month: selectedDate.getMonth() + 1,
                year: selectedDate.getFullYear(),
              });
            }
          }}
          value={date}
          locale="vi"
        />
      )}
      {openPicker && (
        <ModalPicker
          visible={openPicker}
          data={pickerData}
          selectedValue={formData[pickerField]}
          onSelect={value => handleChange(pickerField, value)}
          onClose={() => setOpenPicker(false)}
          multi={pickerType === 'selectMulti'}
          onLoadMore={handleLoadMore}
          loadingMore={loadingMore}
          hasMore={hasMore}
        />
      )}
      {loading && (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <ActivityIndicator size="large" color="#E53935" />
        </View>
      )}
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

export default Test;
