import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SectionList,
  SectionListData,
} from 'react-native';
import AppStyles from './AppStyle';
import icons from '../assets/icons';
import { mapFieldType, renderField } from '../utils/formField';
import { navigate } from '../navigation/RootNavigator';
import { Screen_Name } from '../navigation/ScreenName';
import { colors } from '../utils/color';
import { spacing } from '../utils/spacing';
import { fonts } from '../utils/fontSize';

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

// Item trong SectionList: 2 loại
type SectionItem =
  | {
      type: 'parentFields';
      id: string;
    }
  | {
      type: 'child';
      id: string;
      child: any;
    };

type ParentSection = {
  parent: any; // chính object parent trong pageData
  data: SectionItem[];
};

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

    // Lấy danh sách parent
    const parents = field.pageData
      .filter((item: any) => item.parentId === null)
      .sort((a: any, b: any) => {
        if ((a.sortOrder || 0) !== (b.sortOrder || 0)) {
          return (a.sortOrder || 0) - (b.sortOrder || 0);
        }
        return (a.columnIndex || 0) - (b.columnIndex || 0);
      });

    // Build sections cho SectionList
    const sections: ParentSection[] = parents.map((parent: any) => {
      const children = field.pageData
        .filter((child: any) => child.parentId === parent.id)
        .sort((a: any, b: any) => {
          if ((a.columnIndex || 0) !== (b.columnIndex || 0)) {
            return (a.columnIndex || 0) - (b.columnIndex || 0);
          }
          return (a.sortOrder || 0) - (b.sortOrder || 0);
        });

      const expanded = expandedSections[parent.id] ?? true;

      const items: SectionItem[] = [];

      // 1 item đại diện cho groupFieldConfigs của parent
      if (parent.groupFieldConfigs && parent.groupFieldConfigs.length > 0) {
        items.push({
          type: 'parentFields',
          id: `parentFields-${parent.id}`,
        });
      }

      // Mỗi child là 1 item
      children.forEach((child: any) => {
        items.push({
          type: 'child',
          id: `child-${child.id}`,
          child,
        });
      });

      // Nếu collapsed thì data = [] để ẩn body
      return {
        parent,
        data: expanded ? items : [],
      };
    });

    // Render 1 item trong section
    const renderItem = ({
      item,
      index,
      section,
    }: {
      item: SectionItem;
      index: number;
      section: SectionListData<SectionItem, ParentSection>;
    }) => {
      const parent = section.parent;
      const isLast = index === section.data.length - 1;

      const itemContainerStyle = {
        padding: spacing.small,
        marginHorizontal: spacing.medium,
        borderRadius: 20,
        backgroundColor: colors.white,
        marginBottom: spacing.medium,
      } as const;

      if (item.type === 'parentFields') {
        return (
          <View style={itemContainerStyle}>
            <View
              style={{
                paddingHorizontal: spacing.medium,
                paddingBottom: spacing.small,
                paddingTop: spacing.small,
              }}
            >
              {parent.groupFieldConfigs
                ?.sort((a: any, b: any) => {
                  if ((a.columnIndex || 0) !== (b.columnIndex || 0)) {
                    return (a.columnIndex || 0) - (b.columnIndex || 0);
                  }
                  return (a.sortOrder || 0) - (b.sortOrder || 0);
                })
                .map((cfg: any) => {
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
                          onPickSelectOne: (
                            fieldName: string,
                            displayField: string,
                          ) => {
                            let option = '';
                            let typeField = '';
                            try {
                              if (cfg.customConfig) {
                                const parsedConfig =
                                  typeof cfg.customConfig === 'string'
                                    ? JSON.parse(cfg.customConfig)
                                    : cfg.customConfig;
                                typeField = parsedConfig?.typeField;
                                option = parsedConfig?.Option;
                              }
                            } catch (e) {
                              typeField = '';
                            }

                            switch (typeField) {
                              case 'Location':
                                handlers.handlePickLocation(fieldName, cfg);
                                break;
                              case 'Procedure':
                                handlers.handlePickProcedure(
                                  fieldName,
                                  displayField,
                                  option,
                                );
                                break;
                              default:
                                handlers.handlePickSelect(fieldName, cfg);
                                break;
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
                            displayField: any,
                          ) => {
                            handlers.handlePickOrganization(
                              fieldName,
                              displayField,
                              cfg,
                            );
                          },
                          onPickEmployee: (
                            fieldName: string,
                            displayField: string,
                            cfg: any,
                          ) => {
                            handlers.handlePickEmployee(
                              fieldName,
                              displayField,
                              cfg,
                            );
                          },
                        },
                      )}
                    </View>
                  );
                })}
            </View>
          </View>
        );
      }

      if (item.type === 'child') {
        const child = item.child;

        return (
          <View style={itemContainerStyle}>
            <View
              style={{
                paddingHorizontal: spacing.medium,
                paddingBottom: spacing.small,
              }}
            >
              <Text style={{ fontSize: fonts.normal, fontWeight: 'bold' }}>
                {child.name}
              </Text>
              {child.groupFieldConfigs
                ?.sort((a: any, b: any) => {
                  if ((a.columnIndex || 0) !== (b.columnIndex || 0)) {
                    return (a.columnIndex || 0) - (b.columnIndex || 0);
                  }
                  return (a.sortOrder || 0) - (b.sortOrder || 0);
                })
                .map((cfg: any) => {
                  const customConfig =
                    customConfigs.find(c => c.fieldName === cfg.fieldName)
                      ?.config || null;

                  return (
                    <View key={cfg.id} style={{ marginVertical: 4 }}>
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
                          onPickSelectOne: (
                            fieldName: string,
                            displayField: string,
                          ) => {
                            let option = '';
                            let typeField = '';
                            try {
                              if (cfg.customConfig) {
                                const parsedConfig =
                                  typeof cfg.customConfig === 'string'
                                    ? JSON.parse(cfg.customConfig)
                                    : cfg.customConfig;
                                typeField = parsedConfig?.typeField;
                                option = parsedConfig?.Option;
                              }
                            } catch (e) {
                              typeField = '';
                            }

                            switch (typeField) {
                              case 'Location':
                                handlers.handlePickLocation(fieldName, cfg);
                                break;
                              case 'Procedure':
                                handlers.handlePickProcedure(
                                  fieldName,
                                  displayField,
                                  option,
                                );
                                break;
                              default:
                                handlers.handlePickSelect(fieldName, cfg);
                                break;
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
                            displayField: any,
                          ) => {
                            handlers.handlePickOrganization(
                              fieldName,
                              displayField,
                              cfg,
                            );
                          },
                          onPickEmployee: (
                            fieldName: string,
                            displayField: string,
                            cfg: any,
                          ) => {
                            handlers.handlePickEmployee(
                              fieldName,
                              displayField,
                              cfg,
                            );
                          },
                        },
                      )}
                    </View>
                  );
                })}
            </View>
          </View>
        );
      }

      return null;
    };

    // Header của mỗi section = parent item (sticky)
    const renderSectionHeader = ({
      section,
    }: {
      section: SectionListData<SectionItem, ParentSection>;
    }) => {
      const parent = section.parent;
      const expanded = expandedSections[parent.id] ?? true;

      return (
        <View
          style={{
            marginHorizontal: spacing.medium,
            borderBottomWidth: expanded ? 0 : 0.7,
            borderColor: colors.lightGray,
            backgroundColor: colors.background,
          }}
        >
          <View
            style={{
              borderRadius: 20,
              zIndex: 10,
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                // paddingHorizontal: 8,
              }}
              onPress={() => {
                if (parent.groupType !== 2 || isGroupDetail) {
                  toggleSection(parent.id);
                } else {
                  navigate(Screen_Name.Group, {
                    id,
                    groupLabel: parent.label,
                    groupConfig: parent,
                    layout: field,
                  });
                }
              }}
            >
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: fonts.normal,
                  padding: 8,
                }}
              >
                {parent.name}
              </Text>
              <Image
                style={[AppStyles.icon]}
                source={expanded ? icons.down : icons.up}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    };

    return (
      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={true}
        contentContainerStyle={{}}
      />
    );
  } catch (error) {
    console.error('Error rendering fields:', error);
    return null;
  }
};
