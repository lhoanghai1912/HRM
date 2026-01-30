import { StyleSheet } from 'react-native';
import { ms, spacing } from '../../../../../utils/spacing';
import { border, fonts, weight } from '../../../../../utils/fontSize';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    height: spacing.small,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: fonts.large,
    fontWeight: weight.bold,
    color: '#2b5fd9',
  },
  content: {
    padding: spacing.medium,
    paddingBottom: spacing.large,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.small,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  rowLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.small,
  },
  label: { fontSize: ms(fonts.normal + 0), color: '#000' },
  required: { color: 'red', fontSize: fonts.normal },
  value: {},
  valueBold: { fontWeight: weight.bold },
  field: { marginTop: spacing.medium },
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
    marginTop: spacing.small,
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
    marginTop: spacing.small,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#2b5fd9',
    borderRadius: spacing.small,
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
  },
  attachText: { fontSize: fonts.normal, color: '#2b5fd9' },
  timeline: {
    marginTop: spacing.medium,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#e0e0e0',
    paddingTop: spacing.medium,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: spacing.medium,
  },
  iconCircle: {
    width: ms(10),
    height: ms(10),
    borderRadius: border.radiusMedium,
    backgroundColor: '#1abc60',
    marginTop: spacing.small,
    marginRight: spacing.small,
  },
  timelineText: { flex: 1 },
  timelineTitle: {},
  timelineDesc: {},
  submitBtn: {
    marginTop: spacing.medium,
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

export default styles;
