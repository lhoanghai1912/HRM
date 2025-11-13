import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import AppStyles from './AppStyle';
import icons from '../assets/icons';
import { mapFieldType, renderField } from '../utils/formField';
import { navigate } from '../navigation/RootNavigator';
import { Screen_Name } from '../navigation/ScreenName';

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
    handlePickOrganization: (fieldName: string, cfg: any) => void;
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
  id, // <-- truyền vào đây
  isGroupDetail, // <-- thêm vào đây
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
                marginBottom: 24,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 8,
                }}
                onPress={() => {
                  console.log('isgroupdetail', isGroupDetail);
                  console.log('expand', expanded);

                  if (parent.groupType !== 2 || isGroupDetail) {
                    console.log('Toggle section for parent id:', parent.id);

                    toggleSection(parent.id);
                  } else {
                    console.log([id, parent]);
                    navigate(Screen_Name.Group, {
                      // screen: Screen_Name.Detail_Group,
                      id, // <-- lấy từ props của RenderFields
                      groupLabel: parent.label,
                      groupConfig: parent,
                    });
                  }
                }}
              >
                <Text style={{ fontWeight: 'bold', fontSize: 16, margin: 8 }}>
                  {parent.name}
                </Text>
                <Image
                  style={[AppStyles.icon]}
                  source={expanded ? icons.down : icons.up}
                />
              </TouchableOpacity>

              {/* Nếu parent có groupFieldConfigs thì render luôn ở đây */}
              {expanded &&
                parent.groupFieldConfigs &&
                parent.groupFieldConfigs.length > 0 && (
                  <View style={{ marginHorizontal: 16, marginBottom: 8 }}>
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
                            style={{ marginHorizontal: 16, marginBottom: 4 }}
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
                                onPickSelectOne: (fieldName: string) => {
                                  let locationID = false;
                                  try {
                                    if (cfg.customConfig) {
                                      const parsedConfig =
                                        typeof cfg.customConfig === 'string'
                                          ? JSON.parse(cfg.customConfig)
                                          : cfg.customConfig;
                                      locationID =
                                        parsedConfig?.LocationID === true;
                                    }
                                  } catch (e) {
                                    locationID = false;
                                  }
                                  if (locationID) {
                                    handlers.handlePickLocation(fieldName, cfg);
                                  } else {
                                    handlers.handlePickSelect(fieldName, cfg);
                                  }
                                },
                                onPickSelectMulti: (
                                  fieldName: string,
                                  displayField: string,
                                  pickerData: any,
                                  selectedIds: any[],
                                ) => {
                                  handlers.handlePickSelect(
                                    fieldName,
                                    cfg,
                                    selectedIds,
                                  );
                                },
                                onPickFile: handlers.handlePickFile,
                                onPickImage: handlers.handlePickImage,
                                onClearFile: handlers.handleClearFile,
                                onPickOrganization: (
                                  fieldName: string,
                                  fieldCfg: any,
                                ) => {
                                  handlers.handlePickOrganization(
                                    fieldName,
                                    fieldCfg,
                                  );
                                },
                              },
                            )}
                          </View>
                        );
                      })}
                  </View>
                )}

              {/* Nếu child có groupFieldConfigs thì render luôn ở đây */}
              {expanded &&
                children.map(child => (
                  <View
                    key={child.id}
                    style={{ marginHorizontal: 16, marginBottom: 8 }}
                  >
                    <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                      {child.name}
                    </Text>
                    {child.groupFieldConfigs
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
                            style={{ marginHorizontal: 16, marginBottom: 4 }}
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
                                onPickSelectOne: (fieldName: string) => {
                                  let locationID = false;
                                  try {
                                    if (cfg.customConfig) {
                                      const parsedConfig =
                                        typeof cfg.customConfig === 'string'
                                          ? JSON.parse(cfg.customConfig)
                                          : cfg.customConfig;
                                      locationID =
                                        parsedConfig?.LocationID === true;
                                    }
                                  } catch (e) {
                                    locationID = false;
                                  }
                                  if (locationID) {
                                    handlers.handlePickLocation(fieldName, cfg);
                                  } else {
                                    handlers.handlePickSelect(fieldName, cfg);
                                  }
                                },
                                onPickSelectMulti: (
                                  fieldName: string,
                                  displayField: string,
                                  pickerData: any,
                                  selectedIds: any[],
                                ) => {
                                  handlers.handlePickSelect(
                                    fieldName,
                                    cfg,
                                    selectedIds,
                                  );
                                },
                                onPickFile: handlers.handlePickFile,
                                onPickImage: handlers.handlePickImage,
                                onClearFile: handlers.handleClearFile,
                                onPickOrganization: (
                                  fieldName: string,
                                  fieldCfg: any,
                                ) => {
                                  handlers.handlePickOrganization(
                                    fieldName,
                                    fieldCfg,
                                  );
                                },
                              },
                            )}
                          </View>
                        );
                      })}
                  </View>
                ))}
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
