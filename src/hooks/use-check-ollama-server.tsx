import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useSnapshot } from 'valtio';

import { ollamaState } from '@/lib/states/ollama.state';

export const useCheckOllamaServer = () => {
  const { host } = useSnapshot(ollamaState);

  const checkOllamaServer = useCallback(async () => {
    try {
      const response = await fetch(host);
      if (!response.ok) {
        throw new Error('Failed to check Ollama server');
      }
      const text = await response.text();

      return text === 'Ollama is running';
    } catch (error) {
      console.error(error);
      throw new Error('Failed to check Ollama server');
    }
  }, [host]);

  return useQuery({
    queryKey: [
      'check-ollama-server',
      {
        host,
      },
    ],
    queryFn: () => checkOllamaServer(),
  });
};
