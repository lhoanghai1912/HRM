import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  RefreshControl,
} from 'react-native';
import CustomHeader from '../../../../components/CustomHeader';
import icons from '../../../../assets/icons';
import { getData_Group } from '../../../../services/data';
import styles from '../styles';
import { navigate } from '../../../../navigation/RootNavigator';
import { Screen_Name } from '../../../../navigation/ScreenName';
import { ms, spacing } from '../../../../utils/spacing';
import AppStyles from '../../../../components/AppStyle';
import RenderTable from '../../../../components/renderTable';

const Group = ({ route }) => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [loading, setLoading] = React.useState(false);
  const [groupData, setGroupData] = React.useState([]);
  const { groupConfig, groupLabel, id, layout } = route.params;
  const flatListRef = useRef<FlatList>(null);

  const fetchGroupData = async () => {
    try {
      setLoading(true);
      console.log('data to fetch', {
        objectId: id,
        groupConfig: groupConfig,
      });

      const response = await getData_Group({
        objectId: id,
        groupConfig: groupConfig,
      });
      console.log('Fetched group data:', response);

      setGroupData(response.data);
    } catch (error) {
      console.error('Error fetching group data:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchGroupData();
    }, [id, groupConfig]),
  );

  const fields = layout?.pageData.filter(cfg => {
    if (cfg.parentId === groupConfig.id) {
      // Case 1: when parentId matches
      return true;
    } else if (cfg.id === groupConfig.id) {
      // Case 2: when cfg.id matches groupConfig.id
      return true;
    }
    return false;
  });

  const layoutFields =
    fields?.flatMap(group => group.groupFieldConfigs || []) || [];

  return (
    <View style={styles.container}>
      <CustomHeader
        label={groupConfig?.name}
        leftPress={() => {
          navigation.openDrawer();
        }}
        leftIcon={icons.menu}
        rightIcon={icons.add}
        rightPress={() => {
          navigate(Screen_Name.Detail_Group, {
            id: null,
            objectId: id,
            parent: route?.params?.groupConfig,
            dataPrev: null, // có data => xem/sửa
            isGroupDetail: true,
            status: 'create',
            layoutPrev: layout,
          });
        }}
      />
      <View style={styles.toolbar}>
        <TextInput
          placeholder="Tìm kiếm"
          // value={searchInput}
          style={styles.searchInput}
          // onChangeText={setSearchInput}
        />
      </View>
      <View style={styles.footer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={AppStyles.text}>
            Đang hiển thị {groupData.length} bản ghi
          </Text>
        </View>
      </View>
      {/* Table */}
      <View style={{ flex: 1 }}>
        {groupData.length === 0 && !loading ? (
          <>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  AppStyles.label,
                  {
                    flex: 1,
                    textAlign: 'center',
                    marginTop: spacing.medium,
                  },
                ]}
              >
                Không có dữ liệu
              </Text>
            </View>
          </>
        ) : (
          <>
            <View style={{ flex: 1 }}>
              <RenderTable
                layoutFields={layoutFields}
                data={groupData}
                loading={loading}
                emptyMessage="Không có dữ liệu"
                onRowPress={item => {
                  navigate(Screen_Name.Detail_Group, {
                    id: item?.id,
                    objectId: id,
                    parent: route?.params?.groupConfig,
                    dataPrev: item, // có data => xem/sửa
                    isGroupDetail: true,
                    status: 'view',
                    layoutPrev: layout,
                  });
                }}
              />
            </View>
          </>
        )}
      </View>
      {/* Footer */}

      {loading && (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <ActivityIndicator size="large" color="#E53935" />
        </View>
      )}
    </View>
  );
};

export default Group;
