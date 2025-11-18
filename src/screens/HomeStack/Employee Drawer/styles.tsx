import { StyleSheet } from 'react-native';
import { spacing } from '../../../utils/spacing';
import { colors } from '../../../utils/color';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  tableHeader: {},
  title: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  searchInput: {
    flex: 1,
    paddingHorizontal: spacing.medium,
    backgroundColor: '#f3f4f6',
    borderRadius: spacing.small,
    borderWidth: 1,
    marginRight: spacing.medium,
    borderColor: colors.Gray,
  },
  table: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    alignItems: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
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
    borderColor: colors.Gray,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  cell: {
    color: '#222',
    paddingHorizontal: spacing.small,
    textAlign: 'center',
    paddingVertical: 4,
  },
  headerCell: {
    fontWeight: 'bold',
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
    borderRadius: 6,
  },
  loadMoreText: {
    color: '#f97316',
    fontWeight: 'bold',
  },
});

export default styles;
