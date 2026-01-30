import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
} from 'react-native';
import { ms, spacing } from '../../utils/spacing';
import icons from '../../assets/icons';
import AppStyles from '../AppStyle';
import { ScrollView } from 'react-native';
import { SearchBar } from 'react-native-screens';
import { border, weight } from '../../utils/fontSize';
import { useColors } from '../../hooks/useColors';

const TreePicker = ({
  visible,
  data,
  onSelect,
  onClose,
  selectedId,
  onSearch,
}) => {
  const colors = useColors();
  const [expandedSections, setExpandedSections] = useState({});
  const [searchText, setSearchText] = useState('');

  const toggleSection = id => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Hàm xử lý khi ấn nút search
  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchText);
    }
  };

  // Xử lý khi clear search
  const handleClearSearch = () => {
    setSearchText('');
    if (onSearch) {
      onSearch(''); // Gọi API với search rỗng để reset
    }
  };

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
                style={[
                  AppStyles.icon,
                  { marginRight: spacing.small, tintColor: colors.text },
                ]}
                source={expanded ? icons.down : icons.up}
              />
            </TouchableOpacity>
          ) : (
            <View style={[AppStyles.icon, { marginRight: spacing.small }]} />
          )}
          <TouchableOpacity
            onPress={() => {
              onSelect(node), console.log('Selected node:', node);
            }}
            style={{
              backgroundColor:
                node.id === selectedId ? colors.primary : undefined,
              paddingHorizontal: spacing.small,
              paddingVertical: ms(4),
              marginBottom: spacing.small,
              borderWidth: 0.5,
              borderColor: colors.border,
              borderRadius: border.radiusMedium,
            }}
          >
            <Text style={[AppStyles.text, { color: colors.text }]}>
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
        <View
          style={[
            styles.container,
            { backgroundColor: colors.surface, shadowColor: colors.black },
          ]}
        >
          <View style={styles.toolbar}>
            <TextInput
              placeholder="Tìm kiếm"
              style={[styles.searchInput, { color: colors.text }]}
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            <TouchableOpacity onPress={handleClearSearch}>
              <Image
                source={icons.clear}
                style={[
                  AppStyles.icon,
                  {
                    tintColor: colors.text,
                    display: searchText ? 'flex' : 'none',
                    marginRight: spacing.small,
                  },
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSearch}>
              <Image
                source={icons.search}
                style={[AppStyles.icon, { tintColor: colors.text }]}
              />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={[styles.wrapContent, { borderColor: colors.border }]}
          >
            <View
              style={[
                styles.mainContent,
                { backgroundColor: colors.background },
              ]}
            >
              {Array.isArray(data) && data.map(item => renderNode(item))}
            </View>
          </ScrollView>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text
              style={{
                fontWeight: weight.bold,
                fontSize: 16,
                color: colors.text,
              }}
            >
              Đóng
            </Text>
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
    backgroundColor: '#fff',
    borderRadius: border.radiusLarge,
    width: '90%',
    maxHeight: '75%',
    minHeight: '10%',
    padding: spacing.medium,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: spacing.small,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: border.radiusMedium,
    paddingHorizontal: spacing.small,
  },
  wrapContent: {
    borderWidth: 0.5,
    borderRadius: border.radiusMedium,
    borderColor: '#ccc',
  },
  mainContent: {
    // flex: 1,
    backgroundColor: '#fff',
    padding: spacing.small,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginBottom: spacing.small,
    padding: spacing.small,
  },
  searchInput: {
    flex: 1,
    borderRadius: border.radiusSmall,
  },
});

export default TreePicker;
