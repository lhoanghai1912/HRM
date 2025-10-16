import React, { use, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomHeader from '../../../../../navigation/CustomHeader';
import icons from '../../../../../assets/icons';
import { form_detail_late_early } from '../../../../../utils/form';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native-gesture-handler';
import { spacing } from '../../../../../utils/spacing';
import { getDetail_Early_LateApplications } from '../../../../../services/application';

const Detail_Late_Early = ({ navigation, route }) => {
  const { t } = useTranslation();
  const fields = form_detail_late_early(t);
  const mid = Math.ceil(fields.length / 2);
  const leftFields = fields.slice(0, mid);
  const rightFields = fields.slice(mid);
  const [loading, setLoading] = React.useState(false);

  const { id, mode } = route.params || {};
  useEffect(() => {
    if (mode === 'edit' && id) {
      // Call API lấy chi tiết đơn
      fetchData();
    }
  }, [mode, id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getDetail_Early_LateApplications(id);
      console.log('Detail Early Late Application:', res);
    } catch (error) {
      console.error('Error fetching detail Early Late Application:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        label={
          mode === 'create' ? 'Create  Late & Early' : 'Detail Late & Early '
        }
        Home={false}
        rightIcon={icons.back}
        rightPress={() => {
          navigation.goBack();
        }}
      />
      {/* <Text>Detail Late & Early Application</Text> */}
      <ScrollView>
        <View style={styles.content}>
          {/* Left column */}
          <View style={styles.column}>
            {leftFields.map((item, idx) => (
              <View key={idx} style={styles.fieldContainer}>
                <Text style={styles.label}>{item.label}:</Text>
                <Text style={styles.value}>{item.value || '-'}</Text>
              </View>
            ))}
          </View>
          {/* Right column */}
          <View style={styles.column}>
            {rightFields.map((item, idx) => (
              <View key={idx} style={styles.fieldContainer}>
                <Text style={styles.label}>{item.label}:</Text>
                <Text style={styles.value}>{item.value || '-'}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flexDirection: 'row', padding: 16, gap: 16 },
  column: { flex: 1, gap: 12 },
  fieldContainer: {
    marginBottom: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 4,
  },
  label: { fontWeight: 'bold', color: '#333', marginBottom: 2 },
  value: { color: '#222' },
});

export default Detail_Late_Early;
