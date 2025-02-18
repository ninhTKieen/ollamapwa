import { Ollama } from 'ollama/browser';
import { useMemo } from 'react';
import { useSnapshot } from 'valtio';

import { ollamaState } from '@/lib/states/ollama.state';

export const useOllama = () => {
  const { host } = useSnapshot(ollamaState);

  const ollama = useMemo(() => new Ollama({ host }), [host]);

  return ollama;
};
