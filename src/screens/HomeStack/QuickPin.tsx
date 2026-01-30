// src/components/QuickPin.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import { ms, spacing } from '../../utils/spacing';
import { border, fonts } from '../../utils/fontSize';
import AppStyles from '../../components/AppStyle';
import { useColors } from '../../hooks/useColors';

interface Item {
  id: string;
  title: string;
  icon: any;
  bg: string;
  screen: string;
}
interface Props {
  visible: boolean;
  onClose: () => void;
  items: Item[];
  onSelect: (screen: string, item: Item) => void;
  title?: string;
}

const QuickPin: React.FC<Props> = ({
  visible,
  onClose,
  items,
  onSelect,
  title = 'Quick Pin',
}) => {
  const colors = useColors();
  // Helper function to darken colors
  const darken = (color: string, percent: number) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = ((num >> 8) & 0x00ff) - amt;
    const B = (num & 0x0000ff) - amt;
    return `#${(
      0x1000000 +
      (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 0 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)}`;
  };
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
        <View style={{}}>
          {items.map(it => {
            return (
              <TouchableOpacity
                key={it.id}
                style={[styles.card]}
                onPress={() => onSelect(it.screen, it)}
                activeOpacity={0.8}
              >
                <Image
                  source={it.icon}
                  style={[styles.icon, { tintColor: colors.text }]}
                />
                <Text
                  style={[AppStyles.text, { color: colors.text }]}
                  numberOfLines={1}
                >
                  {it.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
    padding: spacing.medium,
    paddingTop: ms(spacing.medium * 1.5),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: border.radiusMedium,
    marginBottom: spacing.medium,
  },
  icon: { width: ms(24), height: ms(24), marginRight: spacing.medium },
});

export default QuickPin;
