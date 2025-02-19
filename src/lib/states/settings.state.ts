import { proxy, subscribe } from 'valtio';

export interface ISettingsStates {
  open: boolean;
}

export const settingsState = proxy<ISettingsStates>({
  open: false,
});

subscribe(settingsState, () => {});
