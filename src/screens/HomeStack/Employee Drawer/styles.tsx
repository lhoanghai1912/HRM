import { StyleSheet } from 'react-native';
import { spacing } from '../../../utils/spacing';
import { border, weight } from '../../../utils/fontSize';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },

  tableHeader: {},
  title: { fontSize: 20, fontWeight: weight.bold, color: '#222' },
  searchInput: {
    flex: 1,
    paddingHorizontal: spacing.medium,
    backgroundColor: '#f3f4f6',
    borderRadius: spacing.small,
    borderWidth: 1,
    marginRight: spacing.medium,
    borderColor: '#ccc',
  },
  table: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.underline,
    alignItems: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  checkboxCell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: border.radiusSmall,
    backgroundColor: '#fff',
  },
  cell: {
    color: '#222',
    paddingHorizontal: spacing.small,
    textAlign: 'center',
    paddingVertical: 4,
  },
  headerCell: {
    fontWeight: weight.bold,
    color: '#374151',
    paddingHorizontal: spacing.small,
    textAlign: 'center',
  },
  bodyScroll: {
    flex: 1,
  },
  footer: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: spacing.medium,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    marginBottom: spacing.small,
  },
  headerText: { color: '#374151' },
  loadMoreBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
    borderRadius: border.radiusSmall,
  },
  loadMoreText: {
    color: '#f97316',
    fontWeight: weight.bold,
  },
});

export default styles;
