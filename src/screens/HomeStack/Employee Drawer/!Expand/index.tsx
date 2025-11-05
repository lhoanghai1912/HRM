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
  const id = route.params?.employeeId;
  const groupConfig = route.params?.parent;
  const flatListRef = useRef<FlatList>(null);

  const fetchGroupData = async () => {
    if (id && groupConfig) {
      try {
        setLoading(true);
        console.log('data to fetch', {
          employeeId: id,
          groupConfig: groupConfig,
        });

        const response = await getData_Group({
          employeeId: id,
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
  }, [id, groupConfig]);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.tableRow}
      onPress={() => {
        navigate(Screen_Name.Detail_Group, { id: item?.id });
      }}
    >
      {/* STT */}
      <View
        style={[styles.checkboxCell, { minWidth: COLUMN_MIN_WIDTHS.checkbox }]}
      >
        <Text>{index + 1}</Text>
      </View>
      <Text style={{ borderLeftWidth: 0.5 }} />
      {/* Mã hợp đồng*/}
      <Text
        style={[styles.cell, { minWidth: COLUMN_MIN_WIDTHS.rela, flex: 2 }]}
      >
        {item.relationshipGenderName}
      </Text>
      <Text style={{ borderLeftWidth: 0.5 }} />
      {/* Tên nhân viên */}
      <TouchableOpacity
        style={[styles.cell, { minWidth: COLUMN_MIN_WIDTHS.name, flex: 1 }]}
        onPress={() => {
          navigate(Screen_Name.Employee, {
            screen: Screen_Name.Details_Employee,
            params: { id: item.id },
          });
        }}
      >
        <Text>{item.name}</Text>
      </TouchableOpacity>
      <Text style={{ borderLeftWidth: 0.5 }} />

      {/* Ngày kí hợp đồng */}
      <Text
        style={[styles.cell, { minWidth: COLUMN_MIN_WIDTHS.gender, flex: 1 }]}
      >
        {item.gender}
      </Text>
      <Text style={{ borderLeftWidth: 0.5 }} />

      {/* Vị trí */}
      <Text style={[styles.cell, { minWidth: COLUMN_MIN_WIDTHS.dob, flex: 1 }]}>
        {/* {item.phoneNumber} */}
      </Text>
      <Text style={{ borderLeftWidth: 0.5 }} />
      {/* Phòng ban */}
      <Text
        style={[styles.cell, { minWidth: COLUMN_MIN_WIDTHS.phone, flex: 1 }]}
      >
        {/* {item.relationshipEmail} */}
      </Text>
      <Text style={{ borderLeftWidth: 0.5 }} />
      {/* Loại hợp đồng */}
      <Text
        style={[styles.cell, { minWidth: COLUMN_MIN_WIDTHS.email, flex: 1 }]}
      >
        {/* {item.relationshipBirthday} */}
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
                  { minWidth: COLUMN_MIN_WIDTHS.checkbox },
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
                  { minWidth: COLUMN_MIN_WIDTHS.rela, flex: 2 },
                ]}
              >
                Quan hệ
              </Text>
              <Text style={{ borderLeftWidth: 0.5 }} />

              <Text
                style={[
                  styles.headerCell,
                  { minWidth: COLUMN_MIN_WIDTHS.name, flex: 1 },
                ]}
              >
                Họ và tên
              </Text>
              <Text style={{ borderLeftWidth: 0.5 }} />
              <Text
                style={[
                  styles.headerCell,
                  { minWidth: COLUMN_MIN_WIDTHS.gender, flex: 1 },
                ]}
              >
                Giới tính
              </Text>
              <Text style={{ borderLeftWidth: 0.5 }} />
              <Text
                style={[
                  styles.headerCell,
                  { minWidth: COLUMN_MIN_WIDTHS.dob, flex: 1 },
                ]}
              >
                Ngày sinh
              </Text>
              <Text style={{ borderLeftWidth: 0.5 }} />
              <Text
                style={[
                  styles.headerCell,
                  { minWidth: COLUMN_MIN_WIDTHS.phone, flex: 1 },
                ]}
              >
                SDT
              </Text>
              <Text style={{ borderLeftWidth: 0.5 }} />
              <Text
                style={[
                  styles.headerCell,
                  { minWidth: COLUMN_MIN_WIDTHS.email, flex: 1 },
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
              // refreshControl={
              //   <RefreshControl
              //     refreshing={refreshing}
              //     onRefresh={handleRefresh}
              //   />
              // }
              // onEndReached={() => {
              //   if (
              //     !onEndReachedCalledDuringMomentum.current &&
              //     !loadingMore &&
              //     !noMoreData &&
              //     !loading &&
              //     groupData.length > 0 // Đảm bảo có dữ liệu trước khi load more
              //   ) {
              //     console.log('Load more triggered');
              //     handleLoadMore();
              //     onEndReachedCalledDuringMomentum.current = true;
              //   }
              // }}
              // onScroll={({ nativeEvent }) => {
              //   const currentScrollY = nativeEvent.contentOffset.y;
              //   // Reset flag khi scroll xuống (chỉ cho phép load more khi scroll xuống)
              //   if (currentScrollY > scrollY.current) {
              //     onEndReachedCalledDuringMomentum.current = false;
              //   }
              //   scrollY.current = currentScrollY;
              // }}
              // onMomentumScrollBegin={() => {
              //   onEndReachedCalledDuringMomentum.current = false;
              // }}
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
