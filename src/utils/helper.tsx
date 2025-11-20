// src/utils/date.ts (ví dụ)
export const formatDate = (dateStr?: any) => {
  if (!dateStr) return '';

  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr); // nếu ko parse được thì trả raw

  const dd = d.getDate().toString().padStart(2, '0');
  const mm = (d.getMonth() + 1).toString().padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

// src/utils/validation.ts

export interface FieldConfig {
  fieldName: string;
  label: string;
  displayField?: string;
  customConfig?: any;
  // ... các props khác nếu cần
}

export interface LayoutPageItem {
  id: number;
  parentId?: number | null;
  groupFieldConfigs?: FieldConfig[];
  // ... các props khác nếu cần
}

export interface LayoutConfig {
  pageData: LayoutPageItem[];
}

export interface CustomConfigItem {
  fieldName: string;
  config: any; // { isRequired?: boolean, ... }
}

export interface ValidationResult {
  isValid: boolean;
  errors: { [fieldName: string]: string };
}

/**
 * validateLayoutForm:
 * - Duyệt layout.pageData
 * - check isRequired trong customConfigs
 * - trả về errors theo fieldName
 */
export const validateLayoutForm = (
  layout: LayoutConfig | undefined,
  formData: any,
  customConfigs: CustomConfigItem[] = [],
  extraRules?: {
    [fieldName: string]: (value: any, cfg: FieldConfig) => string | undefined;
  }, // cho các rule đặc biệt: email, phone,...
): ValidationResult => {
  const errors: { [fieldName: string]: string } = {};

  if (!layout || !layout.pageData) {
    return { isValid: true, errors };
  }

  const getCustomConfig = (fieldName: string) =>
    customConfigs.find(c => c.fieldName === fieldName)?.config || {};

  layout.pageData.forEach(pageItem => {
    pageItem.groupFieldConfigs?.forEach(cfg => {
      const cfgCustom = getCustomConfig(cfg.fieldName);
      const isRequired = !!cfgCustom?.isRequired;

      const rawValue = formData[cfg.fieldName];

      const isEmpty =
        rawValue === undefined ||
        rawValue === null ||
        rawValue === '' ||
        (Array.isArray(rawValue) && rawValue.length === 0);

      if (isRequired && isEmpty) {
        errors[cfg.fieldName] = `${
          cfg.label || cfg.fieldName
        } không được để trống`;
        return;
      }

      // extraRules cho các rule riêng theo fieldName (optional)
      if (extraRules && extraRules[cfg.fieldName]) {
        const msg = extraRules[cfg.fieldName](rawValue, cfg);
        if (msg) {
          errors[cfg.fieldName] = msg;
        }
      }
    });
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
