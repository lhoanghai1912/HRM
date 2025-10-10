import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NavBar from '../../components/Navbar';
import { useTranslation } from 'react-i18next';
import {
  form_employee,
  picker_educationLevel,
  picker_gender,
  picker_levelName,
  picker_maritalStatus,
  picker_region,
} from '../../utils/form';
import AppInput from '../../components/AppInput';
import AppStyles from '../../components/AppStyle';
import { ms, spacing } from '../../utils/spacing';
import { colors } from '../../utils/color';
import DatePicker from 'react-native-date-picker';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import AppButton from '../../components/AppButton';
import { employee_Create } from '../../services/hr';
import { fonts } from '../../utils/fontSize';
import Toast from 'react-native-toast-message';
import { navigate } from '../../navigation/RootNavigator';
import { Screen_Name } from '../../navigation/ScreenName';
const AddEmployee = ({ route, navigation }: any) => {
  const existing = route?.params?.employee || {};
  const inset = useSafeAreaInsets();
  const { t } = useTranslation();

  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [activeDateKey, setActiveDateKey] = useState<string | null>(null);

  const [form, setForm] = useState<Record<string, string>>(() => {
    const obj: Record<string, string> = {};
    form_employee(t).forEach(({ key, value }) => {
      obj[key] = existing[key] ?? value; // nếu có giá trị cũ thì gán, ko thì để ''
    });
    return obj;
  });

  const setValue = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const displayDate = (val: string) => {
    if (!val) return '';
    return moment(val).format('DD/MM/YYYY');
  };

  const openPickerFor = (key: string) => {
    setActiveDateKey(key);
    // nếu input đã có giá trị hợp lệ → parse ra Date để hiển thị
    const current = form[key];
    setDate(current ? new Date(current) : new Date());
    setOpenDatePicker(true);
  };

  const handleConfrim = async () => {
    const payload: any = { ...form };

    console.log('form', payload);

    if (payload.awardedYear) payload.awardedYear = Number(payload.awardedYear); // "2024" -> 2024

    // các date string khác vẫn giữ ISO (đã set bằng toISOString())
    const res = await employee_Create(payload);
    console.log('api back', res);
    Toast.show({
      type: 'success',
      text2: `${t(`message.create_success`)}`,
    });
    navigate(Screen_Name.BottomTab_Navigator);
  };

  return (
    <View style={[styles.container]}>
      <NavBar
        title={t(`label.hr_add_employee`)}
        onPress={() => navigation.goBack()}
      />
      <ScrollView style={styles.form}>
        {form_employee(t).map(({ key, label, type }) => (
          <View key={key} style={styles.form_item}>
            <Text style={AppStyles.label}>{label}</Text>

            {type === 'date' ? (
              <TouchableOpacity
                onPress={() => openPickerFor(key)}
                activeOpacity={0.8}
              >
                <AppInput
                  editable={false}
                  value={displayDate(form[key])}
                  placeholder="DD/MM/YYYY"
                />
              </TouchableOpacity>
            ) : type === 'picker' ? (
              <View
                style={{
                  borderRadius: 15,
                  borderWidth: 0.5,
                  paddingLeft: spacing.small,
                  overflow: 'hidden',
                }}
              >
                <Picker
                  selectedValue={form[key] ?? ''}
                  onValueChange={(val: string) => setValue(key, val)}
                  style={{ height: ms(54), fontSize: fonts.normal }} // giảm chiều cao
                >
                  {/* Placeholder hiển thị khi value = "" */}
                  <Picker.Item
                    label={
                      key === 'genderName'
                        ? t('label.pickGender') // "Chọn giới tính"
                        : key === 'maritalStatusName'
                        ? t('label.pickMaritalStatus') // "Chọn tình trạng hôn nhân"
                        : key === 'nationalityName'
                        ? t('label.pickCountry') // "Chọn quốc gia"
                        : key === 'educationLevel'
                        ? t('label.pickEducationLevel') // "Chọn trình độ"
                        : key === 'levelName'
                        ? t('label.pickLevelName')
                        : t('label.pickLevelName')
                    }
                    value=""
                    color="#999"
                  />

                  {(key === 'genderName'
                    ? picker_gender
                    : key === 'maritalStatusName'
                    ? picker_maritalStatus
                    : key === 'nationalityName'
                    ? picker_region
                    : key === 'educationLevel'
                    ? picker_educationLevel
                    : key === 'levelName'
                    ? picker_levelName
                    : picker_levelName)(t).map(opt => (
                    <Picker.Item
                      key={opt.value}
                      label={opt.label}
                      value={opt.value}
                    />
                  ))}
                </Picker>
              </View>
            ) : (
              <AppInput
                placeholder={label}
                value={form[key] ?? ''}
                onChangeText={text => setValue(key, text)}
                keyboardType={type === 'email' ? 'email-address' : 'default'}
                autoCapitalize="none"
              />
            )}
          </View>
        ))}
        <AppButton
          title={t(`button.confirm`)}
          onPress={() => handleConfrim()}
          customStyle={{ marginBottom: inset.bottom }}
        />
      </ScrollView>
      <DatePicker
        modal
        mode="date"
        open={openDatePicker}
        date={date}
        onConfirm={picked => {
          setOpenDatePicker(false);
          setDate(picked);
          if (activeDateKey) {
            // lưu dưới dạng ISO để submit API
            setForm(prev => ({
              ...prev,
              [activeDateKey]: picked.toISOString(),
            }));
          }
          setActiveDateKey(null);
        }}
        onCancel={() => {
          setOpenDatePicker(false);
          setActiveDateKey(null);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: spacing.medium,
  },
  form: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.medium,
    paddingHorizontal: spacing.medium,
    marginBottom: spacing.medium,
    paddingVertical: spacing.small,
  },
  form_item: {
    backgroundColor: colors.white,
    marginBottom: spacing.medium,
  },
});

export default AddEmployee;
