// src/contexts/LanguageContext.tsx
// Language context providing internationalization support

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../language';

export type LanguageCode = 'vi' | 'en';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => Promise<void>;
  t: (key: string, options?: object) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const LANGUAGE_STORAGE_KEY = '@app_language';

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<LanguageCode>('vi');

  // Load saved language preference on mount
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLanguage && ['vi', 'en'].includes(savedLanguage)) {
          setLanguageState(savedLanguage as LanguageCode);
          await i18n.changeLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Failed to load language preference:', error);
      }
    };
    loadLanguage();
  }, []);

  // Change language and persist
  const setLanguage = async (lang: LanguageCode) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      await i18n.changeLanguage(lang);
      setLanguageState(lang);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  };

  // Translation function wrapper
  const t = (key: string, options?: Record<string, any>): string => {
    return i18n.t(key, options as any) as string;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Hook to access language context
 * Must be used within a LanguageProvider
 */
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
