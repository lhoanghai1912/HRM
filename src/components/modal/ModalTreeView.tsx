import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from 'react-native';
import { colors } from '../../utils/color';
import { ms, spacing } from '../../utils/spacing';
import icons from '../../assets/icons';
import AppStyles from '../AppStyle';
import { ScrollView } from 'react-native';
const TreePicker = ({ visible, data, onSelect, onClose, selectedId }) => {
  const [expandedSections, setExpandedSections] = useState({});

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
        <View style={styles.container}>
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
    minHeight: '50%',
    padding: spacing.medium,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mainContent: {
    flex: 1,
    minHeight: '30%',
    maxHeight: '100%',
    backgroundColor: 'red',
    borderWidth: 0.5,
    borderRadius: 10,
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
