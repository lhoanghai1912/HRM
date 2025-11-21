import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import CustomHeader from '../../../../components/CustomHeader';
import icons from '../../../../assets/icons';
// import getLeaveApplications from api file

const PAGE_SIZE = 15;

const Leave = ({ navigation }) => {
  const flatListRef = useRef<FlatList>(null);

  // // Sử dụng hook phân trang
  // const {
  //   data: leaveData,
  //   loading,
  //   loadingMore,
  //   refreshing,
  //   noMoreData,
  //   handleLoadMore,
  //   handleRefresh,
  // } = usePaginatedList(getLeaveApplications, PAGE_SIZE);

  // const renderItem = ({ item }) => (
  //   <View style={{ padding: 16, borderBottomWidth: 1, borderColor: '#eee' }}>
  //     <Text>{item.title}</Text>
  //     <Text>{item.status}</Text>
  //   </View>
  // );

  // const renderFooter = () => {
  //   if (loadingMore) {
  //     return (
  //       <View style={{ padding: 16, alignItems: 'center' }}>
  //         <ActivityIndicator size="small" />
  //       </View>
  //     );
  //   }
  //   if (!loading && noMoreData && leaveData.length > 0) {
  //     return (
  //       <View style={{ padding: 16, alignItems: 'center' }}>
  //         <Text style={{ color: '#888' }}>Đã hết dữ liệu</Text>
  //       </View>
  //     );
  //   }
  //   return null;
  // };

  return (
    <View style={styles.container}>
      <CustomHeader
        label="Leave Application"
        Home={false}
        leftIcon={icons.back}
        leftPress={() => navigation.goBack()}
      />
      {/* <FlatList
        ref={flatListRef}
        data={leaveData}
        keyExtractor={item => item.id?.toString()}
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        showsVerticalScrollIndicator={false}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

export default Leave;
