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
import { colors, darken } from '../../utils/color';
import { ms, spacing } from '../../utils/spacing';
import { border, fonts } from '../../utils/fontSize';
import AppStyles from '../../components/AppStyle';

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
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={{}}>
          {items.map(it => {
            const tint = darken(it.bg, 35);
            return (
              <TouchableOpacity
                key={it.id}
                style={[styles.card]}
                onPress={() => onSelect(it.screen, it)}
                activeOpacity={0.8}
              >
                <Image
                  source={it.icon}
                  style={[styles.icon, { tintColor: tint }]}
                />
                <Text
                  style={[AppStyles.text, { color: tint }]}
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
    backgroundColor: colors.white,
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
