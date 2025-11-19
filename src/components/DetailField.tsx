import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { renderField, mapFieldType } from '../utils/formField';
import AppStyles from './AppStyle';
import CustomHeader from './CustomHeader';
import icons from '../assets/icons';
import { useNavigation } from '@react-navigation/native';
import { spacing } from '../utils/spacing';
import { colors } from '../utils/color';

const Detail_Field = ({ route }) => {
  const navigation = useNavigation();

  const { parent, formData, handleChange, handlers, customConfigs } =
    route.params;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}
    >
      <CustomHeader
        label="Detail Appointment"
        leftIcon={icons.back}
        leftPress={() => navigation.goBack()}
      />

      <View
        style={{
          flex: 1,
          //   paddingHorizontal: spacing.medium,
          marginBottom: spacing.medium,
        }}
      >
        <ScrollView
          style={{
            flex: 1,
            // padding: spacing.medium,
            // borderWidth: 1,
            // borderRadius: 10,
            // borderColor: colors.Gray,
          }}
        >
          {parent.groupFieldConfigs && parent.groupFieldConfigs.length > 0 && (
            <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
              {parent.groupFieldConfigs
                .sort((a, b) => {
                  if ((a.columnIndex || 0) !== (b.columnIndex || 0)) {
                    return (a.columnIndex || 0) - (b.columnIndex || 0);
                  }
                  return (a.sortOrder || 0) - (b.sortOrder || 0);
                })
                .map(cfg => {
                  const customConfig =
                    customConfigs.find(c => c.fieldName === cfg.fieldName)
                      ?.config || null;
                  return (
                    <View key={cfg.id} style={{ marginBottom: 8 }}>
                      <Text style={AppStyles.label}>
                        {cfg.label}
                        {customConfig?.isRequired && (
                          <Text style={{ color: 'red' }}> *</Text>
                        )}
                      </Text>
                      <Text>{`${cfg.typeControl}- ${mapFieldType(
                        cfg.typeControl,
                      )}`}</Text>
                      {renderField(
                        cfg,
                        formData[cfg.fieldName],
                        handleChange,
                        'edit',
                        {
                          formData,
                          onPickDate: handlers.handlePickDate,
                          onPickMonth: handlers.handlePickMonth,
                          onPickSelectOne: handlers.onPickSelectOne,
                          onPickSelectMulti: handlers.onPickSelectMulti,
                          onPickFile: handlers.handlePickFile,
                          onPickImage: handlers.handlePickImage,
                          onClearFile: handlers.handleClearFile,
                          onPickOrganization: handlers.onPickOrganization,
                          onPickEmployee: handlers.onPickEmployee,
                        },
                      )}
                    </View>
                  );
                })}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default Detail_Field;
