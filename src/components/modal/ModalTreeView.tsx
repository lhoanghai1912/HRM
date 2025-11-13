import React from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList } from 'react-native';

const ModalTreeView = ({ visible, data, onSelect, onClose, selectedId }) => {
  // data là mảng tree, mỗi node có: id, name, children
  const renderNode = (node, level = 0) => (
    <View key={node.id} style={{ marginLeft: level * 16 }}>
      <TouchableOpacity
        onPress={() => onSelect(node)}
        style={{
          padding: 8,
          backgroundColor: node.id === selectedId ? '#e6f7ff' : undefined,
        }}
      >
        <Text>{node.name}</Text>
      </TouchableOpacity>
      {node.children &&
        node.children.map(child => renderNode(child, level + 1))}
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, padding: 16 }}>
        <TouchableOpacity onPress={onClose}>
          <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Đóng</Text>
        </TouchableOpacity>
        <FlatList
          data={data}
          renderItem={({ item }) => renderNode(item)}
          keyExtractor={item => item.id.toString()}
        />
      </View>
    </Modal>
  );
};

export default ModalTreeView;
