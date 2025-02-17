import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useSnapshot } from 'valtio';

import { ollamaState } from '@/lib/states/ollama.state';

import { useOllama } from './use-ollama';

export const useGetLocalModels = ({ enabled }: { enabled: boolean }) => {
  const { model } = useSnapshot(ollamaState);

  const ollama = useOllama();

  const getLocalModels = useCallback(async () => {
    try {
      const response = await ollama.list();

      if (!model) {
        ollamaState.model = response.models?.[0]?.name;
      }

      return response.models;
    } catch (error) {
      throw Promise.reject(error);
    }
  }, [model, ollama]);

  const getLocalModelsQuery = useQuery({
    queryKey: ['get-local-models', { model }],
    queryFn: getLocalModels,
    enabled,
  });

  return getLocalModelsQuery;
};
