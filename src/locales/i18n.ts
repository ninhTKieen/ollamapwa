import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './langs/en.json';
import vi from './langs/vi.json';

i18n.use(initReactI18next).init({
  lng: localStorage.getItem('locale') || 'en',
  fallbackLng: 'en',
  initImmediate: true,
  compatibilityJSON: 'v4',
  debug: import.meta.env.NODE_ENV !== 'production',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      translation: en,
    },
    vi: {
      translation: vi,
    },
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
