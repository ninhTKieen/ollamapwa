import { proxy, subscribe } from 'valtio';

import { PREFERENCES_KEY } from '@/configs/constants';

import { updateTheme } from '../utils';

export interface IPreferenceStates {
  theme: 'dark' | 'light' | 'system';
  lang: 'en' | 'vi';
}

export const preferencesState = proxy<IPreferenceStates>(
  JSON.parse(localStorage.getItem(PREFERENCES_KEY) as any) ?? {
    theme: 'system',
    lang: 'vi',
  },
);

subscribe(preferencesState, () => {
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferencesState));
  updateTheme(preferencesState.theme);
});
