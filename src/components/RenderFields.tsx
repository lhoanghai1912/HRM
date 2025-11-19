import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppStyles from './AppStyle';
import icons from '../assets/icons';
import { mapFieldType, renderField } from '../utils/formField';
import { navigate } from '../navigation/RootNavigator';
import { Screen_Name } from '../navigation/ScreenName';
import { colors } from '../utils/color';

interface RenderFieldsProps {
  field: any;
  formData: any;
  expandedSections: { [key: number]: boolean };
  customConfigs: { fieldName: string; config: any }[];
  toggleSection: (id: number) => void;
  handleChange: (fieldName: string, value: any) => void;
  handlers: {
    handlePickDate: (fieldName: string) => void;
    handlePickMonth: (fieldName: string) => void;
    handlePickFile: (fieldName: string) => void;
    handlePickImage: (fieldName: string) => void;
    handleClearFile: (fieldName: string) => void;
    handlePickSelect: (
      fieldName: string,
      cfg: any,
      selectedIds?: any[],
    ) => void;
    handlePickLocation: (fieldName: string, cfg: any) => void;
    handlePickProcedure: (
      fieldName: string,
      displayField: string,
      option: string,
    ) => void;
    handlePickOrganization: (
      fieldName: string,
      displayField: string,
      cfg: any,
    ) => void;
    handlePickEmployee: (
      fieldName: string,
      displayField: string,
      cfg: any,
    ) => void;
  };
  id?: string;
  isGroupDetail?: boolean;
}

export const RenderFields: React.FC<RenderFieldsProps> = ({
  field,
  formData,
  expandedSections,
  customConfigs,
  toggleSection,
  handleChange,
  handlers,
  id,
  isGroupDetail,
}) => {
  try {
    if (!field || !field.pageData) return null;

    const parents = field.pageData
      .filter(item => item.parentId === null)
      .sort((a, b) => {
        if ((a.sortOrder || 0) !== (b.sortOrder || 0)) {
          return (a.sortOrder || 0) - (b.sortOrder || 0);
        }
        return (a.columnIndex || 0) - (b.columnIndex || 0);
      });
    console.log('RenderFields - field.pageData:', field.pageData);

    const navigation = useNavigation();

    return (
      <>
        {parents.map(parent => {
          const children = field.pageData
            .filter(child => child.parentId === parent.id)
            .sort((a, b) => {
              if ((a.columnIndex || 0) !== (b.columnIndex || 0)) {
                return (a.columnIndex || 0) - (b.columnIndex || 0);
              }
              return (a.sortOrder || 0) - (b.sortOrder || 0);
            });

          const expanded = expandedSections[parent.id] ?? true;

          return (
            <View
              key={parent.id}
              style={{
                // marginBottom: 16,
                borderBottomWidth: 0.5,
                borderColor: colors.black,
                borderRadius: 8,
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 8,
                  // paddingVertical: 16,
                  backgroundColor: 'red',
                }}
                onPress={() => {
                  navigate(Screen_Name.Child_Field, {
                    parent,
                    children,
                    formData,
                    handleChange,
                    handlers,
                    customConfigs,
                  });
                }}
              >
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 16,
                    margin: 8,
                    backgroundColor: 'blue',
                  }}
                >
                  {parent.name}
                </Text>
                <Image style={[AppStyles.icon]} source={icons.arrow} />
              </TouchableOpacity>

              {expanded &&
                parent.groupFieldConfigs &&
                parent.groupFieldConfigs.length > 0 && (
                  <View style={{ marginHorizontal: 16 }}>
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
                          <View
                            key={cfg.id}
                            style={{
                              marginHorizontal: 16,
                              marginBottom: 4,
                            }}
                          >
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
                                onPickSelectOne: handlers.handlePickSelect,
                                onPickSelectMulti: handlers.handlePickSelect,
                                onPickFile: handlers.handlePickFile,
                                onPickImage: handlers.handlePickImage,
                                onClearFile: handlers.handleClearFile,
                                onPickOrganization:
                                  handlers.handlePickOrganization,
                                onPickEmployee: handlers.handlePickEmployee,
                              },
                            )}
                          </View>
                        );
                      })}
                  </View>
                )}
            </View>
          );
        })}
      </>
    );
  } catch (error) {
    console.error('Error rendering fields:', error);
    return null;
  }
};
