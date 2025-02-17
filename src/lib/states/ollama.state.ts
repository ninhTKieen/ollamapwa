import { proxy, subscribe } from 'valtio';

import { TChatMessage } from '@/common/types';
import { DEFAULT_OLLAMA_HOST } from '@/configs/constants';
import { OLLAMA_KEY } from '@/configs/constants';

type TOllamaState = {
  host: string;
  model: string | null;
  chatHistory: TChatMessage[];
};

type TStorageMessage = Omit<TChatMessage, 'timestamp'> & {
  timestamp: number;
};

type TStorageData = Omit<TOllamaState, 'chatHistory'> & {
  chatHistory: TStorageMessage[];
};

const fallbackData: TOllamaState = {
  host: DEFAULT_OLLAMA_HOST,
  model: null,
  chatHistory: [],
};

const syncFromStorage = () => {
  const data: TStorageData = JSON.parse(localStorage.getItem(OLLAMA_KEY) || '{}');

  return {
    host: data?.host || fallbackData.host,
    model: data?.model || fallbackData.model,
    chatHistory:
      data?.chatHistory?.map((msg: TStorageMessage) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })) || fallbackData.chatHistory,
  };
};

const syncToStorage = (data?: TOllamaState) => {
  if (!data) return;
  const storageData: TStorageData = {
    host: data.host,
    model: data.model,
    chatHistory: data.chatHistory.map((msg) => ({
      ...msg,
      timestamp: msg.timestamp.getTime(),
    })),
  };
  localStorage.setItem(OLLAMA_KEY, JSON.stringify(storageData));
};

export const ollamaState = proxy<TOllamaState>(syncFromStorage());

subscribe(ollamaState, () => {
  syncToStorage(ollamaState);
});
