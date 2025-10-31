import icons from '../assets/icons';
import { Screen_Name } from '../navigation/ScreenName';
import i18next from 'i18next';
import { Linking } from 'react-native';
import { link } from './constants';
import { navigate } from '../navigation/RootNavigator';
import { logout } from '../store/reducers/userSlice';

export type GetAllParams = {
  Page?: string; // Trang hiện tại
  PageSize?: string; // Số item mỗi trang
  OrderBy?: string; // Sắp xếp theo
  Filter?: string;
  Search?: string;
};

export const form_user = (
  t = i18next.t.bind(i18next),
  setModalLanguage?: (visible: boolean) => void,
  dispatch?: any,
) => [
  {
    id: 'profile',
    title: t('label.user_profile'),
    icon: icons.username,
    action: () => navigate(Screen_Name.Profile),
  },
  {
    id: 'settings',
    title: t('label.user_settings'),
    icon: icons.settings,
    // action: () => navigate(Screen_Name.Employee),
    action: () => navigate(Screen_Name.ChangePassword),
  },
  {
    id: 'about',
    title: t('label.user_about'),
    icon: icons.company,
    action: () => Linking.openURL(link.company),
  },
  {
    id: 'term',
    title: t('label.user_term'),
    icon: icons.term,
    action: () => Linking.openURL(link.terms),
  },
  {
    id: 'privacy',
    title: t('label.user_privacy'),
    icon: icons.privacy,
    action: () => Linking.openURL(link.privacy),
  },
  {
    id: 'language',
    title: t('label.user_language'),
    icon: icons.internet,
    action: () => setModalLanguage && setModalLanguage(true), // Đảm bảo hàm được truyền vào
  },
  {
    id: 'logout',
    title: t('label.user_logout'),
    icon: icons.logout,
    action: () => dispatch && dispatch(logout()), // Đảm bảo hàm được truyền vào
  },
];

export const form_itemStack = (t = i18next.t.bind(i18next)) => [
  {
    id: 'attendance',
    title: t('label.stack_attendance'), // Chấm công
    icon: icons.list,
    bg: '#EDF6FF',
    // screen: Screen_Name.Attendance, // Đặt tên màn hình đúng với navigation
    screen: Screen_Name.Attendance_Drawer,
  },
  {
    id: 'Shift',
    title: t('label.stack_shift'),
    icon: icons.list,
    bg: '#EAF1FF',
    screen: Screen_Name.Shift,
  },
  {
    id: 'payroll',
    title: t('label.hrm_menu_payroll'), // Lương
    icon: icons.list,
    bg: '#FFF0F0',
    // screen: Screen_Name.Payroll, // Đặt tên màn hình đúng với navigation
    screen: Screen_Name.Employee,
  },
  {
    id: 'recruitment',
    title: t('label.stack_employee'), // Tuyển dụng
    icon: icons.list,
    bg: '#FFEFE5',
    // screen: Screen_Name.Recruitment, // Đặt tên màn hình đúng với navigation
    screen: Screen_Name.Employee_Drawer,
  },
];

export const form_itemHRM = (t = i18next.t.bind(i18next)) => [
  {
    id: 'donTu',
    title: t('label.hrm_menu_requests'),
    icon: icons.list,
    bg: '#EAF1FF',
  },
  {
    id: 'tuyenDung',
    title: t('label.hrm_menu_recruitment'),
    icon: icons.list,
    bg: '#FFEFE5',
  },
  {
    id: 'nhanSu',
    title: t('label.hrm_menu_human'),
    icon: icons.list,
    bg: '#E8FFF0',
  },
  {
    id: 'danhGia',
    title: t('label.hrm_menu_evaluation'),
    icon: icons.list,
    bg: '#FFF7E5',
  },
  {
    id: 'daoTao',
    title: t('label.hrm_menu_training'),
    icon: icons.list,
    bg: '#FFECEC',
  },
  {
    id: 'chamCong',
    title: t('label.hrm_menu_attendance'),
    icon: icons.list,
    bg: '#EDF6FF',
  },
  {
    id: 'bangLuong',
    title: t('label.hrm_menu_payroll'),
    icon: icons.list,
    bg: '#FFF0F0',
  },
  {
    id: 'kpi',
    title: t('label.hrm_menu_kpi'),
    icon: icons.list,
    bg: '#EBFFF5',
  },
  {
    id: 'okr',
    title: t('label.hrm_menu_okr'),
    icon: icons.list,
    bg: '#FFF9EB',
  },
];

export const form_quickPinItems = (t = i18next.t.bind(i18next)) => [
  {
    id: 'duAn',
    title: t('label.hrm_quickPins_projects'),
    icon: icons.list,
    bg: '#EAF1FF',
    screen: Screen_Name.Profile,
  },
  {
    id: 'nhanSu',
    title: t('label.hrm_quickPins_employeeFile'),
    icon: icons.list,
    bg: '#EBFFF5',
    screen: Screen_Name.Profile,
  },
  {
    id: 'congViec',
    title: t('label.hrm_quickPins_tasks'),
    icon: icons.list,
    bg: '#FFEFE5',
    screen: Screen_Name.Profile,
  },
  {
    id: 'quyTrinh',
    title: t('label.hrm_quickPins_process'),
    icon: icons.list,
    bg: '#FFF0F0',
    screen: Screen_Name.Profile,
  },
];

