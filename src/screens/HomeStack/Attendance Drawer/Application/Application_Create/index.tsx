import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Screen_Name } from '../../../../../navigation/ScreenName';
import { Modal } from 'react-native';
import { colors } from '../../../../../utils/color';
import { spacing } from '../../../../../utils/spacing';
import { fonts, weight } from '../../../../../utils/fontSize';
import { form_application } from '../../../../../utils/form';
import { useTranslation } from 'react-i18next';
import { navigate } from '../../../../../navigation/RootNavigator';

const CreateApplication = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [visible, setVisible] = React.useState(true);
  const { t } = useTranslation();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.overlay}>
        {/* <View style={styles.container}>
          <FlatList
            data={form_application(t)}
            keyExtractor={item => item.screen}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  padding: 20,
                  backgroundColor: '#f5f5f5',
                  borderRadius: 10,
                  marginBottom: 15,
                }}
                onPress={() => navigate(item.screen)}
              >
                <Text style={{ fontSize: 16 }}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setVisible(false)}
          >
            <Text style={{ color: '#1890ff', fontWeight: weight.bold }}>
              Đóng
            </Text>
          </TouchableOpacity>
        </View> */}
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
  },
  container: {
    width: '85%',
    maxHeight: '70%',
    backgroundColor: colors.background,
    borderRadius: spacing.medium,
    padding: spacing.medium,
    elevation: 4,
  },
  title: {
    fontWeight: weight.bold,
    fontSize: fonts.large,
    marginBottom: spacing.medium,
    textAlign: 'center',
  },
  item: {
    paddingVertical: spacing.medium,
    borderBottomWidth: 0.5,
    borderColor: colors.underline,
    borderWidth: 0.5,
    borderRadius: spacing.medium,
    backgroundColor: colors.white,
  },
  itemText: {
    fontSize: spacing.medium,
    textAlign: 'center',
  },
  closeBtn: {
    marginTop: spacing.medium,
    alignItems: 'center',
  },
});

export default CreateApplication;
