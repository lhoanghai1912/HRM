import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import NavBar from '../../components/Navbar';
import { OrlLevel_get, orgStruct_get } from '../../services/hr'; // giữ tên của bạn
import CustomTreeView, {
  mapOrgToTree,
  type OrgPayload,
  type TreeNode,
} from '../../components/TreeView';
import { spacing } from '../../utils/spacing';
import tableStyles from '../../components/TableStyle';
import AppStyles from '../../components/AppStyle';
import { useTranslation } from 'react-i18next';

const OrnStruct = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const [loadingOrgStruct, setLoadingOrgStruct] = useState(false);
  const [loadingOrlLevel, setLoadingOrlLevel] = useState(false);
  const [orgStructData, setOrgStructData] = useState<TreeNode[]>([]);
  const [orlLevelData, setOrlLevelData] = useState<TreeNode[]>([]);
  const [q, setQ] = useState('');
  const { t } = useTranslation();
  useEffect(() => {
    fetchOrgStruct();
    fetchOrlLevel();
  }, []);
  const fetchOrgStruct = async () => {
    setLoadingOrgStruct(true);
    // try {
    //   const res: OrgPayload[] = await orgStruct_get();
    //   console.log('resStruct', res);

    //   setOrgStructData(mapOrgToTree(res));
    // } catch (e: any) {
    // } finally {
    //   setLoadingOrgStruct(false);
    // }
  };
  const fetchOrlLevel = async () => {
    // setLoadingOrlLevel(true);
    // try {
    //   console.log('asbcawd');
    //   const res = await OrlLevel_get();
    //   setOrlLevelData(res.result);
    //   console.log('resLevel', orlLevelData);
    // } catch (e: any) {
    // } finally {
    //   setLoadingOrlLevel(false);
    // }
  };
  const renderOrlLevel = ({ item, index }: any) => {
    const status = item.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động';
    const badgeBg = item.isActive
      ? tableStyles.badgeActive
      : tableStyles.badgeInactive;
    const badgeTx = item.isActive
      ? tableStyles.badgeTextActive
      : tableStyles.badgeTextInactive;
    const isLast = index === orlLevelData.length - 1;

    return (
      <View style={[tableStyles.row, !isLast && tableStyles.rowSep]}>
        <View style={[tableStyles.cell, tableStyles.cellRight, { flex: 0.9 }]}>
          <Text style={tableStyles.td}>{String(item.id)}</Text>
        </View>
        <View style={[tableStyles.cell, tableStyles.cellRight, { flex: 2.3 }]}>
          <Text style={tableStyles.td} numberOfLines={1}>
            {item.orgLevelName}
          </Text>
        </View>
        <View style={[tableStyles.cell, tableStyles.cellRight, { flex: 4 }]}>
          <Text style={tableStyles.td} numberOfLines={1}>
            {item.orgLevelDesc ?? '—'}
          </Text>
        </View>
        <View style={[tableStyles.cell, { flex: 3 }]}>
          <View style={[tableStyles.badge, badgeBg]}>
            <Text style={badgeTx}>{status}</Text>
          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <NavBar title="Cơ cấu tổ chức" onPress={() => navigation.goBack()} />
      <View style={{ padding: 12, alignSelf: 'stretch' }}>
        {/* <TextInput
          placeholder="Search tên/mã đơn vị…"
          value={q}
          onChangeText={setQ}
          style={styles.search}
        /> */}
        <Text style={[AppStyles.label, { marginBottom: spacing.small }]}>
          ORG Struct
        </Text>
        {loadingOrgStruct ? (
          <View style={{ paddingVertical: 24 }}>
            <ActivityIndicator />
          </View>
        ) : (
          <CustomTreeView
            data={orgStructData}
            query={q}
            autoExpandOnSearch
            onSelect={n => console.log('select', n)}
            customStyle={{ marginBottom: spacing.medium }}
          />
        )}
        <TouchableOpacity>
          <Text style={[AppStyles.label, { marginBottom: spacing.small }]}>
            ORG Level
          </Text>
        </TouchableOpacity>
        <View style={[tableStyles.table]}>
          <View style={tableStyles.headerRow}>
            <View
              style={[tableStyles.cell, tableStyles.cellRight, { flex: 0.9 }]}
            >
              <Text style={tableStyles.th}>STT</Text>
            </View>
            <View
              style={[tableStyles.cell, tableStyles.cellRight, { flex: 2.3 }]}
            >
              <Text style={tableStyles.th}>Cấp tổ chức</Text>
            </View>
            <View
              style={[tableStyles.cell, tableStyles.cellRight, { flex: 4 }]}
            >
              <Text style={tableStyles.th}>Mô tả</Text>
            </View>
            <View style={[tableStyles.cell, { flex: 3 }]}>
              <Text style={tableStyles.th}>Trạng thái</Text>
            </View>
          </View>
          {loadingOrlLevel ? (
            <View style={{ paddingVertical: 24 }}>
              <ActivityIndicator />
            </View>
          ) : (
            <FlatList
              data={orlLevelData}
              renderItem={renderOrlLevel}
              ListEmptyComponent={
                <View style={{ padding: spacing.medium }}>
                  <Text style={{ textAlign: 'center', color: '#64748B' }}>
                    {t(`message.empty`)}
                  </Text>
                </View>
              }
            />
          )}
        </View>
        {loading && (
          <View style={{ paddingVertical: 24 }}>
            <ActivityIndicator />
          </View>
        )}
      </View>
    </View>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
  search: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});

export default OrnStruct;
