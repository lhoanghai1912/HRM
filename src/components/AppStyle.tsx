import { StyleSheet } from 'react-native';
import { fonts } from '../utils/fontSize';
import { colors } from '../utils/color';
import { ms, spacing } from '../utils/spacing';

const AppStyles = StyleSheet.create({
  title: {
    fontSize: fonts.xlarge,
    color: colors.black,
    textAlign: 'left',
    fontWeight: 500,
    marginBottom: spacing.small,
  },
  label: {
    fontSize: fonts.large,
    color: '#333',
  },
  line: {
    marginVertical: spacing.small,
    borderColor: colors.Gray,
    borderWidth: 0.7,
    width: '100%',
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: spacing.medium,
    verticalAlign: 'middle',
    fontSize: fonts.normal,
    borderWidth: 1,
    borderColor: colors.Gray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: spacing.medium,
  },
  disable: {
    opacity: 0.5,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: spacing.medium,
    verticalAlign: 'middle',
    fontSize: fonts.normal,
    borderWidth: 1,
    borderColor: colors.Gray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: spacing.medium,
  },
  avartar: {
    width: ms(50),
    height: ms(50),
    borderRadius: 500,
  },
  text: {
    fontSize: fonts.normal,
    color: colors.darkGray,
  },
  whitetext: {
    fontSize: fonts.normal,
    color: colors.white,
  },

  icon: { width: ms(25), height: ms(25) },

  iconSingle: {
    width: 30,
    flexDirection: 'row',
    position: 'absolute',
    resizeMode: 'contain',
    right: 0,
    top: '20%',
    justifyContent: 'space-between',
  },

  iconGroup: {
    width: 60,
    flexDirection: 'row',
    position: 'absolute',
    resizeMode: 'contain',
    top: '20%',
    justifyContent: 'space-between',
    right: spacing.small,
  },

  buttonGroup: {
    // width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.medium,
  },

  scrollView: {
    flex: 1,
    paddingHorizontal: spacing.medium,
  },
  scrollContent: {
    paddingBottom: spacing.large, // Đảm bảo có đủ không gian khi cuộn
  },
  dropdownWrapper: {
    position: 'relative', // Quan trọng để định vị dropdown tuyệt đối bên trong
  },
  dropdown: {
    position: 'absolute',
    top: 90, // Tùy chỉnh tùy theo chiều cao input
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.Gray,
    borderRadius: 6,
    zIndex: 100,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  linkText: {
    color: colors.primary,
    fontSize: fonts.normal,
    textDecorationLine: 'underline',
    textDecorationColor: colors.blue,
  },
});

export default AppStyles;
