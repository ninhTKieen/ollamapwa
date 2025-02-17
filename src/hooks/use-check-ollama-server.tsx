import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

import { DEFAULT_OLLAMA_HOST } from '@/configs/constants';

export const useCheckOllamaServer = () => {
  const checkOllamaServer = useCallback(async () => {
    try {
      const response = await fetch(DEFAULT_OLLAMA_HOST);
      if (!response.ok) {
        throw new Error('Failed to check Ollama server');
      }
      const text = await response.text();

      return text === 'Ollama is running';
    } catch (error) {
      console.error(error);
      throw new Error('Failed to check Ollama server');
    }
  }, []);

  return useQuery({
    queryKey: [
      'check-ollama-server',
      {
        host: DEFAULT_OLLAMA_HOST,
      },
    ],
    queryFn: () => checkOllamaServer(),
  });
};
