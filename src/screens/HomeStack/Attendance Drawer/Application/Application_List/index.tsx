import React, { use } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import CustomHeader from '../../../../../components/CustomHeader';
import icons from '../../../../../assets/icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { FlatList } from 'react-native-gesture-handler';
import { form_application } from '../../../../../utils/form';
import { useTranslation } from 'react-i18next';
import { navigate } from '../../../../../navigation/RootNavigator';
import { ms, spacing } from '../../../../../utils/spacing';
import { colors } from '../../../../../utils/color';
import AppStyles from '../../../../../components/AppStyle';
import { border } from '../../../../../utils/fontSize';

const ListApplication = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const data = form_application(t);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.itemBox, { backgroundColor: item.bg }]}
      onPress={() =>
        navigate(item.screen, { label: item.title, status: 'view' })
      }
    >
      <Image source={item.icon} style={AppStyles.icon} />
      <Text numberOfLines={2} style={(AppStyles.text, styles.title)}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <CustomHeader
        label="Danh sách đơn"
        leftIcon={icons.menu}
        leftPress={() => navigation.openDrawer()}
      />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={3}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.medium,
          marginTop: spacing.medium,
          backgroundColor: colors.background,
          flex: 1,
          paddingVertical: spacing.medium,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  row: {
    justifyContent: 'space-between',
    marginBottom: spacing.medium,
  },

  itemBox: {
    width: ms(100),
    height: ms(100),
    borderRadius: border.radiusLarge,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: spacing.small,
    marginBottom: spacing.medium,
  },

  title: {
    lineHeight: spacing.medium,
    paddingHorizontal: ms(4),
    textAlign: 'center',
  },
});

export default ListApplication;