export const form_application = (t = i18next.t.bind(i18next)) => [
  {
    id: 'leave',
    title: t('label.hrm_application_leave'),
    icon: icons.list,
    bg: '#EAF1FF',
    screen: Screen_Name.Leave,
  },
  {
    id: 'lateEarly',
    title: t('label.hrm_application_late_early'),
    icon: icons.list,
    bg: '#EBFFF5',
    screen: Screen_Name.Late_Early,
  },
  {
    id: 'overTime',
    title: t('label.hrm_application_over_time'),
    icon: icons.list,
    bg: '#FFEFE5',
    screen: Screen_Name.Overtime,
  },
  {
    id: 'remote',
    title: t('label.hrm_application_remote'),
    icon: icons.list,
    bg: '#EAF1FF',
    screen: Screen_Name.Remote,
  },
  {
    id: 'attendanceChange',
    title: t('label.hrm_application_update_attendance'),
    icon: icons.list,
    bg: '#EBFFF5',
    screen: Screen_Name.Attendance_Update,
  },
  {
    id: 'shiftChange',
    title: t('label.hrm_application_update_shift'),
    icon: icons.list,
    bg: '#FFAFE5',
    screen: Screen_Name.Shift_Update,
  },
  {
    id: 'trip',
    title: t('label.hrm_application_bussiness_trip'),
    icon: icons.list,
    bg: '#FBEFE5',
    screen: Screen_Name.Business_Trip,
  },
];

// form fields
export const form_employee = (t = i18next.t.bind(i18next)) => [
  {
    key: 'firstName',
    label: t('label.add_employee_firstName'),
    type: 'text',
    value: '',
  },
  {
    key: 'lastName',
    label: t('label.add_employee_lastName'),
    type: 'text',
    value: '',
  },
  {
    key: 'fullName',
    label: t('label.fullname'),
    type: 'text',
    value: '',
  },
  {
    key: 'otherName',
    label: t('label.add_employee_otherName'),
    type: 'text',
    value: '',
  },
  {
    key: 'genderName',
    label: t('label.add_employee_gender'),
    type: 'picker',
    value: '',
  },
  {
    key: 'birthDay',
    label: t('label.add_employee_birthDay'),
    type: 'date',
    value: '',
  },
  {
    key: 'email',
    label: t('label.mail'),
    type: 'text',
    value: '',
  },
  {
    key: 'birthPlace',
    label: t('label.add_employee_birthPlace'),
    type: 'text',
    value: '',
  },
  {
    key: 'homeLand',
    label: t('label.add_employee_homeLand'),
    type: 'text',
    value: '',
  },
  {
    key: 'maritalStatusName',
    label: t('label.add_employee_maritalStatusName'),
    type: 'picker',
    value: '',
  },
  {
    key: 'familyClassBackgroundName',
    label: t('label.add_employee_familyClassBackgroundName'),
    type: 'text',
    value: '',
  },
  {
    key: 'personalTaxCode',
    label: t('label.add_employee_personalTaxCode'),
    type: 'text',
    value: '',
  },
  {
    key: 'personalClassBackgroundName',
    label: t('label.add_employee_personalClassBackgroundName'),
    type: 'text',
    value: '',
  },
  {
    key: 'ethnicName',
    label: t('label.add_employee_ethnicName'),
    type: 'text',
    value: '',
  },
  {
    key: 'religionName',
    label: t('label.add_employee_religionName'),
    type: 'text',
    value: '',
  },
  {
    key: 'nationalityName',
    label: t('label.add_employee_nationalityName'),
    type: 'picker',
    value: '',
  },
  {
    key: 'educationLevel',
    label: t('label.add_employee_educationLevel'),
    type: 'picker',
    value: '',
  },
  {
    key: 'levelName',
    label: t('label.add_employee_levelName'),
    type: 'picker',
    value: '',
  },
  {
    key: 'educationPlaceName',
    label: t('label.add_employee_educationPlaceName'),
    type: 'text',
    value: '',
  },
  {
    key: 'educationFacultyName',
    label: t('label.add_employee_educationFacultyName'),
    type: 'text',
    value: '',
  },
  {
    key: 'educationMajorName',
    label: t('label.add_employee_educationMajorName'),
    type: 'text',
    value: '',
  },
  {
    key: 'awardedYear',
    label: t('label.add_employee_awardedYear'),
    type: 'date',
    value: '',
  },
  {
    key: 'educationDegreeName',
    label: t('label.add_employee_educationDegreeName'),
    type: 'text',
    value: '',
  },
  {
    key: 'kindOfPaperName',
    label: t('label.add_employee_kindOfPaperName'),
    type: 'text',
    value: '',
  },
  {
    key: 'identifyNumber',
    label: t('label.add_employee_identifyNumber'),
    type: 'text',
    value: '',
  },
  {
    key: 'identifyNumberIssuedDate',
    label: t('label.add_employee_identifyNumberIssuedDate'),
    type: 'date',
    value: '',
  },
  {
    key: 'identifyNumberIssuedPlace',
    label: t('label.add_employee_identifyNumberIssuedPlace'),
    type: 'text',
    value: '',
  },
  {
    key: 'identifyNumberExpiredDate',
    label: t('label.add_employee_identifyNumberExpiredDate'),
    type: 'date',
    value: '',
  },
  {
    key: 'passportNumber',
    label: t('label.add_employee_passportNumber'),
    type: 'text',
    value: '',
  },
  {
    key: 'passportIssuedDate',
    label: t('label.add_employee_passportIssuedDate'),
    type: 'date',
    value: '',
  },
  {
    key: 'passportIssuedPlaceName',
    label: t('label.add_employee_passportIssuedPlaceName'),
    type: 'text',
    value: '',
  },
  {
    key: 'passportEffectToDate',
    label: t('label.add_employee_passportEffectToDate'),
    type: 'date',
    value: '',
  },
];

