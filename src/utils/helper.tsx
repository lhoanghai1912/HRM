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
  },
): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!layout?.pageData) {
    return { isValid: true, errors };
  }

  // Helper: lấy customConfig (đã parse JSON string nếu có)
  const getCustomConfig = (fieldName: string) => {
    const cfg = customConfigs.find(c => c.fieldName === fieldName)?.config;
    if (!cfg) return {};

    // nếu là string → parse JSON
    try {
      return typeof cfg === 'string' ? JSON.parse(cfg) : cfg;
    } catch (e) {
      return {};
    }
  };

  // Helper: check empty
  const isEmptyValue = (value: any) => {
    return (
      value === undefined ||
      value === null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0)
    );
  };

  layout.pageData.forEach(pageItem => {
    pageItem.groupFieldConfigs?.forEach(cfg => {
      const customCfg = getCustomConfig(cfg.fieldName);
      const fieldValue = formData[cfg.fieldName];

      // 1️⃣ REQUIRED RULE
      if (customCfg?.isRequired && isEmptyValue(fieldValue)) {
        errors[cfg.fieldName] = `${
          cfg.label || cfg.fieldName
        } không được để trống`;
        return;
      }

      // 2️⃣ EXTRA RULES
      if (extraRules?.[cfg.fieldName]) {
        const msg = extraRules[cfg.fieldName](fieldValue, cfg);
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
