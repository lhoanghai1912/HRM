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
import { getDisplayValue, mapFieldType, renderField } from '../utils/formField';
import { navigate } from '../navigation/RootNavigator';
import { Screen_Name } from '../navigation/ScreenName';
import { spacing } from '../utils/spacing';
import { border, fonts, weight } from '../utils/fontSize';
import { formatDate } from '../utils/helper';
import { useColors } from '../hooks/useColors';

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
  isEditMode?: boolean; // 🔹 thêm prop
  validationErrors?: { [fieldName: string]: string };
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
  parent: any;
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
  isEditMode = false,
  validationErrors = {},
}) => {
  const colors = useColors();
  try {
    if (!field || !field.pageData) return null;

    const parents = field.pageData
      .filter((item: any) => item.parentId === null)
      .sort((a: any, b: any) => {
        if ((a.sortOrder || 0) !== (b.sortOrder || 0)) {
          return (a.sortOrder || 0) - (b.sortOrder || 0);
        }
        return (a.columnIndex || 0) - (b.columnIndex || 0);
      });

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

      if (parent.groupFieldConfigs && parent.groupFieldConfigs.length > 0) {
        items.push({
          type: 'parentFields',
          id: `parentFields-${parent.id}`,
        });
      }

      children.forEach((child: any) => {
        items.push({
          type: 'child',
          id: `child-${child.id}`,
          child,
        });
      });

      return {
        parent,
        data: expanded ? items : [],
      };
    });

    // 📌 helper: render 1 field (view vs edit)
    const renderOneField = (cfg: any) => {
      const customConfig =
        customConfigs.find(c => c.fieldName === cfg.fieldName)?.config || null;
      const errorMsg = validationErrors[cfg.fieldName];
      // ưu tiên displayField nếu có
      const displayKey = cfg.displayField || cfg.fieldName;
      const valueRaw = formData[displayKey];
      const displayValue = getDisplayValue(cfg, valueRaw, { formData });

      let value = '';
      if (valueRaw !== null && valueRaw !== undefined) {
        // nếu là field ngày (typeControl = 'Day' hoặc mapFieldType = 'date')
        const fieldType = mapFieldType(cfg.typeControl);
        if (fieldType === 'date' || cfg.typeControl === 'Day') {
          value = formatDate(valueRaw);
        } else {
          value = String(valueRaw);
        }
      }

      if (!isEditMode) {
        // 🔹 View mode: label + value cùng hàng
        return (
          <View
            key={cfg.id}
            style={{
              marginVertical: 4,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottomWidth: 0.5,
              borderBottomColor: colors.border,
              paddingVertical: spacing.small,
              width: `100%`,
              paddingHorizontal: spacing.small,
            }}
          >
            <Text
              numberOfLines={1}
              style={[
                AppStyles.text,
                { paddingRight: spacing.small, width: `50%` },
              ]}
            >
              {cfg.label}
              {/* {customConfig?.isRequired && (
                <Text style={{ color: 'red' }}> *</Text>
              )} */}
            </Text>
            <Text
              ellipsizeMode="tail"
              style={{
                fontWeight: weight.bold,
                fontSize: fonts.normal,
                width: `50%`,
                textAlign: 'right',
              }}
              numberOfLines={1}
            >
              {displayValue}
            </Text>
          </View>
        );
      }

      // 🔹 Edit mode: như hiện tại
      return (
        <View
          key={cfg.id}
          style={
            errorMsg
              ? {
                  borderWidth: 1,
                  borderColor: 'red',
                  borderRadius: border.radiusSmall,
                  padding: 2,
                }
              : { marginVertical: 4 }
          }
        >
          <Text style={AppStyles.label}>
            {cfg.label}
            {customConfig?.isRequired && (
              <Text style={{ color: 'red' }}> *</Text>
            )}
          </Text>
          <Text>{`${cfg.typeControl}- ${mapFieldType(cfg.typeControl)}`}</Text>
          {renderField(cfg, formData[cfg.fieldName], handleChange, 'edit', {
            formData,
            onPickDate: handlers.handlePickDate,
            onPickMonth: handlers.handlePickMonth,
            onPickSelectOne: (fieldName: string, displayField: string) => {
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
                case 'Procedures':
                  handlers.handlePickProcedure(fieldName, displayField, option);
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
              handlers.handlePickSelect(fieldName, cfg, selectedIds);
            },
            onPickFile: handlers.handlePickFile,
            onPickImage: handlers.handlePickImage,
            onClearFile: handlers.handleClearFile,
            onPickOrganization: (fieldName: string, displayField: any) => {
              handlers.handlePickOrganization(fieldName, displayField, cfg);
            },
            onPickEmployee: (
              fieldName: string,
              displayField: string,
              cfgInner: any,
            ) => {
              handlers.handlePickEmployee(fieldName, displayField, cfgInner);
            },
          })}
        </View>
      );
    };

    const renderItem = ({
      item,
      section,
    }: {
      item: SectionItem;
      index: number;
      section: SectionListData<SectionItem, ParentSection>;
    }) => {
      const itemContainerStyle = {
        padding: spacing.small,
        marginHorizontal: spacing.medium,
        borderRadius: border.radiusExtraLarge,
        backgroundColor: colors.surface,
        marginBottom: spacing.medium,
        zindex: 0,
      } as const;

      if (item.type === 'parentFields') {
        const parent = section.parent;
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
                .map((cfg: any) => renderOneField(cfg))}
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
              <Text
                style={{
                  fontSize: fonts.normal,
                  fontWeight: weight.bold,
                }}
              >
                {child.name}
              </Text>
              {child.groupFieldConfigs
                ?.sort((a: any, b: any) => {
                  if ((a.columnIndex || 0) !== (b.columnIndex || 0)) {
                    return (a.columnIndex || 0) - (b.columnIndex || 0);
                  }
                  return (a.sortOrder || 0) - (b.sortOrder || 0);
                })
                .map((cfg: any) => renderOneField(cfg))}
            </View>
          </View>
        );
      }

      return null;
    };

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
            borderBottomColor: colors.border,
            borderColor: colors.gray200,
            zIndex: 10,
            backgroundColor: colors.background,
          }}
        >
          <View
            style={{
              borderRadius: border.radiusExtraLarge,
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: colors.background,
              }}
              onPress={() => {
                console.log('layout', field);
                console.log('section', parent);

                if (parent.groupType === 2 && !isGroupDetail) {
                  navigate(Screen_Name.Group, {
                    id,
                    groupLabel: parent.label,
                    groupConfig: parent,
                    layout: field,
                  });
                } else {
                  toggleSection(parent.id);
                }
              }}
            >
              <Text
                style={{
                  fontWeight: weight.bold,
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
        contentContainerStyle={{
          paddingBottom: spacing.medium,
        }}
      />
    );
  } catch (error) {
    console.error('Error rendering fields:', error);
    return null;
  }
};
