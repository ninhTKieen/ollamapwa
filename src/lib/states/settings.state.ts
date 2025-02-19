import { proxy } from 'valtio';

type SettingsState = {
  open: boolean;
};

export const settingsState = proxy<SettingsState>({
  open: false,
});
