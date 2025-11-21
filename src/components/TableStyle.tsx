// components/TableStyle.ts
import { StyleSheet } from 'react-native';
import { colors } from '../utils/color';
import { spacing } from '../utils/spacing';
import { border } from '../utils/fontSize';

const hair = StyleSheet.hairlineWidth;

const tableStyles = StyleSheet.create({
  table: {
    marginHorizontal: spacing.small,
    borderWidth: hair, // ⬅️ viền ngoài
    borderColor: colors.Gray,
    borderRadius: border.radiusSmall,
    overflow: 'hidden',
    position: 'relative', // ⬅️ cần để overlay tuyệt đối
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderBottomWidth: hair,
    borderBottomColor: colors.underline,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    // ❌ không đặt borderBottom ở đây
  },
  rowSep: {
    borderBottomWidth: hair, // ⬅️ ngăn cách giữa các dòng
    borderBottomColor: colors.underline,
  },
  cell: {
    paddingVertical: spacing.small,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellRight: { borderRightWidth: hair, borderRightColor: colors.Gray },

  th: { fontWeight: '700', color: '#0F172A', textAlign: 'center' },
  td: { color: '#0F172A', textAlign: 'center' },

  badge: {
    alignSelf: 'center',
    paddingHorizontal: 8,
    // paddingVertical: 4,
    borderRadius: border.radiusCircle,
  },
  badgeActive: { backgroundColor: '#E6F8EB' },
  badgeInactive: { backgroundColor: '#FDECEC' },
  badgeTextActive: { color: '#0F9D58', fontWeight: '600', textAlign: 'center' },
  badgeTextInactive: {
    color: '#D14343',
    fontWeight: '600',
    textAlign: 'center',
  },
});
export default tableStyles;
