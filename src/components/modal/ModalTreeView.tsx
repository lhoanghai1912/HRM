import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { colors } from '../../utils/color';
import { ms, spacing } from '../../utils/spacing';
import icons from '../../assets/icons';
import AppStyles from '../AppStyle';
import { ScrollView } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MIN_HEIGHT_PERCENT = 0.5; // 50%
const MAX_HEIGHT_PERCENT = 0.75; // 75%

const TreePicker = ({ visible, data, onSelect, onClose, selectedId }) => {
  const [expandedSections, setExpandedSections] = useState({});
  const [contentHeight, setContentHeight] = useState(SCREEN_HEIGHT * MIN_HEIGHT_PERCENT);

  // Tính toán chiều cao dựa trên số lượng items được expand
  useEffect(() => {
    const countVisibleNodes = (nodes, level = 0) => {
      let count = 0;
      nodes?.forEach(node => {
        count++; // Đếm node hiện tại
        if (node.childrent && expandedSections[node.id]) {
          count += countVisibleNodes(node.childrent, level + 1);
        }
      });
      return count;
    };

    const visibleCount = countVisibleNodes(data);
    // Mỗi item cao khoảng 50px, thêm padding
    const estimatedHeight = Math.min(
      Math.max(visibleCount * 50 + 100, SCREEN_HEIGHT * MIN_HEIGHT_PERCENT),
      SCREEN_HEIGHT * MAX_HEIGHT_PERCENT,
    );
    
    setContentHeight(estimatedHeight);
  }, [expandedSections, data]);

  const toggleSection = id => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // data là mảng tree, mỗi node có: id, name, childrent
  const renderNode = (node, level = 0) => {
    const hasChildren = node.childrent && node.childrent.length > 0;
    const expanded = expandedSections[node.id];

    return (
      <View key={node.id} style={{ marginLeft: level * spacing.medium }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {hasChildren ? (
            <TouchableOpacity onPress={() => toggleSection(node.id)}>
              <Image
                style={[AppStyles.icon, { marginRight: spacing.small }]}
                source={expanded ? icons.down : icons.up}
              />
            </TouchableOpacity>
          ) : (
            <>
              <View style={[AppStyles.icon, { marginRight: spacing.small }]} />
            </>
          )}
          <TouchableOpacity
            onPress={() => onSelect(node)}
            style={{
              backgroundColor:
                node.id === selectedId ? colors.primary : undefined,
              paddingHorizontal: spacing.small,
              paddingVertical: ms(4),
              marginBottom: spacing.small,
              borderWidth: 0.5,
              borderColor: colors.Gray,
              borderRadius: 10,
            }}
          >
            <Text
              style={[
                AppStyles.text,
                {
                  color: node.id === selectedId ? colors.black : undefined,
                },
              ]}
            >
              {node.orgStructName}
            </Text>
          </TouchableOpacity>
        </View>
        {hasChildren &&
          expanded &&
          node.childrent.map(child => renderNode(child, level + 1))}
      </View>
    );
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { height: contentHeight }]}>
          <View style={styles.mainContent}>
            <ScrollView style={{ flex: 1 }}>
              {Array.isArray(data) && data.map(item => renderNode(item))}
            </ScrollView>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.medium,
  },
  container: {
    backgroundColor: colors.blue,
    borderRadius: 16,
    width: '90%',
    // height được set dynamic từ contentHeight
    padding: spacing.medium,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mainContent: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: colors.Gray,
    padding: spacing.small,
    marginBottom: spacing.medium,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginBottom: spacing.small,
    padding: spacing.small,
  },
  item: {
    paddingVertical: ms(6),
    paddingHorizontal: spacing.small,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: colors.Gray,
    backgroundColor: colors.white,
  },
  selectedItem: {
    backgroundColor: '#e6f7ff',
    borderColor: colors.primary,
  },
});
export default TreePicker;
