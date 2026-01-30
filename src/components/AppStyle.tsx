import { StyleSheet } from 'react-native';
import { border, fonts, weight } from '../utils/fontSize';
import { ms, spacing } from '../utils/spacing';

// Base styles - colors should be applied inline using useColors() hook
const AppStyles = StyleSheet.create({
  title: {
    fontSize: fonts.xlarge,
    textAlign: 'left',
    fontWeight: weight.bold,
    marginBottom: spacing.small,
  },
  label: {
    fontSize: fonts.large,
  },
  line: {
    marginVertical: spacing.small,
    borderWidth: 0.7,
    width: '100%',
  },
  row: {
    marginTop: spacing.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    height: 50,
    borderRadius: border.radiusMedium,
    paddingHorizontal: spacing.medium,
    verticalAlign: 'middle',
    fontSize: fonts.normal,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: spacing.medium,
  },
  disable: {
    opacity: 0.5,
    height: 50,
    borderRadius: border.radiusMedium,
    paddingHorizontal: spacing.medium,
    verticalAlign: 'middle',
    fontSize: fonts.normal,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: spacing.medium,
  },
  avartar: {
    width: ms(50),
    height: ms(50),
    borderRadius: border.radiusCircle,
  },
  text: {
    fontSize: fonts.normal,
  },
  whitetext: {
    fontSize: fonts.normal,
  },

  // Icon base style - tintColor should be applied inline using colors.text
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.medium,
  },

  scrollView: {
    flex: 1,
    paddingHorizontal: spacing.medium,
  },
  scrollContent: {
    paddingBottom: spacing.large,
  },
  dropdownWrapper: {
    position: 'relative',
  },
  dropdown: {
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: border.radiusSmall,
    zIndex: 100,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
  },

  linkText: {
    fontSize: fonts.normal,
    textDecorationLine: 'underline',
  },
});

export default AppStyles;
