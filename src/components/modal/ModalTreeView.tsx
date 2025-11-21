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
import { colors } from '../../utils/color';
import { ms, spacing } from '../../utils/spacing';
import icons from '../../assets/icons';
import AppStyles from '../AppStyle';
import { ScrollView } from 'react-native';
import { SearchBar } from 'react-native-screens';
import { border, weight } from '../../utils/fontSize';

const TreePicker = ({
  visible,
  data,
  onSelect,
  onClose,
  selectedId,
  onSearch,
}) => {
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
                style={[AppStyles.icon, { marginRight: spacing.small }]}
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
              borderColor: colors.Gray,
              borderRadius: border.radiusMedium,
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
          <View style={styles.toolbar}>
            <TextInput
              placeholder="Tìm kiếm"
              style={styles.searchInput}
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
                    display: searchText ? 'flex' : 'none',
                    marginRight: spacing.small,
                  },
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSearch}>
              <Image source={icons.search} style={AppStyles.icon} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.wrapContent}>
            <View style={styles.mainContent}>
              {Array.isArray(data) && data.map(item => renderNode(item))}
            </View>
          </ScrollView>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={{ fontWeight: weight.bold, fontSize: 16 }}>Đóng</Text>
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
    backgroundColor: colors.background,
    borderRadius: border.radiusLarge,
    width: '90%',
    maxHeight: '75%',
    minHeight: '10%',
    padding: spacing.medium,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    marginBottom: spacing.small,
    borderColor: colors.Gray,
    borderWidth: 1,
    borderRadius: border.radiusMedium,
    paddingHorizontal: spacing.small,
  },
  wrapContent: {
    borderWidth: 0.5,
    borderRadius: border.radiusMedium,
    borderColor: colors.Gray,
  },
  mainContent: {
    // flex: 1,
    backgroundColor: colors.white,
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
