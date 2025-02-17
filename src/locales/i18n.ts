import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { subscribe } from 'valtio';

import { preferencesState } from '@/lib/states/preferences.state';
import { updateTheme } from '@/lib/utils';

import en from './langs/en.json';
import vi from './langs/vi.json';

i18n.use(initReactI18next).init({
  lng: preferencesState.lang,
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

subscribe(preferencesState, async () => {
  await i18n.changeLanguage(preferencesState.lang);
});

updateTheme(preferencesState.theme);

export default i18n;
