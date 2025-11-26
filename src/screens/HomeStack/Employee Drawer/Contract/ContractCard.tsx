// components/ContractCard.js
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import icons from '../../../../assets/icons';
import { ms, spacing } from '../../../../utils/spacing';
import { border, fonts } from '../../../../utils/fontSize';

const ContractCard = ({ item, onPress }) => {
  const Row = ({ label, value }) => (
    <View
      style={{
        flexDirection: 'row',
        marginBottom: 3,
        marginLeft: spacing.xlarge,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ width: 110, color: '#666' }}>{label}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: '500', textAlign: 'center' }}>{value}</Text>
      </View>
    </View>
  );
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: '#fff',
        padding: spacing.medium,
        borderRadius: border.radiusMedium,
        marginVertical: spacing.small,
        marginHorizontal: spacing.small,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: fonts.normal,
            color: '#005bac',
          }}
        >
          {item.contractNo}
        </Text>

        <Image
          source={icons.show_pass}
          style={{ width: ms(20), height: ms(20) }}
        />
      </View>

      {/* Body */}
      <View
        style={{
          marginTop: spacing.small,
          marginLeft: spacing.medium,
        }}
      >
        <Row label="Trạng thái" value={item.contractStatusName} />
        <Row label="Loại hợp đồng" value={item.contractSubject} />
        <Row label="Thời hạn" value={item.contractPeriodName} />
        <Row label="Ngày hết hạn" value={formatDate(item.endDate)} />
      </View>
    </TouchableOpacity>
  );
};

export default ContractCard;

/* ---- Helper Functions ---- */

const getContractDuration = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);

  const years = e.getFullYear() - s.getFullYear();
  const months = e.getMonth() - s.getMonth();

  if (years > 0 && months === 0) return `${years} năm`;
  if (years > 0 && months > 0) return `${years} năm ${months} tháng`;
  return `${months} tháng`;
};

const formatDate = d => {
  if (!d) {
    return null;
  }

  const dt = new Date(d);
  return dt.toLocaleDateString('vi-VN');
};
