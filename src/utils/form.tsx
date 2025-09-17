import icons from '../assets/icons';
import { Screen_Name } from '../navigation/ScreenName';

export const form_itemHRM = [
  {
    id: 'donTu',
    title: 'Đơn từ',
    icon: icons.list,
    bg: '#EAF1FF',
  },
  {
    id: 'tuyenDung',
    title: 'Tuyển dụng',
    icon: icons.list,
    bg: '#FFEFE5',
  },
  {
    id: 'nhanSu',
    title: 'Nhân sự',
    icon: icons.list,
    bg: '#E8FFF0',
  },
  {
    id: 'danhGia',
    title: 'Đánh giá',
    icon: icons.list,
    bg: '#FFF7E5',
  },
  {
    id: 'daoTao',
    title: 'Đào tạo',
    icon: icons.list,
    bg: '#FFECEC',
  },
  {
    id: 'chamCong',
    title: 'Chấm công',
    icon: icons.list,
    bg: '#EDF6FF',
  },
  {
    id: 'bangLuong',
    title: 'Bảng lương',
    icon: icons.list,
    bg: '#FFF0F0',
  },
  {
    id: 'kpi',
    title: 'KPI',
    icon: icons.list,
    bg: '#EBFFF5',
  },
  {
    id: 'okr',
    title: 'OKR',
    icon: icons.list,
    bg: '#FFF9EB',
  },
];

export const form_quickPinItems = [
  {
    id: 'duAn',
    title: 'Dự Án',
    icon: icons.list,

    bg: '#EAF1FF',
    screen: Screen_Name.Profile,
  },
  {
    id: 'nhanSu',
    title: 'Hồ sơ nhân sự',
    icon: icons.list,

    bg: '#EBFFF5',
    screen: Screen_Name.Profile,
  },
  {
    id: 'congViec',
    title: 'Công việc',
    icon: icons.list,

    bg: '#FFEFE5',
    screen: Screen_Name.Profile,
  },
  {
    id: 'quyTrinh',
    title: 'Quy Trình',
    icon: icons.list,

    bg: '#FFF0F0',
    screen: Screen_Name.Profile,
  },
];

export const form_employee = [
  { key: 'firstName', label: 'Họ', type: 'text', value: '' },
  { key: 'lastName', label: 'Tên', type: 'text', value: '' },
  { key: 'fullName', label: 'Họ và tên', type: 'text', value: '' },
  { key: 'otherName', label: 'Tên khác', type: 'text', value: '' },

  {
    key: 'genderName',
    label: 'Giới tính',
    type: 'picker',
    value: '',
  },

  { key: 'birthDay', label: 'Ngày sinh', type: 'date', value: '' },
  { key: 'email', label: 'Email', type: 'text', value: '' },
  { key: 'birthPlace', label: 'Nơi sinh', type: 'text', value: '' },
  { key: 'homeLand', label: 'Quê quán', type: 'text', value: '' },

  {
    key: 'maritalStatusName',
    label: 'Hôn nhân',
    type: 'picker',
    value: '',
  },

  {
    key: 'familyClassBackgroundName',
    label: 'Gia cảnh',
    type: 'text',
    value: '',
  },
  {
    key: 'personalTaxCode',
    label: 'Mã số thuế cá nhân',
    type: 'text',
    value: '',
  },
  {
    key: 'personalClassBackgroundName',
    label: 'Hoàn cảnh cá nhân',
    type: 'text',
    value: '',
  },
  { key: 'ethnicName', label: 'Dân tộc', type: 'text', value: '' },
  { key: 'religionName', label: 'Tôn giáo', type: 'text', value: '' },
  { key: 'nationalityName', label: 'Quốc tịch', type: 'picker', value: '' },

  {
    key: 'educationLevel',
    label: 'Trình độ học vấn',
    type: 'picker',
    value: '',
  },
  { key: 'levelName', label: 'Bằng cấp', type: 'picker', value: '' },
  { key: 'educationPlaceName', label: 'Nơi học', type: 'text', value: '' },
  { key: 'educationFacultyName', label: 'Khoa', type: 'text', value: '' },
  { key: 'educationMajorName', label: 'Ngành học', type: 'text', value: '' },
  { key: 'awardedYear', label: 'Năm tốt nghiệp', type: 'date', value: '' },
  { key: 'educationDegreeName', label: 'Học vị', type: 'text', value: '' },

  { key: 'kindOfPaperName', label: 'Loại giấy tờ', type: 'text', value: '' },
  { key: 'identifyNumber', label: 'Số CMND/CCCD', type: 'text', value: '' },
  {
    key: 'identifyNumberIssuedDate',
    label: 'Ngày cấp CMND/CCCD',
    type: 'date',
    value: '',
  },
  {
    key: 'identifyNumberIssuedPlace',
    label: 'Nơi cấp CMND/CCCD',
    type: 'text',
    value: '',
  },
  {
    key: 'identifyNumberExpiredDate',
    label: 'Ngày hết hạn CMND/CCCD',
    type: 'date',
    value: '',
  },

  { key: 'passportNumber', label: 'Số hộ chiếu', type: 'text', value: '' },
  {
    key: 'passportIssuedDate',
    label: 'Ngày cấp hộ chiếu',
    type: 'date',
    value: '',
  },
  {
    key: 'passportIssuedPlaceName',
    label: 'Nơi cấp hộ chiếu',
    type: 'text',
    value: '',
  },
  {
    key: 'passportEffectToDate',
    label: 'Ngày hết hạn hộ chiếu',
    type: 'date',
    value: '',
  },
];

export const picker_gender = [
  { label: 'Nam', value: 'male' },
  { label: 'Nữ', value: 'female' },
  { label: 'Khác', value: 'other' },
];

export const picker_maritalStatus = [
  { label: 'Độc thân', value: 'single' },
  { label: 'Đã kết hôn', value: 'married' },
  { label: 'Ly hôn', value: 'divorced' },
];

export const picker_region = [
  { label: 'Việt Nam', value: 'VN' },
  { label: 'Lào', value: 'LA' },
  { label: 'Campuchia', value: 'KH' },
  { label: 'Thái Lan', value: 'TH' },
  { label: 'Mỹ', value: 'US' },
];

export const picker_educationLevel = [
  { label: 'Phổ thông', value: 'highschool' },
  { label: 'Cao đẳng', value: 'college' },
  { label: 'Đại học', value: 'bachelor' },
  { label: 'Thạc sĩ', value: 'master' },
  { label: 'Tiến sĩ', value: 'doctor' },
];
export const picker_levelName = [
  { label: 'Trung bình', value: 'average' },
  { label: 'Khá', value: 'good' },
  { label: 'Giỏi', value: 'very_good' },
  { label: 'Xuất sắc', value: 'excellent' },
];
