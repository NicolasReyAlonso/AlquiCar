import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'expo-localization';
import { Platform } from 'react-native';
import type { LanguageDetectorAsyncModule } from 'i18next';

let AsyncStorage: typeof import('@react-native-async-storage/async-storage') | null = null;
if (Platform.OS !== 'web') {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
}

import en from "./english.json";
import es from "./spanish.json";
import fr from "./french.json";
import de from './german.json';
import it from './italian.json';

const LANG_STORAGE_KEY = 'appLanguage';

const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  detect: (callback) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      // Solo ejecutar esta parte si estamos en el navegador
      const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
      if (savedLang) {
        callback(savedLang);
      } else {
        const systemLang = RNLocalize.locale?.split('-')[0] || 'en';
        callback(systemLang);
      }
    } else {
      // En el caso de móvil o si estamos en servidor
      AsyncStorage?.getItem(LANG_STORAGE_KEY)
        .then((savedLang) => {
          if (savedLang) {
            callback(savedLang);
          } else {
            const locales = RNLocalize.getLocales();
            const systemLang = locales?.[0]?.languageCode || 'en';
            callback(systemLang);
          }
        })
        .catch(() => {
          callback('en');
        });
    }
  },
  init: () => {},
  cacheUserLanguage: (lng) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      // Solo ejecutar esta parte si estamos en el navegador
      localStorage.setItem(LANG_STORAGE_KEY, lng);
      return Promise.resolve();
    } else {
      // En el caso de móvil
      return AsyncStorage?.setItem(LANG_STORAGE_KEY, lng) ?? Promise.resolve();
    }
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
      de: { translation: de },
      it: { translation: it },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
