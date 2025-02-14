import 'i18next';

import en from '@/locales/langs/en.json';
import vi from '@/locales/langs/vi.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'en';
    resources: {
      vi: typeof vi;
      en: typeof en;
    };
  }
}
