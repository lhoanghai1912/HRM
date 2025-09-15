// components/CustomHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import icons from '../../assets/icons';
import { ms } from '../../utils/spacing';
import { colors } from '../../utils/color';

const CustomHeader = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Left section */}
      <View style={styles.left}>
        <TouchableOpacity>
          <Image source={icons.apple} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.username}>Lê Việt Thắng (TGD)</Text>
      </View>

      {/* Right section */}
      <View style={styles.right}>
        <TouchableOpacity>
          <Image source={icons.noti} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={icons.home} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: ms(60),
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    marginLeft: ms(8),
    fontWeight: 'bold',
    fontSize: ms(14),
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: ms(20),
    height: ms(20),
    marginLeft: ms(12),
    tintColor: '#333',
  },
  newIconStyle: {
    width: ms(24),
    height: ms(24),
    marginLeft: ms(12),
    tintColor: '#000',
  },
  updatedIcon: {
    width: ms(24),
    height: ms(24),
    marginLeft: ms(12),
    tintColor: '#000',
  },
});
