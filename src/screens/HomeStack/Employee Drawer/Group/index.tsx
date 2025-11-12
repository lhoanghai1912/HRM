import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
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
import { ScrollView } from 'react-native-gesture-handler';
import { colors } from '../../../../utils/color';
const COLUMN_MIN_WIDTHS = {
  checkbox: ms(40),
  rela: ms(120),
  name: ms(180),
  gender: ms(120),
  dob: ms(120),
  phone: ms(150),
  email: ms(120),
};
const Group = ({ route }) => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [loading, setLoading] = React.useState(false);
  const [groupData, setGroupData] = React.useState([]);
  const employeeId = route.params?.employeeId;
  const groupConfig = route.params?.groupConfig;
  const flatListRef = useRef<FlatList>(null);

  console.log('route', route.params);

  const fetchGroupData = async () => {
    if (employeeId && groupConfig) {
      try {
        setLoading(true);
        console.log('data to fetch', {
          employeeId: employeeId,
          groupConfig: groupConfig,
        });

        const response = await getData_Group({
          employeeId: employeeId,
          groupConfig: groupConfig,
        });
        console.log('Fetched group data:', response);

        setGroupData(response.data);
      } catch (error) {
        console.error('Error fetching group data:', error);
      } finally {
        setLoading(false);
      }
    }
  };
  console.log('groupData', groupData);

  useEffect(() => {
    fetchGroupData();
  }, [employeeId, groupConfig]);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.tableRow}
      onPress={() => {
        console.log(
          'Navigating to Detail_Group with item:',
          item,
          'layout',
          groupConfig,
        );

        navigate(Screen_Name.Detail_Group, {
          id: item?.id,
          employeeId: employeeId,
          parent: route?.params?.groupConfig,
          data: item,
          isGroupDetail: true, // <-- truyền thêm biến này
        });
      }}
    >
      {/* STT */}
      <View
        style={[styles.checkboxCell, { width: COLUMN_MIN_WIDTHS.checkbox }]}
      >
        <Text>{index + 1}</Text>
      </View>
      <Text style={{ borderLeftWidth: 0.5 }} />
      {/* Mối quan hệ*/}
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[styles.cell, { width: COLUMN_MIN_WIDTHS.rela, flex: 2 }]}
      >
        {item.relationshipName}
      </Text>
      <Text style={{ borderLeftWidth: 0.5 }} />
      {/* Tên */}
      <TouchableOpacity
        style={[styles.cell, { width: COLUMN_MIN_WIDTHS.name, flex: 1 }]}
        onPress={() => {
          navigate(Screen_Name.Details_Employee, {
            // parent: groupConfig,
            // id: item.id,
            // data: item,
            // isGroupDetail: true, // <-- truyền thêm biến này
            id: employeeId,
          });
        }}
      >
        <Text
          style={[
            styles.cell,
            {
              flex: 1,
              color: colors.primary,
              textDecorationLine: 'underline',
              textDecorationColor: colors.red,
            },
          ]}
        >
          {item.fullName}
        </Text>
      </TouchableOpacity>
      <Text style={{ borderLeftWidth: 0.5 }} />

      {/* Giới tính */}
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[styles.cell, { width: COLUMN_MIN_WIDTHS.gender, flex: 1 }]}
      >
        {item.genderName || ''}
      </Text>
      <Text style={{ borderLeftWidth: 0.5 }} />

      {/* Ngày sinh */}
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[styles.cell, { width: COLUMN_MIN_WIDTHS.dob, flex: 1 }]}
      >
        {item.birthday}
      </Text>
      <Text style={{ borderLeftWidth: 0.5 }} />
      {/* SĐT */}
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[styles.cell, { width: COLUMN_MIN_WIDTHS.phone, flex: 1 }]}
      >
        {item.mobile}
      </Text>
      <Text style={{ borderLeftWidth: 0.5 }} />
      {/* Email */}
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[styles.cell, { width: COLUMN_MIN_WIDTHS.email, flex: 1 }]}
      >
        {item.email}
      </Text>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    // if (loadingMore) {
    //   return (
    //     <View
    //       style={{
    //         paddingTop: spacing.medium,
    //         paddingBottom: spacing.small,
    //         alignItems: 'center',
    //       }}
    //     >
    //       <ActivityIndicator size="small" />
    //     </View>
    //   );
    // }

    return null;
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        label="Contract"
        leftPress={() => {
          navigation.openDrawer();
        }}
        leftIcon={icons.menu}
      />
      <View style={styles.toolbar}>
        <TextInput
          placeholder="Tìm kiếm"
          // value={searchInput}
          style={styles.searchInput}
          // onChangeText={setSearchInput}
        />
        {/* <TouchableOpacity onPress={() => setSearchQuery(searchInput)}>
          <Image source={icons.search} style={AppStyles.icon} />
        </TouchableOpacity> */}
      </View>
      <View style={styles.footer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={AppStyles.text}>
            Đang hiển thị {groupData.length} bản ghi
          </Text>
          <Text style={AppStyles.text}></Text>
          {/* <Text style={AppStyles.text}>{visibleCount}</Text> */}
        </View>
      </View>
      {/* Table */}
      <View style={{ flex: 1 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRowHeader}>
              <View
                style={[
                  styles.checkboxCell,
                  { width: COLUMN_MIN_WIDTHS.checkbox },
                ]}
              >
                <View>
                  <Text>#</Text>
                </View>
              </View>
              <Text style={{ borderLeftWidth: 0.5 }} />
              <Text
                style={[
                  styles.headerCell,
                  { width: COLUMN_MIN_WIDTHS.rela, flex: 2 },
                ]}
              >
                Quan hệ
              </Text>
              <Text style={{ borderLeftWidth: 0.5 }} />

              <Text
                style={[
                  styles.headerCell,
                  { width: COLUMN_MIN_WIDTHS.name, flex: 1 },
                ]}
              >
                Họ và tên
              </Text>
              <Text style={{ borderLeftWidth: 0.5 }} />
              <Text
                style={[
                  styles.headerCell,
                  { width: COLUMN_MIN_WIDTHS.gender, flex: 1 },
                ]}
              >
                Giới tính
              </Text>
              <Text style={{ borderLeftWidth: 0.5 }} />
              <Text
                style={[
                  styles.headerCell,
                  { width: COLUMN_MIN_WIDTHS.dob, flex: 1 },
                ]}
              >
                Ngày sinh
              </Text>
              <Text style={{ borderLeftWidth: 0.5 }} />
              <Text
                style={[
                  styles.headerCell,
                  { width: COLUMN_MIN_WIDTHS.phone, flex: 1 },
                ]}
              >
                SDT
              </Text>
              <Text style={{ borderLeftWidth: 0.5 }} />
              <Text
                style={[
                  styles.headerCell,
                  { width: COLUMN_MIN_WIDTHS.email, flex: 1 },
                ]}
              >
                Email
              </Text>
            </View>

            <FlatList
              ref={flatListRef}
              data={groupData}
              keyExtractor={item =>
                item.id?.toString() ||
                item.employeeCode?.toString() ||
                Math.random().toString()
              }
              style={styles.bodyScroll}
              renderItem={renderItem}
              ListEmptyComponent={
                !loading && groupData.length === 0 ? (
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
                ) : null
              }
              ListFooterComponent={renderFooter}
              onEndReachedThreshold={0.01} // Chỉ load khi rất gần cuối (1% cuối)
              showsVerticalScrollIndicator={false}
            />
          </View>
        </ScrollView>
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

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   tableHeader: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderColor: '#ccc',
//     paddingBottom: 8,
//     marginBottom: 8,
//   },
//   headerCell: {
//     flex: 1,
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   tableRow: {
//     flexDirection: 'row',
//     paddingVertical: 8,
//     borderBottomWidth: 0.5,
//     borderColor: '#eee',
//   },
//   cell: {
//     flex: 1,
//     fontSize: 15,
//   },
// });

export default Group;