// pickers (dùng i18n label luôn)
export const picker_gender = (t = i18next.t.bind(i18next)) => [
  { label: t('label.gender_male'), value: 'male' },
  { label: t('label.gender_female'), value: 'female' },
  { label: t('label.gender_other'), value: 'other' },
];

export const picker_maritalStatus = (t = i18next.t.bind(i18next)) => [
  { label: t('label.marital_single'), value: 'single' },
  { label: t('label.marital_married'), value: 'married' },
  { label: t('label.marital_divorced'), value: 'divorced' },
];

export const picker_region = (t = i18next.t.bind(i18next)) => [
  { label: t('label.country_vn'), value: 'VN' },
  { label: t('label.country_la'), value: 'LA' },
  { label: t('label.country_kh'), value: 'KH' },
  { label: t('label.country_th'), value: 'TH' },
  { label: t('label.country_us'), value: 'US' },
];

export const picker_educationLevel = (t = i18next.t.bind(i18next)) => [
  { label: t('label.education_highschool'), value: 'highschool' },
  { label: t('label.education_college'), value: 'college' },
  { label: t('label.education_bachelor'), value: 'bachelor' },
  { label: t('label.education_master'), value: 'master' },
  { label: t('label.education_doctor'), value: 'doctor' },
];

export const picker_levelName = (t = i18next.t.bind(i18next)) => [
  { label: t('label.level_average'), value: 'average' },
  { label: t('label.level_good'), value: 'good' },
  { label: t('label.level_very_good'), value: 'very_good' },
  { label: t('label.level_excellent'), value: 'excellent' },
];

export const form_detail_late_early = (t = i18next.t.bind(i18next)) => [
  {
    key: 'createdBy',
    label: t('label.form_detail_late_early_created_by'),
    type: 'text',
    editable: false,
    value: '',
  },
  {
    key: 'struct',
    label: t('label.form_detail_late_early_org'),
    type: 'text',
    editable: false,
    value: '',
  },
  {
    key: 'docDate',
    label: t('label.form_detail_late_early_application_date'),
    type: 'datetime',
    value: '',
  },
  {
    key: 'docDate',
    label: t('label.form_detail_late_early_application_date'),
    type: 'datetime',
    value: '',
  },
  {
    key: 'fromDate',
    label: t('label.form_detail_late_early_from_date'),
    type: 'date',
    value: '',
  },
  {
    key: 'toDate',
    label: t('label.form_detail_late_early_to_date'),
    type: 'date',
    value: '',
  },
  {
    key: 'appliesDays',
    label: t('label.form_detail_late_early_applies_days'),
    type: 'text',
    value: '',
  },
  {
    key: 'appliesShifts',
    label: t('label.form_detail_late_early_applies_shifts'),
    type: 'text',
    value: '',
  },
  {
    key: 'groupReason',
    label: t('label.form_detail_late_early_reason_group'),
    type: 'text',
    value: '',
  },
  {
    key: 'reason',
    label: t('label.form_detail_late_early_reason_detail'),
    type: 'text',
    value: '',
  },
  {
    key: 'lateStartShift',
    label: t('label.form_detail_late_early_late_start_shift'),
    type: 'number',
    value: '',
  },
  {
    key: 'soonMidShift',
    label: t('label.form_detail_late_early_early_mid_shift'),
    type: 'number',
    value: '',
  },
  {
    key: 'lateMidShift',
    label: t('label.form_detail_late_early_late_mid_shift'),
    type: 'number',
    value: '',
  },
  {
    key: 'soonEndShift',
    label: t('label.form_detail_late_early_early_end_shift'),
    type: 'number',
    value: '',
  },
  {
    key: 'lastModifiedBy',
    label: t('label.form_detail_late_early_last_modified_by'),
    type: 'text',
    value: '',
  },
  {
    key: 'relativeEmployee',
    label: t('label.form_detail_late_early_last_relative_employee'),
    type: 'text',
    value: '',
  },

  // Các trường lồng
  {
    key: 'status',
    label: t('label.form_detail_late_early_status'),
    type: 'image',
    value: '',
  },
];
