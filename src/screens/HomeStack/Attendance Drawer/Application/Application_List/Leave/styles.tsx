import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../../../../contexts';
import { ms, spacing } from '../../../../../../utils/spacing';
import { border, fonts, weight } from '../../../../../../utils/fontSize';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1 },
    header: {
      height: spacing.small,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    headerTitle: {
      fontSize: fonts.large,
      fontWeight: weight.bold,
      color: '#2b5fd9',
    },
    content: {
      padding: spacing.medium,
      paddingBottom: spacing.large,
      backgroundColor: colors.surface,
      borderRadius: border.radiusMedium,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderColor: colors.underline,
      paddingVertical: spacing.small,
      marginBottom: spacing.medium,
    },
    rowLabel: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    label: { fontSize: ms(fonts.normal + 0), color: colors.black },
    required: { color: 'red', fontSize: fonts.normal },
    value: {},
    valueBold: { fontWeight: weight.bold },
    field: { marginBottom: spacing.medium },
    input: {
      borderWidth: 1,
      borderColor: '#d0d0d0',
      borderRadius: spacing.small,
      paddingHorizontal: 10,
      paddingVertical: spacing.small,
      fontSize: fonts.normal,
      backgroundColor: '#fff',
    },
    textArea: {
      minHeight: border.radiusMedium,
      textAlignVertical: 'top',
    },
    flex1: { flex: 1 },
    statusBadge: {
      alignSelf: 'flex-start',
      backgroundColor: '#1abc60',
      paddingHorizontal: spacing.medium,
      paddingVertical: spacing.small,
      borderRadius: spacing.small,
    },
    statusText: {
      fontSize: spacing.medium,
      color: '#fff',
      fontWeight: weight.bold,
    },
    attachBtn: {
      alignSelf: 'flex-start',
      borderWidth: 1,
      borderColor: '#2b5fd9',
      borderRadius: spacing.small,
      paddingHorizontal: spacing.medium,
      paddingVertical: spacing.small,
    },
    attachText: { fontSize: fonts.normal, color: '#2b5fd9' },
    timeline: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: '#e0e0e0',
      paddingTop: spacing.medium,
    },
    timelineItem: {
      flexDirection: 'row',
    },
    iconCircle: {
      width: ms(10),
      height: ms(10),
      borderRadius: border.radiusMedium,
      backgroundColor: '#1abc60',
      marginRight: spacing.small,
      justifyContent: 'center',
    },
    timelineText: { flex: 1 },
    timelineTitle: {},
    timelineDesc: {},
    submitBtn: {
      marginBottom: spacing.large,
      backgroundColor: '#2b5fd9',
      paddingVertical: spacing.medium,
      borderRadius: spacing.medium,
      alignItems: 'center',
      alignSelf: 'center',
      width: '30%',
    },
    submitText: {
      color: '#fff',
      fontSize: fonts.normal,
      fontWeight: weight.bold,
    },
  });
