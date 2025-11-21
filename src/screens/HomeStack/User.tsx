// src/components/User.tsx
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
import AppStyles from '../../components/AppStyle';

interface Item {
  id: string;
  title: string;
  icon: any;
  action: () => void;
}
interface Props {
  visible: boolean;
  onClose: () => void;
  items: Item[];
  onSelect: (item: Item) => void;
  title?: string;
}

const User: React.FC<Props> = ({
  visible,
  onClose,
  items,
  onSelect,
  title = 'User',
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
        <View>
          {items.map(it => (
            <TouchableOpacity
              key={it.id}
              style={[styles.card]}
              onPress={() => onSelect(it)} // Gọi onSelect với item được chọn
              activeOpacity={0.8}
            >
              <Image source={it.icon} style={[styles.icon]} />
              <Text style={[AppStyles.text]} numberOfLines={1}>
                {it.title}
              </Text>
            </TouchableOpacity>
          ))}
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

export default User;
