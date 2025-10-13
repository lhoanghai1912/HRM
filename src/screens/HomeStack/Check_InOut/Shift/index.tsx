import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import CustomHeader from '../../../../navigation/CustomHeader';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { ms, spacing } from '../../../../utils/spacing';

type Row = {
  name: string;
  work: string;
  time: string;
  unit: string;
  object: string;
  location: string;
};

const data: Row[] = [
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
  {
    name: 'cahanhchinh02082025',
    work: 'cahanhchinh02082025',
    time: '01/01/2025 - 01/08/2026',
    unit: 'Phòng Hành Chính',
    object: 'Phòng Hành Chính',
    location: '-',
  },
];

const PAGE_SIZE = 10;

const ShiftDetail = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + PAGE_SIZE, data.length));
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        label="Details Shift"
        Home={false}
        onMenuPress={() => navigation.openDrawer()}
      />

      {/* Toolbar */}
      <View style={styles.toolbar}>
        <Text style={styles.title}>Phân ca chi tiết</Text>
        <TextInput placeholder="Tìm kiếm" style={styles.searchInput} />
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Thêm</Text>
        </TouchableOpacity>
      </View>

      {/* Table */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRowHeader}>
            <View style={styles.checkboxCell}>
              <View style={styles.checkbox} />
            </View>
            <Text style={[styles.headerCell, styles.cell]}>
              Tên bảng phân ca
            </Text>
            <Text style={[styles.headerCell, styles.cell]}>Ca làm việc</Text>
            <Text style={[styles.headerCell, styles.cell]}>
              Thời gian áp dụng
            </Text>
            <Text style={[styles.headerCell, styles.cell]}>Đơn vị áp dụng</Text>
            <Text style={[styles.headerCell, styles.cell]}>
              Đối tượng áp dụng
            </Text>
            <Text style={[styles.headerCell, styles.cell]}>
              Địa điểm làm việc
            </Text>
          </View>

          {/* Table Body */}
          <ScrollView style={styles.bodyScroll}>
            {data.slice(0, visibleCount).map((item, idx) => (
              <View key={idx} style={styles.tableRow}>
                <View style={styles.checkboxCell}>
                  <View style={styles.checkbox} />
                </View>
                <Text style={[styles.cell]}>{item.name}</Text>
                <Text style={[styles.cell]}>{item.work}</Text>
                <Text style={[styles.cell]}>{item.time}</Text>
                <Text style={[styles.cell]}>{item.unit}</Text>
                <Text style={[styles.cell]}>{item.object}</Text>
                <Text style={[styles.cell]}>{item.location}</Text>
              </View>
            ))}
            {visibleCount < data.length && (
              <TouchableOpacity
                style={styles.loadMoreBtn}
                onPress={handleLoadMore}
              >
                <Text style={styles.loadMoreText}>Tải thêm...</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Tổng số bản ghi: {data.length}</Text>
        <Text style={styles.footerText}>{visibleCount}</Text>
        <Text style={styles.footerText}>Từ 1 đến {visibleCount} bản ghi</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  searchInput: {
    marginLeft: 16,
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  addButton: {
    marginLeft: 16,
    backgroundColor: '#f97316',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  table: { maxWidth: ms(2000) },
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    alignItems: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    alignItems: 'center',
  },
  checkboxCell: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#9ca3af',
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  cell: {
    // paddingHorizontal: 4,
    color: '#222',
    flex: 1,
    marginHorizontal: 8,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'red',
  },
  headerCell: {
    flex: 1,
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
    backgroundColor: 'red',
  },
  bodyScroll: { flex: 1 },
  footer: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  footerText: { color: '#374151' },
  loadMoreBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
    borderRadius: 6,
  },
  loadMoreText: {
    color: '#f97316',
    fontWeight: 'bold',
  },
});

export default ShiftDetail;
