import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import AppStyles from './AppStyle';
import icons from '../assets/icons';
import { mapFieldType, renderField } from '../utils/formField';

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
  };
}

export const RenderFields: React.FC<RenderFieldsProps> = ({
  field,
  formData,
  expandedSections,
  customConfigs,
  toggleSection,
  handleChange,
  handlers,
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
                onPress={() => toggleSection(parent.id)}
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
                                  const locationID = JSON.parse(
                                    cfg.customConfig,
                                  ).LocationID;
                                  if (locationID === true) {
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
                                  const locationID = JSON.parse(
                                    cfg.customConfig,
                                  ).LocationID;
                                  if (locationID === true) {
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
